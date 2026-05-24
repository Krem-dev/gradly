const axios = require('axios')
const crypto = require('crypto')
const { pool } = require('../config/database')
const creditsService = require('./credits.service')

const PAYSTACK_BASE = 'https://api.paystack.co'
const CREDITS_PER_PACK = parseInt(process.env.CREDITS_PER_PACK || '3', 10)
const PACK_PRICE_PESEWAS = parseInt(process.env.PACK_PRICE_PESEWAS || '2000', 10) // 20 GHC
const CURRENCY = process.env.CURRENCY || 'GHS'

function getSecret() {
  const k = process.env.PAYSTACK_SECRET_KEY
  if (!k || !k.startsWith('sk_')) {
    throw new Error('PAYSTACK_SECRET_KEY must be set (sk_test_... or sk_live_...)')
  }
  return k
}

function getPublicKey() {
  return process.env.PAYSTACK_PUBLIC_KEY || ''
}

function paystackClient() {
  return axios.create({
    baseURL: PAYSTACK_BASE,
    headers: {
      Authorization: `Bearer ${getSecret()}`,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  })
}

function generateReference() {
  return `gradly_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`
}

/**
 * Pricing returned to the client so the UI doesn't hardcode it.
 */
function getPricing() {
  return {
    pack: 'Convert Pack',
    creditsPerPack: CREDITS_PER_PACK,
    priceMajor: PACK_PRICE_PESEWAS / 100,
    pricePesewas: PACK_PRICE_PESEWAS,
    currency: CURRENCY,
    publicKey: getPublicKey(),
  }
}

/**
 * Initialize a Paystack transaction. Returns the URL the frontend opens
 * (either redirect or new window). After payment, Paystack hits the callback_url
 * with ?reference=XXX — frontend then calls verify, and the webhook is the
 * source of truth.
 */
async function initializePurchase({ userId, email, callbackUrl }) {
  if (!userId || !email) throw new Error('userId + email required')

  const reference = generateReference()

  const { data } = await paystackClient().post('/transaction/initialize', {
    email,
    amount: PACK_PRICE_PESEWAS,           // pesewas
    currency: CURRENCY,
    reference,
    callback_url: callbackUrl,
    metadata: {
      userId: String(userId),
      credits: CREDITS_PER_PACK,
      pack: 'Convert Pack',
    },
  })

  if (!data.status || !data.data) {
    throw new Error(data.message || 'Paystack init failed')
  }

  await pool.query(
    `INSERT INTO payments
       (user_id, reference, access_code, authorization_url, amount_pesewas, currency,
        credits_purchased, status, raw_response)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [
      userId,
      reference,
      data.data.access_code,
      data.data.authorization_url,
      PACK_PRICE_PESEWAS,
      CURRENCY,
      CREDITS_PER_PACK,
      JSON.stringify(data.data),
    ]
  )

  return {
    reference,
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    amountPesewas: PACK_PRICE_PESEWAS,
    credits: CREDITS_PER_PACK,
    publicKey: getPublicKey(),
  }
}

/**
 * Verify a transaction with Paystack and (if successful + not already fulfilled)
 * credit the user. Idempotent: safe to call twice for the same reference.
 */
async function verifyPurchase(reference) {
  if (!reference) throw new Error('reference required')

  const { data } = await paystackClient().get(
    `/transaction/verify/${encodeURIComponent(reference)}`
  )

  if (!data.status || !data.data) {
    throw new Error(data.message || 'Paystack verify failed')
  }

  const txn = data.data

  // Look up our payment row
  const [[payment]] = await pool.query(
    'SELECT id, user_id, status, credits_purchased FROM payments WHERE reference = ?',
    [reference]
  )
  if (!payment) {
    throw new Error('Unknown reference — was this transaction initialized via our backend?')
  }

  if (txn.status === 'success') {
    // ATOMIC compare-and-swap: only flip status='pending' → 'success'. If two
    // verify calls race (e.g. user's frontend AND Paystack's webhook both
    // arriving at the same time), only ONE will see affectedRows > 0 and
    // credit the user. The other sees affectedRows = 0 and short-circuits.
    //
    // This replaces the previous check-then-act pattern which was racy:
    //   if (payment.status === 'success') return
    //   UPDATE payments SET status = 'success'
    //   addCredits(...)
    // Two concurrent calls could both see status='pending' and both credit.
    const [updateResult] = await pool.query(
      `UPDATE payments
         SET status = 'success', channel = ?, paid_at = NOW(), raw_response = ?
       WHERE reference = ? AND status != 'success'`,
      [txn.channel || null, JSON.stringify(txn), reference]
    )
    if (updateResult.affectedRows === 0) {
      // Someone else already marked this payment successful — they did the credit.
      return { success: true, alreadyFulfilled: true, status: 'success', balance: null }
    }
    const newBalance = await creditsService.addCredits(
      payment.user_id,
      payment.credits_purchased,
      'purchase',
      reference,
      { paystackReference: reference, channel: txn.channel }
    )
    return { success: true, alreadyFulfilled: false, status: 'success', balance: newBalance }
  }

  // Failed or abandoned
  await pool.query(
    `UPDATE payments SET status = ?, raw_response = ? WHERE reference = ?`,
    [txn.status === 'abandoned' ? 'abandoned' : 'failed', JSON.stringify(txn), reference]
  )

  return { success: false, status: txn.status, balance: null }
}

/**
 * Webhook signature check. Paystack signs every event body with HMAC-SHA512
 * keyed on your secret key, in the `x-paystack-signature` header.
 */
function verifyWebhookSignature(rawBody, signature) {
  if (!signature) return false
  const expected = crypto
    .createHmac('sha512', getSecret())
    .update(rawBody)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))
}

async function handleWebhook(rawBody, signature) {
  if (!verifyWebhookSignature(rawBody, signature)) {
    const err = new Error('Invalid webhook signature')
    err.statusCode = 401
    throw err
  }

  const event = JSON.parse(rawBody.toString('utf8'))

  if (event.event === 'charge.success') {
    const reference = event.data?.reference
    if (reference) {
      try {
        await verifyPurchase(reference)
      } catch (err) {
        console.error('[webhook charge.success] verify failed:', err.message)
      }
    }
  }

  return { ok: true }
}

module.exports = {
  getPricing,
  initializePurchase,
  verifyPurchase,
  handleWebhook,
  verifyWebhookSignature,
  CREDITS_PER_PACK,
  PACK_PRICE_PESEWAS,
  CURRENCY,
}

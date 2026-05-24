const { pool } = require('../config/database')

/**
 * Credit balance + transactions. Uses a serializable transaction per write so
 * concurrent decrements can't race past 0 (e.g. user fires two convert requests
 * at exactly the same time with 1 credit left).
 */

async function getBalance(userId) {
  const [rows] = await pool.query('SELECT credits FROM users WHERE id = ?', [userId])
  if (!rows[0]) throw new Error('User not found')
  return rows[0].credits
}

async function listTransactions(userId, limit = 50) {
  const [rows] = await pool.query(
    `SELECT id, delta, reason, balance_after, reference, metadata, created_at
       FROM credit_transactions WHERE user_id = ?
       ORDER BY created_at DESC LIMIT ?`,
    [userId, limit]
  )
  return rows
}

/**
 * Add credits (purchase, grant, refund). Atomic: increment + audit log in one txn.
 * Returns the new balance.
 */
async function addCredits(userId, amount, reason, reference, metadata = {}) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('amount must be a positive integer')
  }
  const allowed = new Set(['purchase', 'grant', 'refund'])
  if (!allowed.has(reason)) throw new Error(`reason must be one of ${[...allowed].join(', ')}`)

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const [updateRes] = await conn.query(
      'UPDATE users SET credits = credits + ? WHERE id = ?',
      [amount, userId]
    )
    if (updateRes.affectedRows === 0) {
      await conn.rollback()
      throw new Error('User not found')
    }

    const [[user]] = await conn.query('SELECT credits FROM users WHERE id = ?', [userId])

    await conn.query(
      `INSERT INTO credit_transactions
         (user_id, delta, reason, balance_after, reference, metadata)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, amount, reason, user.credits, reference, JSON.stringify(metadata)]
    )

    await conn.commit()
    return user.credits
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

/**
 * Atomically decrement 1 credit for `reason`. Returns { ok, balanceAfter }.
 * If the user has 0 credits, returns { ok: false, balanceAfter: 0 } without throwing.
 */
async function useCredit(userId, reason = 'use', reference = null, metadata = {}) {
  // credit_transactions.reason is ENUM('purchase','use','refund','grant','expire').
  // Anything else gets silently truncated by MySQL → 'Data truncated' error.
  const allowed = new Set(['purchase', 'use', 'refund', 'grant', 'expire'])
  if (!allowed.has(reason)) {
    throw new Error(
      `useCredit reason must be one of ${[...allowed].join(', ')} — got "${reason}". ` +
        `Use the metadata arg for sub-reasons.`
    )
  }
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // Lock the user row for update — prevents two concurrent calls from both seeing 1 credit.
    const [[user]] = await conn.query(
      'SELECT credits FROM users WHERE id = ? FOR UPDATE',
      [userId]
    )
    if (!user) {
      await conn.rollback()
      throw new Error('User not found')
    }
    if (user.credits <= 0) {
      await conn.rollback()
      return { ok: false, balanceAfter: 0 }
    }

    await conn.query('UPDATE users SET credits = credits - 1 WHERE id = ?', [userId])
    const balanceAfter = user.credits - 1

    await conn.query(
      `INSERT INTO credit_transactions
         (user_id, delta, reason, balance_after, reference, metadata)
       VALUES (?, -1, ?, ?, ?, ?)`,
      [userId, reason, balanceAfter, reference, JSON.stringify(metadata)]
    )

    await conn.commit()
    return { ok: true, balanceAfter }
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

module.exports = {
  getBalance,
  listTransactions,
  addCredits,
  useCredit,
}

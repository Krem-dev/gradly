# Gradly — Deploy guide

Two services + one database. Cheapest reliable combo: **Vercel** (frontend) + **Render** or **Railway** (backend + MySQL). Estimated cost: ~$0–10/month while traffic is light.

## 0. Before you start

Have these handy:
- A Paystack **live** account (not test) — get keys at <https://dashboard.paystack.com/#/settings/developers>
- A long random string for `JWT_SECRET` (run `openssl rand -hex 32`)
- A domain (or use the platform's free subdomain)

## 1. Backend on Render

1. Push the repo to GitHub.
2. Render → **New +** → **Web Service** → connect the repo → set the root to `backend/`.
3. **Build command:** `npm install`
4. **Start command:** `node server.js`
5. **Environment variables** (Settings → Environment):
   ```
   NODE_ENV=production
   PORT=10000                  # Render injects this
   DB_HOST=<from Render MySQL>
   DB_PORT=3306
   DB_USER=gradly
   DB_PASSWORD=<random>
   DB_NAME=gradlyDB
   DB_SSL=true
   FRONTEND_URL=https://gradly.app          # your Vercel URL
   JWT_SECRET=<64-char random hex>
   PAYSTACK_SECRET_KEY=sk_live_xxx
   PAYSTACK_PUBLIC_KEY=pk_live_xxx
   CREDITS_PER_PACK=3
   PACK_PRICE_PESEWAS=2000                  # 20 GHS
   CURRENCY=GHS
   HOSTINGER_EMAIL=hello@gradly.app
   HOSTINGER_PASSWORD=...
   HOSTINGER_SMTP=smtp.hostinger.com
   HOSTINGER_PORT=465
   ```
6. **Add MySQL** (Render → New + → MySQL). Free tier is fine to start.
7. Run the schema once via the Render Shell:
   ```bash
   mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backend/db/init.sql
   mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backend/migrations/004_create_university_conversions.sql
   mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backend/migrations/005_create_grade_conversion_rules.sql
   mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backend/migrations/006_credits_and_payments.sql
   mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backend/db/recommendations_setup.sql
   ```
8. (Optional, populates real Ghana program data):
   ```bash
   cd backend && node scripts/seedKNUSTCutoffPoints.js
   ```

## 2. Frontend on Vercel

1. Vercel → **Add New** → **Project** → import the repo → set the root to the repo root (Next.js is at the top level).
2. **Framework preset:** Next.js (auto-detected).
3. **Environment variables**:
   ```
   NEXT_PUBLIC_API_URL=https://gradly-backend.onrender.com/api
   ```
4. Deploy. The build step is `next build`; output is automatic.

## 3. Paystack webhook

Paystack needs a public URL to POST events to. In the Paystack dashboard → **Settings** → **API Keys & Webhooks**:

- **Webhook URL:** `https://gradly-backend.onrender.com/api/payments/webhook`
- Events to enable: `charge.success` (others are nice-to-have)

Test the wiring:
```bash
curl https://gradly-backend.onrender.com/api/payments/pricing
# → {"success":true,"data":{...}}
```

## 4. Smoke test live

After both are up:
1. Visit `https://gradly.app/register` and create an account.
2. `https://gradly.app/pricing` → click **Buy Convert Pack** → real Paystack page (live mode) → use a real card or skip.
3. Confirm the credits badge in the nav updates to 3.
4. `https://gradly.app/university/convert` → run a conversion → balance drops to 2.

## 5. CORS gotcha

`server.js` already reads `FRONTEND_URL`. Make sure it's set to your live Vercel URL (with protocol, no trailing slash). For Vercel preview deploys, you can use a regex or list multiple origins.

## 6. Backup

Render's free MySQL tier doesn't auto-backup. Run `mysqldump` weekly via a cron service or upgrade to a paid tier.

## 7. Going live with Paystack

Test mode keys → live mode keys is a 1-line `.env` change. Paystack live mode needs:
- Verified business
- Settlement bank account
- 24–48h review

## 8. Local dev cheat sheet

```bash
# DB
docker run -d --name gradly-mysql -e MYSQL_ROOT_PASSWORD=gradly_dev \
  -e MYSQL_DATABASE=gradlyDB -p 3307:3306 mysql:8.0

# Schema
cd backend
for f in db/init.sql migrations/004_create_university_conversions.sql \
         migrations/005_create_grade_conversion_rules.sql \
         migrations/006_credits_and_payments.sql \
         db/recommendations_setup.sql; do
  MYSQL_PWD=gradly_dev mysql -h 127.0.0.1 -P 3307 -u root gradlyDB < "$f"
done

# Backend
npm install
npm test     # 73 jest tests
node server.js   # :5050

# Frontend (other terminal)
cd ..
npm install
npm run dev -- -p 8080
```

`.env.local` (frontend root):
```
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

`.env` (backend):
```
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=gradly_dev
DB_NAME=gradlyDB
DB_SSL=false
NODE_ENV=development
PORT=5050
FRONTEND_URL=http://localhost:8080
JWT_SECRET=dev_only_change_me_to_a_long_random_string_at_least_32_chars
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
CREDITS_PER_PACK=3
PACK_PRICE_PESEWAS=2000
CURRENCY=GHS
```

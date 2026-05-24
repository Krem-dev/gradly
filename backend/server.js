const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// override:true ensures .env always wins over shell-exported defaults.
// Without this, an empty `ANTHROPIC_API_KEY=` in the shell silently shadows the .env value
// and the AI extractor falls back to "manual mode" even when the key is configured.
require('dotenv').config({ override: true })

const { testConnection } = require('./config/database')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth.routes')
const shsRoutes = require('./routes/shs.routes')
const converterRoutes = require('./routes/converter.routes')
const universityConverterRoutes = require('./routes/university.converter.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const adminRoutes = require('./routes/admin.routes')
const transcriptRoutes = require('./routes/transcript.routes')
const recommendationRoutes = require('./routes/recommendation.routes')
const creditsRoutes = require('./routes/credits.routes')
const paymentsRoutes = require('./routes/payments.routes')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  exposedHeaders: ['x-credits-remaining'],
}))

// IMPORTANT: webhook needs the raw body to verify HMAC, so mount it BEFORE
// the JSON body parser. Inside the route we re-parse via express.raw().
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/shs', shsRoutes)
app.use('/api/converter', converterRoutes)
app.use('/api/university-converter', universityConverterRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/transcript', transcriptRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/api/credits', creditsRoutes)
app.use('/api/payments', paymentsRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await testConnection()

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`)
      console.log(`✓ API endpoints ready`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

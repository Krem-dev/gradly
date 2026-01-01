const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

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

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
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

function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  if (err.message.includes('ECONNREFUSED')) {
    return res.status(503).json({
      success: false,
      error: 'Database connection failed'
    })
  }

  if (err.message.includes('ER_DUP_ENTRY')) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry'
    })
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
}

module.exports = errorHandler

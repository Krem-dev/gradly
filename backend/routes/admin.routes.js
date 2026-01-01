const express = require('express')
const router = express.Router()
const University = require('../models/University')
const Program = require('../models/Program')

router.post('/universities', async (req, res) => {
  try {
    const universityId = await University.create(req.body)
    res.status(201).json({
      success: true,
      message: 'University created',
      data: { id: universityId }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/universities', async (req, res) => {
  try {
    const universities = await University.findAll()
    res.json({ success: true, data: universities })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.put('/universities/:id', async (req, res) => {
  try {
    await University.update(req.params.id, req.body)
    res.json({ success: true, message: 'University updated' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete('/universities/:id', async (req, res) => {
  try {
    await University.delete(req.params.id)
    res.json({ success: true, message: 'University deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post('/programs', async (req, res) => {
  try {
    const programId = await Program.create(req.body)
    res.status(201).json({
      success: true,
      message: 'Program created',
      data: { id: programId }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/programs/:universityId', async (req, res) => {
  try {
    const programs = await Program.findByUniversityId(req.params.universityId)
    res.json({ success: true, data: programs })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.put('/programs/:id', async (req, res) => {
  try {
    await Program.update(req.params.id, req.body)
    res.json({ success: true, message: 'Program updated' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete('/programs/:id', async (req, res) => {
  try {
    await Program.delete(req.params.id)
    res.json({ success: true, message: 'Program deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router

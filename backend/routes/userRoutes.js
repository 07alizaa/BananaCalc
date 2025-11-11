// routes/userRoutes.js
// Map HTTP endpoints to controller functions.

const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/authMiddleware')

// Authentication
router.post('/signup', userController.signup)
router.post('/login', userController.login)

// Puzzle and submit endpoints (mounted at root so frontend can call /api/puzzle)
router.get('/api/puzzle', userController.getPuzzle)
router.post('/api/submit', auth, userController.submit)

module.exports = router

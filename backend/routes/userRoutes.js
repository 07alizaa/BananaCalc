// routes/userRoutes.js
// Map HTTP endpoints to controller functions.

const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const gameController = require('../controllers/gameController')
const leaderboardController = require('../controllers/leaderboardController')
const auth = require('../middleware/authMiddleware')

// Authentication
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// Puzzle and submit endpoints (mounted at root so frontend can call /api/puzzle)
router.get('/api/puzzle', gameController.getPuzzle)
router.post('/api/submit', auth, gameController.submit)
router.get('/api/leaderboard', leaderboardController.getLeaderboard)

module.exports = router

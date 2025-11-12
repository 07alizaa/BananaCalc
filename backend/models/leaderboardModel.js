// models/leaderboardModel.js
// Handle leaderboard-related database operations (top users retrieval)

const { pool } = require('../utils/db')

async function getTopUsers(limit = 10) {
  const numericLimit = Number.parseInt(limit, 10)
  const safeLimit = Number.isFinite(numericLimit) ? Math.max(1, Math.min(50, numericLimit)) : 10
  const [rows] = await pool.query(
    'SELECT username, score FROM users ORDER BY score DESC, username ASC LIMIT ?',
    [safeLimit]
  )
  return rows
}

module.exports = {
  getTopUsers,
}

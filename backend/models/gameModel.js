// models/gameModel.js
// Handle game-related database operations (score updates)

const { pool } = require('../utils/db')

async function updateScore(username, delta) {
  // Atomically add delta to user's score and return the updated score.
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.query('UPDATE users SET score = score + ? WHERE username = ?', [delta, username])
    const [rows] = await conn.query('SELECT score FROM users WHERE username = ?', [username])
    await conn.commit()
    return rows[0] ? rows[0].score : null
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

module.exports = {
  updateScore,
}

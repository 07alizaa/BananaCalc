// models/userModel.js
// Minimal model functions for interacting with the `users` table.
// This file keeps SQL queries centralized (service-based architecture).

const { pool } = require('../utils/db')

async function findByUsername(username) {
  // Return a single user row or undefined. Adapted to schema with `password` column.
  const [rows] = await pool.query('SELECT id, username, email, password, score FROM users WHERE username = ?', [username])
  return rows[0]
}

async function createUser({ username, email, passwordHash }) {
  // Insert a new user. Store hashed password in `password` column.
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, score) VALUES (?, ?, ?, 0)',
    [username, email, passwordHash]
  )
  return { id: result.insertId }
}

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

async function findById(id) {
  const [rows] = await pool.query('SELECT id, username, email, score FROM users WHERE id = ?', [id])
  return rows[0]
}

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
  findByUsername,
  createUser,
  updateScore,
  findById,
  getTopUsers,
}

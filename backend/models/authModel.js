// models/authModel.js
// Handle authentication-related database operations (user creation and lookup)

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

async function findById(id) {
  const [rows] = await pool.query('SELECT id, username, email, score FROM users WHERE id = ?', [id])
  return rows[0]
}

module.exports = {
  findByUsername,
  createUser,
  findById,
}

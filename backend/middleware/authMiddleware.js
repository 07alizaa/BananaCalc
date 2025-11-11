// middleware/authMiddleware.js
// Verify JWT in Authorization: Bearer <token>. Attach user payload to req.user.

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' })
  }
  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'replace_this_secret')
    // Attach payload (e.g., { username }) to request for downstream handlers
    req.user = payload
    return next()
  } catch (err) {
    console.warn('auth verify failed', err.message)
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

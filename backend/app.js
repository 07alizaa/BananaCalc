// app.js
// Initialize Express app, attach middleware and routes. Export the app for server and tests.

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')

dotenv.config()

const app = express()

// Middleware
app.use(cors()) // Allow requests from frontend during development
app.use(express.json())

// Routes
app.use('/', userRoutes)

// Health check
app.get('/health', (req, res) => res.json({ success: true, message: 'ok' }))

module.exports = app

// index.js
// Backend entrypoint for BananaCalc. Import and start the Express app.

const app = require('./app')
const { pool } = require('./utils/db')

const PORT = process.env.PORT || 4000

// Test DB connection on startup
pool.query('SELECT 1 as ok')
  .then(() => {
    console.log('✓ Database connection successful')
  })
  .catch((err) => {
    console.error('✗ Database connection failed:', err.message)
    console.error('Check your .env DB credentials')
  })

app.listen(PORT, () => {
  console.log(`✓ BananaCalc backend listening on port ${PORT}`)
  console.log(`  Health check: http://localhost:${PORT}/health`)
})

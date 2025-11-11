#!/usr/bin/env node
// backend/tools/generateSecret.js
// Generate a secure 256-bit (32-byte) JWT secret in hex and write it to the
// backend `.env` file by adding or replacing the `JWT_SECRET=` line.
// This script is intended to be run from the project root as:
//   node backend/tools/generateSecret.js
// It writes to `backend/.env` regardless of the current working directory.

const { randomBytes } = require('crypto')
const fs = require('fs')
const path = require('path')

// Generate 32 random bytes (256 bits) and encode as hex (64 chars)
const secret = randomBytes(32).toString('hex')

// Print the secret with a clear label so the user can copy it if needed
console.log(`Your new JWT_SECRET: ${secret}`)

// Resolve backend/.env relative to this script's location
const envPath = path.resolve(__dirname, '..', '.env')

// Read existing .env (if any), replace JWT_SECRET line or append it
let env = ''
if (fs.existsSync(envPath)) {
  env = fs.readFileSync(envPath, { encoding: 'utf8' })
  const lines = env.split(/\r?\n/)
  let found = false
  const out = lines.map((line) => {
    // Replace any line that starts with JWT_SECRET= (allow leading whitespace)
    if (/^\s*JWT_SECRET\s*=/.test(line)) {
      found = true
      return `JWT_SECRET=${secret}`
    }
    return line
  })
  if (!found) out.push(`JWT_SECRET=${secret}`)
  // Ensure file ends with a newline
  env = out.join('\n') + '\n'
} else {
  // Create a new .env with the JWT_SECRET
  env = `JWT_SECRET=${secret}\n`
}

// Write updated .env file
fs.writeFileSync(envPath, env, { encoding: 'utf8' })
console.log(`Updated backend .env at ${envPath}`)

// services/bananaService.js
// Integrate with the external Banana API to fetch puzzles/questions.
// This service centralizes third-party calls so controllers remain small.
// Uses Node built-in https module (no external deps).

const https = require('https')
const dotenv = require('dotenv')

dotenv.config()

// Default to the provided Banana API host. This URL is authoritative for puzzles.
// The user-supplied API: https://marcconrad.com/uob/banana/
const BANANA_API_BASE = process.env.BANANA_API_BASE || 'https://marcconrad.com/uob/banana'

function httpsGet(url) {
  // Promise wrapper for https.get to fetch JSON from a URL
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
        try {
          resolve(JSON.parse(data))
        } catch (err) {
          reject(err)
        }
      })
    }).on('error', reject)
  })
}

async function fetchPuzzles(difficulty = 'easy') {
  // Try a few likely endpoints on the Banana API. Return an array of questions
  // with full info (may include server-side correct answer fields).
  const candidates = [
    `${BANANA_API_BASE}/api/puzzle?difficulty=${encodeURIComponent(difficulty)}`,
    `${BANANA_API_BASE}/puzzle?difficulty=${encodeURIComponent(difficulty)}`,
    `${BANANA_API_BASE}/api/questions?difficulty=${encodeURIComponent(difficulty)}`,
    // last-resort: root with query
    `${BANANA_API_BASE}?difficulty=${encodeURIComponent(difficulty)}`,
  ]

  for (const url of candidates) {
    try {
      const payload = await httpsGet(url)
      // Banana API commonly returns { questions: [...] } or an array directly
      if (Array.isArray(payload)) return payload
      if (payload && Array.isArray(payload.questions)) return payload.questions
    } catch (err) {
      // try next
      continue
    }
  }
  // If all attempts failed, return empty to let caller decide on fallback behavior.
  return []
}

module.exports = { fetchPuzzles }

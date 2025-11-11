// services/bananaService.js
// Integrate with the external Banana API to fetch puzzles/questions.
// This service centralizes third-party calls so controllers remain small.
// Uses Node built-in http/https modules (no external deps).

const https = require('https')
const http = require('http')
const dotenv = require('dotenv')

dotenv.config()

// Banana API base URL: http://marcconrad.com/uob/banana/
// Correct endpoint: /api.php?out=json
// Returns single puzzle per call: { "question": "image_url", "solution": number }
const BANANA_API_BASE = process.env.BANANA_API_BASE || 'http://marcconrad.com/uob/banana'

function httpGet(url, redirectCount = 0) {
  // Promise wrapper for http(s).get to fetch JSON from a URL
  // Follows redirects (301/302/3xx) up to a small limit.
  const MAX_REDIRECTS = 5
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (redirectCount >= MAX_REDIRECTS) {
          return reject(new Error('Too many redirects'))
        }
        // Resolve relative Location headers against the original URL
        const nextUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).toString()
        // Drain and close this response before following
        res.resume()
        return resolve(httpGet(nextUrl, redirectCount + 1))
      }

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
    })
    req.on('error', reject)
    // add a safety timeout (10s)
    req.setTimeout(10000, () => {
      req.destroy(new Error('Request timeout'))
    })
  })
}

async function fetchPuzzles(difficulty = 'easy') {
  const base = BANANA_API_BASE.replace(/\/$/, '')
  const endpoint = `${base}/api.php?out=json`
  const desiredCount = 5
  const puzzles = []

  for (let i = 0; i < desiredCount; i++) {
    try {
      const payload = await httpGet(endpoint)

      if (!payload || typeof payload.solution !== 'number' || !payload.question) {
        throw new Error('Banana API returned malformed puzzle payload')
      }

      const correct = payload.solution
      const shuffled = shuffleArray([...generateWrongAnswers(correct, 3), correct])

      puzzles.push({
        id: `banana-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        problem: payload.question,
        choices: shuffled.map((value, idx) => ({
          id: `choice-${i}-${idx}`,
          text: String(value),
          isCorrect: value === correct,
        })),
        answer: correct,
      })
    } catch (err) {
      console.error(`[BananaAPI] Puzzle fetch failed (${i + 1}):`, err.message)
      puzzles.push(createFallbackPuzzle(i, difficulty))
    }

    // Small delay to be polite to external API and reduce rate risk
    if (i < desiredCount - 1) {
      await delay(150)
    }
  }

  return puzzles
}

// Helper: Generate wrong answers different from the correct one
function generateWrongAnswers(correctAnswer, count) {
  const wrong = []
  const min = Math.max(0, correctAnswer - 5)
  const max = correctAnswer + 5
  
  while (wrong.length < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    if (num !== correctAnswer && !wrong.includes(num)) {
      wrong.push(num)
    }
  }
  return wrong
}

function createFallbackPuzzle(index, difficulty) {
  const difficultyRanges = {
    easy: { min: 1, max: 10 },
    medium: { min: 5, max: 20 },
    hard: { min: 10, max: 40 },
  }

  const range = difficultyRanges[difficulty] || difficultyRanges.easy
  const a = randomInt(range.min, range.max)
  const b = randomInt(range.min, range.max)
  const correct = a + b
  const shuffled = shuffleArray([...generateWrongAnswers(correct, 3), correct])

  return {
    id: `fallback-${Date.now()}-${index}`,
    problem: `${a} + ${b} = ?`,
    choices: shuffled.map((value, idx) => ({
      id: `fallback-choice-${index}-${idx}`,
      text: String(value),
      isCorrect: value === correct,
    })),
    answer: correct,
  }
}

function shuffleArray(values) {
  return values
    .map((val) => ({ val, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ val }) => val)
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = { fetchPuzzles }

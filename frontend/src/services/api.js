// BananaCalc frontend API wrapper
// Backend endpoints expected:
// GET  /api/puzzle?difficulty=<easy|medium|hard> -> returns questions (no correct answers in production)
// POST /api/submit -> submit an answer, optional auth token
// POST /signup, POST /login -> auth endpoints
// Storage conventions: username -> localStorage, token -> sessionStorage (HttpOnly cookies recommended for production)

const API_BASE = '' // dev proxy or backend URL in production

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchPuzzle(difficulty = 'easy') {
  try {
    const res = await fetch(`${API_BASE}/api/puzzle?difficulty=${encodeURIComponent(difficulty)}`)
    if (!res.ok) throw new Error('Network response was not ok')
    const payload = await res.json()
    return payload
  } catch (err) {
    console.warn('fetchPuzzle failed, falling back to local sample', err)
    // Fallback sample questions (contains isAnswer for local scoring)
    return {
      questions: [
        {
          id: 'q1',
          text: 'What is 2 + 2?',
          choices: [
            { id: 'a', text: '3', isCorrect: false },
            { id: 'b', text: '4', isCorrect: true },
            { id: 'c', text: '5', isCorrect: false },
            { id: 'd', text: '22', isCorrect: false },
          ],
        },
        {
          id: 'q2',
          text: 'What is 5 * 3?',
          choices: [
            { id: 'a', text: '8', isCorrect: false },
            { id: 'b', text: '15', isCorrect: true },
            { id: 'c', text: '10', isCorrect: false },
            { id: 'd', text: '53', isCorrect: false },
          ],
        },
      ],
    }
  }
}

export async function submitAnswer(questionId, selectedChoice, username) {
  try {
    const res = await fetch(`${API_BASE}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ questionId, selectedChoice, username }),
    })
    if (!res.ok) throw new Error('Failed to submit')
    return await res.json()
  } catch (err) {
    console.warn('submitAnswer failed (backend may be offline)', err)
    // Graceful fallback: return a simple acknowledgement so UI can continue
    return { success: false, error: err.message }
  }
}

// Register a new user. Returns { success, token?, user? }
export async function signup({ username, email, password }) {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(txt || 'Signup failed')
    }
    return await res.json()
  } catch (err) {
    console.warn('signup failed', err)
    return { success: false, error: err.message }
  }
}

// Login an existing user. Returns { success, token?, user? }
export async function login({ username, password }) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(txt || 'Login failed')
    }
    return await res.json()
  } catch (err) {
    console.warn('login failed', err)
    return { success: false, error: err.message }
  }
}

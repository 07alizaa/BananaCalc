import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { signup } from '../services/api'

/**
 * Signup page
 * - Collects username, email and password and calls POST /signup via `signup()` in `src/services/api.js`.
 * - Expected /signup response: { success: boolean, token?: string, user?: { username, email } }
 * - If the backend returns a token the frontend will store it in sessionStorage and set username in localStorage, then redirect to `from`.
 * - If the backend does not return a token, the frontend will attempt to call /login to obtain a token automatically.
 * Security notes (frontend only):
 * - passwords are never stored in localStorage/sessionStorage
 * - token is stored in sessionStorage to limit persistence (clears when the tab is closed). In production you may prefer HttpOnly cookies.
 */
export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location?.state?.from || '/dashboard' // Changed default to '/dashboard'

  function validate() {
    if (!username || username.length < 3) return 'Username must be at least 3 characters.'
    if (!email || !email.includes('@')) return 'Please enter a valid email.'
    if (!password || password.length < 8) return 'Password must be at least 8 characters.'
    if (!/\d/.test(password)) return 'Password must include at least one number.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) return setError(v)

    setLoading(true)
    try {
      const res = await signup({ username, email, password })
      
      if (!res || res.success === false) {
        setError(res?.error || res?.message || 'Signup failed')
        return
      }

      // Signup succeeded - store token and username
      if (res.token) {
        sessionStorage.setItem('token', res.token)
        localStorage.setItem('username', username)
        navigate(from, { replace: true })
        return
      }

      // If no token returned, show error
      setError('Signup succeeded but no token returned')
    } catch (err) {
      console.error('Signup error:', err)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-accent/40 to-secondary/10">
      <div className="w-full max-w-lg rounded-3xl border-4 border-primary bg-accent/70 shadow-xl p-10">
        <div className="flex items-center gap-3 mb-6 text-primary">
          <div className="w-14 h-14 bg-white border-2 border-primary rounded-full flex items-center justify-center text-3xl">🍌</div>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Create your BananaCalc account</h2>
            <p className="text-sm text-primary/80">Unlock puzzles, track scores, and join the leaderboard.</p>
          </div>
        </div>
        {from && from !== '/' && (
          <div className="mb-3 text-sm text-gray-600">You were redirected here. After signup you will be returned to the game.</div>
        )}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-primary font-semibold">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 border-2 border-primary/40 rounded-xl focus:border-primary focus:outline-none bg-white" />
          </div>

          <div>
            <label className="block text-sm text-primary font-semibold">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-3 border-2 border-primary/40 rounded-xl focus:border-primary focus:outline-none bg-white" />
          </div>

          <div>
            <label className="block text-sm text-primary font-semibold">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 border-2 border-primary/40 rounded-xl focus:border-primary focus:outline-none bg-white" />
            <div className="text-xs text-primary/80 mt-1">At least 8 characters and one number.</div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-5 py-3 bg-primary text-white rounded-xl shadow-lg hover:-translate-y-0.5 transition disabled:opacity-60">
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-center text-primary/80">
          Already have an account? <Link to="/login" className="text-primary underline font-semibold">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

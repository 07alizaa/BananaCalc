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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-accent to-secondary/10">
  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow border-2 border-primary/25">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">🍌</div>
          <h2 className="text-2xl font-bold text-primary">Create your account</h2>
        </div>
        {from && from !== '/' && (
          <div className="mb-3 text-sm text-gray-600">You were redirected here. After signup you will be returned to the game.</div>
        )}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            <div className="text-xs text-gray-500 mt-1">At least 8 characters and one number.</div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded">
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

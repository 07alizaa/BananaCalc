import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { login } from '../services/api'

/**
 * Login page
 * - Collects username and password and calls POST /login via `login()` in `src/services/api.js`.
 * - Expected /login response: { success: boolean, token?: string, user?: { username, email } }
 * - On success: token -> sessionStorage, username -> localStorage. The frontend then redirects to the original `from` route.
 * Security notes: storing token in sessionStorage limits persistence to the browser tab; passwords are never stored client-side.
 */
export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location?.state?.from || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!username || !password) return setError('Provide both username and password')

    setLoading(true)
    try {
      const res = await login({ username, password })
      if (!res || res.success === false) {
        setError(res.error || 'Login failed')
        return
      }

      // Save session info: username (persist), token (session-scoped)
      if (res.token) {
        sessionStorage.setItem('token', res.token)
      }
      localStorage.setItem('username', username)
      // Redirect back to where the user came from (e.g., /game) or to home
      navigate(from)
    } catch (err) {
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
          <h2 className="text-2xl font-bold text-primary">Sign in to BananaCalc</h2>
        </div>
        {/* If the user was redirected here during an attempt to start the game, show a short notice */}
        {from && from !== '/' && (
          <div className="mb-3 text-sm text-gray-600">Please sign in to continue to the game.</div>
        )}
  {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded">{loading ? 'Signing in…' : 'Sign in'}</button>
          </div>
        </form>
        <div className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-primary underline">Create one</Link>
        </div>
      </div>
    </div>
  )
}

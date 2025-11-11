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
  const from = location?.state?.from || '/dashboard' // Changed default to '/dashboard'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!username || !password) return setError('Provide both username and password')

    setLoading(true)
    try {
      const res = await login({ username, password })
      
      if (!res || res.success === false) {
        setError(res?.error || res?.message || 'Login failed')
        return
      }

      // Login succeeded - store token and username
      if (res.token) {
        sessionStorage.setItem('token', res.token)
        localStorage.setItem('username', username)
        navigate(from, { replace: true })
        return
      }

      // If no token returned, show error
      setError('Login succeeded but no token returned')
    } catch (err) {
      console.error('Login error:', err)
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
            <h2 className="text-3xl font-bold leading-tight">Sign in to BananaCalc</h2>
            <p className="text-sm text-primary/80">Grab your bananas and solve the puzzle streak.</p>
          </div>
        </div>
        {/* If the user was redirected here during an attempt to start the game, show a short notice */}
        {from && from !== '/' && (
          <div className="mb-3 text-sm text-gray-600">Please sign in to continue to the game.</div>
        )}
  {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-primary font-semibold">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 border-2 border-primary/40 rounded-xl focus:border-primary focus:outline-none bg-white" />
          </div>

          <div>
            <label className="block text-sm text-primary font-semibold">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 border-2 border-primary/40 rounded-xl focus:border-primary focus:outline-none bg-white" />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-5 py-3 bg-primary text-white rounded-xl shadow-lg hover:-translate-y-0.5 transition disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
          </div>
        </form>
        <div className="mt-6 text-sm text-center text-primary/80">
          Don't have an account? <Link to="/signup" className="text-primary underline font-semibold">Create one</Link>
        </div>
      </div>
    </div>
  )
}

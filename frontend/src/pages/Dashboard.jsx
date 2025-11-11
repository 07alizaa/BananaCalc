import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DifficultySelector from '../components/DifficultySelector'

/**
 * Dashboard - User's home page after login
 * Shows welcome message, difficulty selector, and Start Game button
 */
export default function Dashboard() {
  const [difficulty, setDifficulty] = useState('easy')
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Player'

  function handleLogout() {
    sessionStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/')
  }

  function startGame() {
    localStorage.setItem('difficulty', difficulty)
    navigate('/game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/40 to-secondary/10 p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto py-4">
        <div className="rounded-3xl border-4 border-primary bg-accent/80 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3 text-primary">
            <div className="w-14 h-14 bg-white border-2 border-primary rounded-full flex items-center justify-center text-3xl">
              🍌
            </div>
            <div>
              <h1 className="text-3xl font-extrabold leading-tight">BananaCalc</h1>
              <p className="text-sm text-primary/80">Crack the banana puzzles and climb the board.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-primary">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-primary/80">Logged in as</p>
              <p className="text-lg font-semibold">{username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-xl bg-white text-primary font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto mt-12">
        <section className="rounded-3xl border-4 border-primary bg-accent/70 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-white/60 border-2 border-primary rounded-full flex items-center justify-center text-3xl">👋</div>
            <div>
              <h2 className="text-3xl font-bold text-primary">Welcome back, {username}!</h2>
              <p className="text-primary/80 mt-1">Ready for some math puzzles?</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-primary">Choose your difficulty:</h3>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
          </div>

          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="px-6 py-3 bg-primary text-white rounded-md shadow-lg transform hover:-translate-y-0.5 transition font-semibold"
            >
              Start Game
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-primary/20">
            <h3 className="text-lg font-semibold mb-2 text-primary">How it works:</h3>
            <ul className="list-disc list-inside text-primary/80 space-y-1">
              <li>Select your preferred difficulty level</li>
              <li>Answer math puzzles and earn points</li>
              <li>Your score is saved automatically</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

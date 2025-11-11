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
      <header className="max-w-6xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">🍌</div>
          <h1 className="text-3xl font-extrabold text-primary">BananaCalc</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, <strong>{username}</strong></span>
          <button onClick={handleLogout} className="px-3 py-2 text-sm rounded-md bg-white/80 border border-gray-300 text-gray-700 hover:shadow">
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto mt-12">
        <section className="bg-white rounded-xl shadow-lg p-8 border-2 border-primary/25">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl">👋</div>
            <div>
              <h2 className="text-3xl font-bold text-primary">Welcome back, {username}!</h2>
              <p className="text-gray-600 mt-1">Ready for some math puzzles?</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Choose your difficulty:</h3>
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

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-2">How it works:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
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

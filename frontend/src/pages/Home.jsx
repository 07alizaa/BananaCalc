import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DifficultySelector from '../components/DifficultySelector'

// Home page: a more interactive and inviting landing screen
// - Prominent header with Login/Signup actions
// - Hero with CTA, difficulty selector, and a live preview (question + score)
export default function Home() {
  const [difficulty, setDifficulty] = useState('easy')
  const navigate = useNavigate()



  function startGame() {
    // require login before starting the game
    const username = localStorage.getItem('username')
    localStorage.setItem('difficulty', difficulty)
    if (!username) {
      // redirect to login and ask to return to /game after successful signin
      navigate('/login', { state: { from: '/game' } })
      return
    }
    navigate('/game')
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-accent/40 to-secondary/10 p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">🍌</div>
          <h1 className="text-3xl font-extrabold text-primary">BananaCalc</h1>
          <span className="ml-3 text-sm text-gray-600">Fun math puzzles</span>
        </div>

        <nav className="flex items-center gap-3">
          <Link to="/login" className="px-3 py-2 text-sm rounded-md bg-white/80 border border-primary text-primary hover:shadow">Log in</Link>
          <Link to="/signup" className="px-3 py-2 text-sm rounded-md bg-primary text-white hover:opacity-95">Sign up</Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto mt-8">
  <section className="bg-white rounded-xl shadow p-8 border-2 border-primary/25">
          <h2 className="text-3xl font-extrabold text-primary mb-3">Sharpen your math skills — one puzzle at a time</h2>
          <p className="text-gray-600 mb-6">Choose a difficulty level and challenge yourself with bite-sized puzzles. Track your score and climb the leaderboard.</p>

          <div className="mb-6">
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
          </div>

          <div className="flex gap-4">
            <button onClick={startGame} className="px-5 py-3 bg-primary text-white rounded-md shadow-lg transform hover:-translate-y-0.5 transition">Start Game</button>
            <Link to="/signup" className="px-4 py-3 text-sm text-primary underline rounded-md">Create account</Link>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Why BananaCalc?</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Short, focused puzzles that build arithmetic fluency</li>
              <li>Adaptive difficulty and live scoring</li>
              <li>Privacy-conscious sessions — tokens stored in sessionStorage</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

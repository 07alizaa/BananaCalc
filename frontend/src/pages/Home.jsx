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
      <header className="max-w-6xl mx-auto py-4">
        <div className="rounded-3xl border-4 border-primary bg-accent/80 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3 text-primary">
            <div className="w-14 h-14 bg-white border-2 border-primary rounded-full flex items-center justify-center text-3xl">🍌</div>
            <div>
              <h1 className="text-3xl font-extrabold leading-tight">BananaCalc</h1>
              <p className="text-sm text-primary/80">Fun math puzzles for every adventurer.</p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm rounded-xl bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors">Log in</Link>
            <Link to="/signup" className="px-4 py-2 text-sm rounded-xl bg-primary text-white border-2 border-primary hover:opacity-95 transition-colors">Sign up</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto mt-8">
        <section className="rounded-3xl border-4 border-primary bg-accent/70 shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-primary mb-3">Sharpen your math skills — one puzzle at a time</h2>
          <p className="text-gray-600 mb-6">Choose a difficulty level and challenge yourself with bite-sized puzzles. Track your score and climb the leaderboard.</p>

          <div className="mb-6">
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
          </div>

          <div className="flex gap-4">
            <button onClick={startGame} className="px-5 py-3 bg-primary text-white rounded-xl shadow-lg transform hover:-translate-y-0.5 transition">Start Game</button>
            <Link to="/signup" className="px-4 py-3 text-sm text-primary underline rounded-xl border-2 border-primary/40 bg-white/70 hover:bg-white transition-colors">Create account</Link>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Why BananaCalc?</h3>
            <ul className="list-disc list-inside text-primary/80">
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

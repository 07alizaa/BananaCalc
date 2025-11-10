import React, { useEffect, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import ScoreDisplay from '../components/ScoreDisplay'
import { fetchPuzzle, submitAnswer } from '../services/api'

/*
 * Game page
 * - Fetches puzzles using `fetchPuzzle(difficulty)` which calls GET /api/puzzle?difficulty=...
 * - Displays current question and score, and calls `submitAnswer(questionId, choiceId, username)` to POST /api/submit
 * - Notes for backend: the frontend sends { questionId, selectedChoice, username } in the POST body and will include Authorization header if a token exists.
 */
export default function Game() {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const difficulty = localStorage.getItem('difficulty') || 'easy'
    setLoading(true)
    fetchPuzzle(difficulty)
      .then((res) => {
        if (res && res.questions) setQuestions(res.questions)
        else setError('No questions returned')
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }, [])

  async function handleAnswer(questionId, choice) {
    // update local score based on available correctness flag (in fallback data)
    if (choice.isCorrect) setScore((s) => s + 1)

    // send answer to backend but don't block UI on response; include username and token via api helper
    const username = localStorage.getItem('username') || 'guest'
    submitAnswer(questionId, choice.id, username).catch((err) => {
      // gracefully handle submission errors, e.g., log or show toast (kept minimal here)
      console.warn('submitAnswer error', err)
    })

    // Advance to next question
    setCurrent((c) => c + 1)
  }

  if (loading) return <div className="p-6 text-accent">Loading questions…</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>

  const question = questions[current]
  if (!question) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Game over</h2>
          <p className="mb-4">Your final score is <strong className="text-darkGreen">{score}</strong>.</p>
          <button onClick={() => { setCurrent(0); setScore(0); }} className="px-4 py-2 bg-primary text-white rounded">Play Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent/30 p-6 flex items-start justify-center">
      <div className="max-w-3xl w-full grid gap-6">
        <ScoreDisplay score={score} />

        <QuestionCard question={question} onAnswer={handleAnswer} />
      </div>
    </div>
  )
}

import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [selectedChoiceId, setSelectedChoiceId] = useState(null)
  const [isLocked, setIsLocked] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isCorrectSelection, setIsCorrectSelection] = useState(false)

  const navigate = useNavigate()

  const loadQuestions = useCallback(async () => {
    const difficulty = localStorage.getItem('difficulty') || 'easy'

    setLoading(true)
    setError(null)
    setQuestions([])
    setCurrent(0)
    setScore(0)
    setSelectedChoiceId(null)
    setIsLocked(false)
    setFeedback('')
    setIsCorrectSelection(false)

    try {
      const res = await fetchPuzzle(difficulty)
      if (res && res.questions) setQuestions(res.questions)
      else setError('No questions returned')
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  async function handleChoice(choice) {
    if (isLocked) return
    const currentQuestion = questions[current]
    if (!currentQuestion) return

    setSelectedChoiceId(choice.id)
    const correct = Boolean(choice.isCorrect)
    setIsCorrectSelection(correct)
    setFeedback(
      correct
        ? 'Nice job! That banana is no match for you.'
        : `Not quite. The correct answer was ${currentQuestion.answer}.`
    )

    if (correct) setScore((s) => s + 1)
    setIsLocked(true)

    const username = localStorage.getItem('username') || 'guest'
    submitAnswer(currentQuestion.id, choice.id, username).catch((err) => {
      console.warn('submitAnswer error', err)
    })
  }

  function handleNext() {
    if (!isLocked) return
    setSelectedChoiceId(null)
    setIsLocked(false)
    setFeedback('')
    setIsCorrectSelection(false)
    setCurrent((c) => c + 1)
  }

  if (loading) return <div className="p-6 text-accent">Loading questions…</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>

  const question = questions[current]
  const total = questions.length
  const isLastQuestion = current === total - 1
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-white to-accent/30 p-6">
        <div className="max-w-lg w-full rounded-3xl bg-white/90 backdrop-blur shadow-2xl border border-primary/20 p-10 flex flex-col gap-6 text-center">
          <div>
            <h2 className="text-3xl font-black text-primary mb-2">Final Score</h2>
            <p className="text-lg text-gray-600">
              You solved <span className="text-darkGreen font-semibold">{score}</span> out of {total} puzzles.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={loadQuestions}
              className="px-4 py-3 rounded-xl bg-primary text-white font-semibold shadow hover:bg-primary/90 transition-colors"
            >
              Play Again
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-white to-primary/10 p-6 flex items-start justify-center">
      <div className="max-w-3xl w-full grid gap-6">
        <ScoreDisplay score={score} current={current + 1} total={total} />

        <QuestionCard
          question={question}
          onSelect={handleChoice}
          selectedId={selectedChoiceId}
          showCorrect={isLocked}
          disabled={isLocked}
          feedback={feedback}
          isCorrectSelection={isCorrectSelection}
        />

        {isLocked && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-3 rounded-lg bg-darkGreen text-white font-semibold shadow hover:bg-darkGreen/90 transition-colors"
            >
              {isLastQuestion ? 'See Results' : 'Next Puzzle'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

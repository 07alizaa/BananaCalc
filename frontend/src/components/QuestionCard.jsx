import React, { useState } from 'react'

/**
 * QuestionCard
 * - Displays a question and multiple-choice answers.
 * - Calls `onAnswer(questionId, selected)` when an answer is chosen.
 */
export default function QuestionCard({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)

  function handleSelect(choice) {
    setSelected(choice.id)
    if (onAnswer) onAnswer(question.id, choice)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-primary">{question.text}</h2>
      </div>

      <div className="grid gap-3">
        {question.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleSelect(choice)}
            className={`text-left px-4 py-3 rounded-md border transition-colors w-full
              ${selected === choice.id ? 'bg-primary text-white border-primary' : 'bg-gray-50 hover:bg-gray-100 border-transparent'}`}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  )
}

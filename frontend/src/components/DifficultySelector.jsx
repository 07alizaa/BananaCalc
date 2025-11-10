import React from 'react'

/**
 * DifficultySelector
 * - Lets the player choose a difficulty (Easy/Medium/Hard).
 * - Calls `onChange(difficulty)` when selection changes.
 */
export default function DifficultySelector({ value, onChange }) {
  const options = ['easy', 'medium', 'hard']

  return (
    <div className="flex gap-2" role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange && onChange(opt)}
          className={`px-3 py-2 rounded-md font-medium transition
            ${value === opt ? 'bg-primary text-white' : 'bg-secondary/10 text-primary hover:bg-secondary/20'}`}
        >
          {opt[0].toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  )
}

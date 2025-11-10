import React from 'react'

/**
 * ScoreDisplay
 * - Shows the current score and username (if available).
 */
export default function ScoreDisplay({ score = 0 }) {
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
      <div>
        <div className="text-sm text-gray-500">Player</div>
        <div className="font-semibold text-primary">{username || 'Guest'}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-500">Score</div>
        <div className="font-bold text-2xl text-darkGreen">{score}</div>
      </div>
    </div>
  )
}

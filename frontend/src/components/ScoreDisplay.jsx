import React from 'react'

/**
 * ScoreDisplay
 * - Shows the current score and username (if available).
 */
export default function ScoreDisplay({ score = 0, current = 1, total = 0 }) {
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null
  const progressText = total ? `${current} / ${total}` : '—'

  return (
    <div className="rounded-3xl border-4 border-primary bg-accent/70 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <div className="text-xs uppercase tracking-wide text-primary/80">Player</div>
          <div className="font-semibold text-primary">{username || 'Guest'}</div>
        </div>
        <div className="text-center">
          <div className="text-xs uppercase tracking-wide text-primary/80">Score</div>
          <div className="font-bold text-3xl text-darkGreen drop-shadow-sm">{score}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-primary/80">Progress</div>
          <div className="font-semibold text-primary">{progressText}</div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

/**
 * QuestionCard relies on parent state so we can show inline answer feedback.
 */
export default function QuestionCard({
  question,
  onSelect,
  selectedId,
  showCorrect = false,
  disabled = false,
  feedback,
  isCorrectSelection,
}) {
  const problem = question.problem || question.text || ''
  const isImage = typeof problem === 'string' && /^(https?:)?\/\//.test(problem)

  return (
    <div className="rounded-3xl border-4 border-primary bg-accent/60 shadow-lg">
      <div className="p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-primary">
          {isImage ? (
            <>
              <h2 className="text-2xl font-bold text-center">What number is hidden by the banana?</h2>
              <img
                src={problem}
                alt="Banana puzzle"
                className="max-h-72 w-auto rounded-xl shadow-md"
              />
            </>
          ) : (
            <h2 className="text-2xl font-bold text-center">{problem || 'Solve the puzzle'}</h2>
          )}
        </div>

        <div className="grid gap-3">
          {question.choices.map((choice) => {
            const isSelected = selectedId === choice.id
            const correctChoice = choice.isCorrect

            let stateClasses = 'bg-white border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary'
            if (showCorrect) {
              if (correctChoice) stateClasses = 'bg-darkGreen text-white border-darkGreen'
              else if (isSelected) stateClasses = 'bg-primary text-white border-primary'
              else stateClasses = 'bg-secondary/30 text-primary/70 border-secondary/30'
            } else if (isSelected) {
              stateClasses = 'bg-primary text-white border-primary shadow-sm'
            }

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => !disabled && onSelect && onSelect(choice)}
                disabled={disabled}
                className={`text-left px-4 py-3 rounded-xl border transition-colors duration-150 w-full font-semibold ${stateClasses}`}
              >
                {choice.text}
              </button>
            )
          })}
        </div>

        {feedback && (
          <div
            className={`text-center text-lg font-semibold ${
              isCorrectSelection ? 'text-darkGreen' : 'text-primary'
            }`}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  )
}

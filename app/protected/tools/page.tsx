'use client'
import { useState, useEffect, useRef } from 'react'

const WORK_DURATION = 25 * 60
const BREAK_DURATION = 5 * 60

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 1) {
            clearInterval(timerRef.current!)
            setIsBreak(b => {
              const next = !b
              setTimeLeft(next ? BREAK_DURATION : WORK_DURATION)
              setIsRunning(false)
              return next
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div
      className="relative p-6 text-center font-pixel text-white"
      style={{
        backgroundImage: "url('/images/TimerBG.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-2xl font-bold mb-4">
        {isBreak ? 'Break Time' : 'Focus Time'}
      </h2>

      <div className="text-6xl mb-6">{formatTime(timeLeft)}</div>

      <div className="flex justify-center gap-4">
        {/* Start Button */}
        <button
          onClick={() => setIsRunning(true)}
          className="
            relative w-16 h-16
            bg-[url('/images/buttonstyle5.png')] bg-cover bg-center
            rounded-lg
            flex items-center justify-center
          "
        >
          <span className="text-sm">Start</span>
        </button>

        {/* Pause Button */}
        <button
          onClick={() => setIsRunning(false)}
          className="
            relative w-16 h-13
            bg-[url('/images/buttonstyle1.png')] bg-cover bg-center
            rounded-lg
            flex items-center justify-center
          "
        >
          <span className="text-sm">Pause</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={() => {
            setIsRunning(false)
            setTimeLeft(isBreak ? BREAK_DURATION : WORK_DURATION)
          }}
          className="
            relative w-16 h-16
            bg-[url('/images/buttonstyle3.png')] bg-cover bg-center
            rounded-lg
            flex items-center justify-center
          "
        >
          <span className="text-sm">Reset</span>
        </button>
      </div>
    </div>
  )
}

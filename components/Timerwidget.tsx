'use client';

import { useState, useEffect, useRef } from 'react';

const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current!);
            setIsBreak((b) => !b);
            setTimeLeft(isBreak ? WORK_DURATION : BREAK_DURATION);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] max-w-md mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6">{isBreak ? 'Break Time' : 'Focus Time'}</h2>
      <div className="text-7xl font-mono mb-8">{formatTime(timeLeft)}</div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(true)}
          className="bg-green-600 hover:bg-green-700 transition rounded-lg px-6 py-2 font-semibold shadow-md"
          disabled={isRunning}
        >
          Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="bg-yellow-500 hover:bg-yellow-600 transition rounded-lg px-6 py-2 font-semibold shadow-md"
          disabled={!isRunning}
        >
          Pause
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(isBreak ? BREAK_DURATION : WORK_DURATION);
          }}
          className="bg-red-600 hover:bg-red-700 transition rounded-lg px-6 py-2 font-semibold shadow-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

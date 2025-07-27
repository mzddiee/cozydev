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
            setIsBreak((prevBreak) => {
              const newIsBreak = !prevBreak;
              setTimeLeft(newIsBreak ? BREAK_DURATION : WORK_DURATION);
              setIsRunning(false);
              return newIsBreak;
            });
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
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">{isBreak ? 'Break Time' : 'Focus Time'}</h2>
      <div className="text-6xl font-mono mb-4">{formatTime(timeLeft)}</div>
      <div className="space-x-4">
        <button
          onClick={() => setIsRunning(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Pause
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(isBreak ? BREAK_DURATION : WORK_DURATION);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
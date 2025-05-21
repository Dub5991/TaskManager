import React, { useState, useRef } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';

const POMODORO_DURATION = 25 * 60; // 25 minutes

const PomodoroTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(POMODORO_DURATION);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds]);

  const percent = 100 - (seconds / POMODORO_DURATION) * 100;

  return (
    <div>
      <ProgressBar now={percent} label={`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`} />
      <Button onClick={() => setRunning(r => !r)} className="mt-2">
        {running ? 'Pause' : 'Start'}
      </Button>
      <Button onClick={() => { setSeconds(POMODORO_DURATION); setRunning(false); }} className="mt-2 ms-2">
        Reset
      </Button>
    </div>
  );
};

export default PomodoroTimer;
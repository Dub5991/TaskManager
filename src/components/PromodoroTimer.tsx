import React, { useState, useRef, useEffect } from 'react';
import { Button, ProgressBar, Stack, Alert, Card } from 'react-bootstrap';

const POMODORO_DURATION = 25 * 60; // 25 minutes

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const PomodoroTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(POMODORO_DURATION);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch a motivational quote from a public API
  useEffect(() => {
    fetch('https://api.quotable.io/random?tags=motivational|inspirational')
      .then(res => res.json())
      .then(data => setQuote(data.content))
      .catch(() => setQuote(null));
  }, [cycles, showBreak]);

  // Timer logic
  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (seconds === 0 && running) {
      setRunning(false);
      setCycles(c => c + 1);
      setShowBreak(true);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds]);

  // Handle break
  const handleBreakEnd = () => {
    setShowBreak(false);
    setSeconds(POMODORO_DURATION);
    setRunning(false);
  };

  const percent = 100 - (seconds / POMODORO_DURATION) * 100;

  return (
    <Card className="p-3 border-0 shadow-sm" style={{ borderRadius: 18, background: '#f8fafc' }}>
      <Stack gap={3} className="align-items-center">
        <div className="text-center">
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2 }}>
            {formatTime(seconds)}
          </div>
          <div style={{ color: '#888', fontSize: 15 }}>
            {running ? 'Focus time!' : 'Paused'}
          </div>
        </div>
        <ProgressBar
          now={percent}
          style={{ width: '100%', height: 24, borderRadius: 12, fontWeight: 600, fontSize: 18 }}
          label={formatTime(seconds)}
          variant={running ? 'success' : 'info'}
        />
        <Stack direction="horizontal" gap={2} className="justify-content-center">
          <Button
            onClick={() => setRunning(r => !r)}
            variant={running ? 'warning' : 'success'}
            size="lg"
            style={{ minWidth: 100, borderRadius: 10 }}
          >
            {running ? 'Pause' : 'Start'}
          </Button>
          <Button
            onClick={() => { setSeconds(POMODORO_DURATION); setRunning(false); }}
            variant="outline-secondary"
            size="lg"
            style={{ minWidth: 100, borderRadius: 10 }}
          >
            Reset
          </Button>
        </Stack>
        <div className="text-center mt-2" style={{ color: '#1976d2', fontWeight: 500 }}>
          Pomodoros completed: <span style={{ fontWeight: 700 }}>{cycles}</span>
        </div>
        {quote && (
          <Alert variant="info" className="mt-2 mb-0" style={{ fontStyle: 'italic', fontSize: 15 }}>
            <span role="img" aria-label="quote">💡</span> {quote}
          </Alert>
        )}
      </Stack>
      {/* Break modal/alert */}
      {showBreak && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: 18,
          }}
        >
          <div className="bg-white p-4 rounded shadow text-center" style={{ minWidth: 260 }}>
            <h4 className="mb-3">Pomodoro Complete!</h4>
            <p>Take a short break. 🎉</p>
            <Button variant="primary" onClick={handleBreakEnd}>
              Start Next Pomodoro
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PomodoroTimer;
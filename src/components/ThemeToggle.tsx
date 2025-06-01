// ThemeToggle.tsx - Theme Switcher Button
import React from 'react';
import { Button } from 'react-bootstrap';
import { BsSun, BsMoon } from 'react-icons/bs';
// import { useTheme } from '../context/ThemeContext'; // Uncomment if ThemeContext exists

// Simple theme toggle fallback if ThemeContext is not present
const ThemeToggle: React.FC = () => {
  // const { theme, toggleTheme } = useTheme();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <Button
      variant={theme === 'dark' ? 'dark' : 'outline-dark'}
      onClick={toggleTheme}
      className="ms-2"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <BsSun /> : <BsMoon />}
    </Button>
  );
};

export default ThemeToggle;
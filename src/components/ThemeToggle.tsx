import React from 'react';
import { Button } from 'react-bootstrap';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

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
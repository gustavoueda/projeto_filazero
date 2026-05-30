import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fz_theme')) ?? false; } catch { return false; }
  });

  function toggleDark() {
    setDarkMode(d => {
      const next = !d;
      localStorage.setItem('fz_theme', JSON.stringify(next));
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

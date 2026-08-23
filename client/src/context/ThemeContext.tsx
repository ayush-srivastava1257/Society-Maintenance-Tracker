import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Enforce permanent Dark Architectural theme across the application
    const root = document.documentElement;
    root.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    // Permanent dark mode enforced - noop
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode: true, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

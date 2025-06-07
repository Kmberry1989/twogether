import React, { createContext, useContext, useState, ReactNode } from 'react';

export const lightTheme = {
  colors: {
    primary: '#6200ee',
    background: '#FFFFFF',
    card: '#f2f2f2',
    text: '#000000',
    border: '#cccccc',
  },
};

export const darkTheme = {
  colors: {
    primary: '#bb86fc',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#444444',
  },
};

interface ThemeContextType {
  theme: typeof lightTheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(lightTheme);
  const toggleTheme = () => {
    setTheme((prev) => (prev === lightTheme ? darkTheme : lightTheme));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

interface ThemeColors {
  primary: string;
  primaryDark: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  cardGradientStart: string;
  cardGradientEnd: string;
}

const lightColors: ThemeColors = {
  primary: '#059669', // emerald-600
  primaryDark: '#10b981', // emerald-500
  background: '#f0fdf4', // emerald-50
  surface: '#ffffff',
  text: '#1f2937', // gray-800
  textSecondary: '#4b5563', // gray-600
  border: '#d1fae5', // emerald-100
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  cardGradientStart: '#fbbf24', // amber-400
  cardGradientEnd: '#f97316', // orange-500
};

const darkColors: ThemeColors = {
  primary: '#fbbf24', // amber-400
  primaryDark: '#d97706', // amber-600
  background: '#0f172a', // slate-900
  surface: '#1e293b', // slate-800
  text: '#f1f5f9', // slate-100
  textSecondary: '#cbd5e1', // slate-300
  border: '#334155', // slate-700
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  cardGradientStart: '#818cf8', // indigo-400
  cardGradientEnd: '#a855f7', // purple-500
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(deviceColorScheme || 'light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('azkar-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('azkar-theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
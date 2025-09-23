import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FontContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const FONT_SIZE_STEP = 2;

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState(16);

  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      const savedSize = await AsyncStorage.getItem('azkar-font-size');
      if (savedSize) {
        const size = parseInt(savedSize, 10);
        if (size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
          setFontSizeState(size);
        }
      }
    } catch (error) {
      console.error('Error loading font size:', error);
    }
  };

  const setFontSize = async (size: number) => {
    if (size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
      setFontSizeState(size);
      try {
        await AsyncStorage.setItem('azkar-font-size', size.toString());
      } catch (error) {
        console.error('Error saving font size:', error);
      }
    }
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + FONT_SIZE_STEP, MAX_FONT_SIZE);
    setFontSize(newSize);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - FONT_SIZE_STEP, MIN_FONT_SIZE);
    setFontSize(newSize);
  };

  return (
    <FontContext.Provider value={{ fontSize, setFontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}
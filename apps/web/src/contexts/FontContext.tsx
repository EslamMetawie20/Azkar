import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface FontContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;

export const FontContext = createContext<FontContextType>({
  fontSize: DEFAULT_FONT_SIZE,
  setFontSize: () => {},
  increaseFontSize: () => {},
  decreaseFontSize: () => {}
});

interface FontProviderProps {
  children: ReactNode;
}

export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<number>(() => {
    const saved = localStorage.getItem('azkar-font-size');
    return saved ? parseInt(saved) : DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    localStorage.setItem('azkar-font-size', fontSize.toString());
  }, [fontSize]);

  const setFontSize = (size: number) => {
    if (size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
      setFontSizeState(size);
    }
  };

  const increaseFontSize = () => {
    setFontSize(Math.min(fontSize + 2, MAX_FONT_SIZE));
  };

  const decreaseFontSize = () => {
    setFontSize(Math.max(fontSize - 2, MIN_FONT_SIZE));
  };

  return (
    <FontContext.Provider value={{ fontSize, setFontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontSize = () => {
  const context = React.useContext(FontContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontProvider');
  }
  return context;
};
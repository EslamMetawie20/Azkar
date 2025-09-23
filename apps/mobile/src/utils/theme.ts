export const lightTheme = {
  background: '#f0fdf4',
  backgroundSecondary: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  primary: '#059669',
  primaryLight: '#10b981',
  primaryDark: '#047857',
  accent: '#f59e0b',
  border: '#e5e7eb',
  cardBackground: '#ffffff',
  shadowColor: '#000',
  offlineBar: '#f59e0b',
};

export const darkTheme = {
  background: '#1e293b',
  backgroundSecondary: '#334155',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  primary: '#fbbf24',
  primaryLight: '#fcd34d',
  primaryDark: '#f59e0b',
  accent: '#059669',
  border: '#475569',
  cardBackground: '#334155',
  shadowColor: '#000',
  offlineBar: '#f59e0b',
};

export type ThemeType = typeof lightTheme;

export const getTheme = (isDark: boolean): ThemeType => {
  return isDark ? darkTheme : lightTheme;
};
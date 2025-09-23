import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CategorySlug } from '@azkar/shared';
import { useTheme } from '../contexts/ThemeContext';

type Page = 'home' | 'azkar' | 'settings';

interface NavigationProps {
  currentPage: Page;
  selectedCategory: CategorySlug | null;
  onBack: () => void;
  onSettingsPress: () => void;
  onThemeToggle?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  selectedCategory,
  onBack,
  onSettingsPress,
  onThemeToggle
}) => {
  const { theme, toggleTheme, colors } = useTheme();
  const getTitle = () => {
    if (currentPage === 'home') return 'أذكار وأدعية';
    if (currentPage === 'azkar' && selectedCategory === 'morning') return 'أذكار الصباح';
    if (currentPage === 'azkar' && selectedCategory === 'evening') return 'أذكار المساء';
    if (currentPage === 'settings') return 'الإعدادات';
    return 'أذكار وأدعية';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.header}>
        {/* Left button - Back or Theme Toggle */}
        {currentPage !== 'home' ? (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.button, { backgroundColor: theme === 'dark' ? '#374151' : '#f0fdf4' }]}
          >
            <Text style={[styles.backText, { color: colors.primary }]}>←</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.button, { backgroundColor: theme === 'dark' ? '#374151' : '#f0fdf4' }]}
          >
            <Text style={styles.themeIcon}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>

        {/* Right button - Settings */}
        <TouchableOpacity
          onPress={onSettingsPress}
          style={[styles.button, { backgroundColor: theme === 'dark' ? '#374151' : '#f0fdf4' }]}
        >
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
  },
  themeIcon: {
    fontSize: 16,
  },
  settingsText: {
    fontSize: 18,
  },
});

export default Navigation;
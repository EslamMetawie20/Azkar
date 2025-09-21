import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CategorySlug } from '@azkar/shared';

type Page = 'home' | 'azkar' | 'settings';

interface NavigationProps {
  currentPage: Page;
  selectedCategory: CategorySlug | null;
  onBack: () => void;
  onSettingsPress: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  selectedCategory,
  onBack,
  onSettingsPress
}) => {
  const getTitle = () => {
    if (currentPage === 'home') return 'أذكار وأدعية';
    if (currentPage === 'azkar' && selectedCategory === 'morning') return 'أذكار الصباح';
    if (currentPage === 'azkar' && selectedCategory === 'evening') return 'أذكار المساء';
    if (currentPage === 'settings') return 'الإعدادات';
    return 'أذكار وأدعية';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {currentPage !== 'home' && (
          <TouchableOpacity onPress={onBack} style={styles.button}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{getTitle()}</Text>

        <TouchableOpacity onPress={onSettingsPress} style={styles.button}>
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    color: '#065f46',
    textAlign: 'center',
    flex: 1,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
    color: '#059669',
  },
  settingsText: {
    fontSize: 18,
  },
});

export default Navigation;
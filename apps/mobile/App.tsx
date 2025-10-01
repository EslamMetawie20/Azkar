import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Alert, I18nManager, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import { CategorySlug } from '@azkar/shared';
import { mobileApiService } from './src/services/api';
import { setupRTL } from './src/utils/rtl';
import HomePage from './src/components/HomePage';
import AzkarList from './src/components/AzkarList';
import Settings from './src/components/Settings';
import Navigation from './src/components/Navigation';
import QuranList from './src/components/QuranList';
import SurahViewer from './src/components/SurahViewer';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { FontProvider } from './src/contexts/FontContext';

type Page = 'home' | 'azkar' | 'settings' | 'quran' | 'surah';

function AppContent() {
  const { colors, theme } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Setup RTL
        setupRTL();

        // Note: Custom fonts would be loaded here in a production app
        // await Font.loadAsync({ ... });

        // Ensure data is available
        const dataReady = await mobileApiService.ensureDataAvailable();
        if (!dataReady) {
          Alert.alert(
            'تحذير',
            'لم يتم تحميل البيانات. تأكد من الاتصال بالإنترنت وأعد تشغيل التطبيق.',
            [{ text: 'موافق' }]
          );
        }

        // Check online status
        const online = await mobileApiService.isOnline();
        setIsOnline(online);

        // Show offline message if not online
        if (!online) {
          setShowOfflineMessage(true);
          // Auto-hide after 3 seconds
          setTimeout(() => {
            setShowOfflineMessage(false);
          }, 3000);
        }

        setIsReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        Alert.alert('خطأ', 'حدث خطأ أثناء تحميل التطبيق');
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  const handleCategorySelect = (category: CategorySlug) => {
    setSelectedCategory(category);
    setCurrentPage('azkar');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedCategory(null);
    setSelectedSurah(null);
  };

  const handleQuranSelect = () => {
    setCurrentPage('quran');
  };

  const handleSurahSelect = (surahNumber: number) => {
    setSelectedSurah(surahNumber);
    setCurrentPage('surah');
  };

  const handleBackFromSurah = () => {
    setCurrentPage('quran');
    setSelectedSurah(null);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    if (page !== 'azkar') {
      setSelectedCategory(null);
    }
  };

  if (!isReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.primary }]}>
        <ActivityIndicator size="large" color={colors.surface} />
        <Text style={[styles.loadingText, { color: colors.surface }]}>جاري تحميل الأذكار...</Text>
        <StatusBar
          style={theme === 'dark' ? 'light' : 'dark'}
          backgroundColor={colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        style={theme === 'dark' ? 'light' : 'dark'}
        backgroundColor={colors.primary}
      />

      {/* Offline indicator */}
      {!isOnline && showOfflineMessage && (
        <View style={[styles.offlineBar, { backgroundColor: colors.warning }]}>
          <View style={styles.offlineContent}>
            <Text style={[styles.offlineText, { color: 'white' }]}>
              أنت في وضع عدم الاتصال - يتم عرض البيانات المحفوظة محلياً
            </Text>
            <TouchableOpacity
              onPress={() => setShowOfflineMessage(false)}
              style={styles.skipButton}
            >
              <Text style={styles.skipButtonText}>تخطي</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Navigation */}
      <Navigation
        currentPage={currentPage}
        selectedCategory={selectedCategory}
        onBack={currentPage === 'surah' ? handleBackFromSurah : handleBackToHome}
        onSettingsPress={() => handlePageChange(currentPage === 'settings' ? 'home' : 'settings')}
      />

      {/* Main content */}
      <View style={styles.content}>
        {currentPage === 'home' && (
          <HomePage
            onCategorySelect={handleCategorySelect}
            onQuranSelect={handleQuranSelect}
          />
        )}
        {currentPage === 'azkar' && selectedCategory && (
          <AzkarList category={selectedCategory} />
        )}
        {currentPage === 'quran' && (
          <QuranList onSurahSelect={handleSurahSelect} />
        )}
        {currentPage === 'surah' && selectedSurah && (
          <SurahViewer surahNumber={selectedSurah} />
        )}
        {currentPage === 'settings' && <Settings />}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <AppContent />
      </FontProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  offlineBar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
});

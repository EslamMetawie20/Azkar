import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Alert, I18nManager } from 'react-native';
import * as Font from 'expo-font';
import { CategorySlug } from '@azkar/shared';
import { mobileApiService } from './src/services/api';
import { setupRTL } from './src/utils/rtl';
import HomePage from './src/components/HomePage';
import AzkarList from './src/components/AzkarList';
import Settings from './src/components/Settings';
import Navigation from './src/components/Navigation';

type Page = 'home' | 'azkar' | 'settings';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | null>(null);
  const [isOnline, setIsOnline] = useState(false);

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
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    if (page !== 'azkar') {
      setSelectedCategory(null);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>جاري تحميل الأذكار...</Text>
        <StatusBar style="light" backgroundColor="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#059669" />

      {/* Offline indicator */}
      {!isOnline && (
        <View style={styles.offlineBar}>
          <Text style={styles.offlineText}>
            أنت في وضع عدم الاتصال - يتم عرض البيانات المحفوظة محلياً
          </Text>
        </View>
      )}

      {/* Navigation */}
      <Navigation
        currentPage={currentPage}
        selectedCategory={selectedCategory}
        onBack={handleBackToHome}
        onSettingsPress={() => handlePageChange(currentPage === 'settings' ? 'home' : 'settings')}
      />

      {/* Main content */}
      <View style={styles.content}>
        {currentPage === 'home' && <HomePage onCategorySelect={handleCategorySelect} />}
        {currentPage === 'azkar' && selectedCategory && (
          <AzkarList category={selectedCategory} />
        )}
        {currentPage === 'settings' && <Settings />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#059669',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'white',
    fontWeight: '400',
    textAlign: 'center',
  },
  offlineBar: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
});

import { useState, useEffect } from 'react';
import type { CategorySlug } from '@azkar/shared';
import HomePage from './components/HomePage';
import AzkarList from './components/AzkarList';
import Settings from './components/Settings';
import QuranList from './components/QuranList';
import SurahViewer from './components/SurahViewer';
import { apiService } from './services/api';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { FontProvider } from './contexts/FontContext';

type Page = 'home' | 'azkar' | 'settings' | 'quran' | 'surah';

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        await apiService.ensureDataAvailable();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300 font-arabic">جاري تحميل الأذكار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      {/* Status bar */}
      {!isOnline && (
        <div className="bg-amber-500 dark:bg-amber-600 text-white text-center py-2 px-4 text-sm">
          أنت في وضع عدم الاتصال - يتم عرض البيانات المحفوظة محلياً
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-emerald-100 dark:border-slate-700">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          {currentPage !== 'home' && (
            <button
              onClick={currentPage === 'surah' ? handleBackFromSurah : handleBackToHome}
              className="p-2 text-emerald-600 dark:text-amber-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <h1 className="text-xl font-bold text-emerald-800 dark:text-amber-400 font-arabic">
            {currentPage === 'home' && 'أذكار وأدعية'}
            {currentPage === 'azkar' && selectedCategory === 'morning' && 'أذكار الصباح'}
            {currentPage === 'azkar' && selectedCategory === 'evening' && 'أذكار المساء'}
            {currentPage === 'quran' && 'القرآن الكريم'}
            {currentPage === 'surah' && 'سورة'}
            {currentPage === 'settings' && 'الإعدادات'}
          </h1>

          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Theme Toggle Icon */}
            <button
              onClick={toggleTheme}
              className="p-2 text-emerald-600 dark:text-amber-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                // Sun icon for light mode
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Settings Icon */}
            <button
              onClick={() => setCurrentPage(currentPage === 'settings' ? 'home' : 'settings')}
              className="p-2 text-emerald-600 dark:text-amber-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full max-w-4xl mx-auto px-4 py-6">
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
          <SurahViewer surahNumber={selectedSurah} onBack={handleBackFromSurah} />
        )}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <AppContent />
      </FontProvider>
    </ThemeProvider>
  );
}

export default App;

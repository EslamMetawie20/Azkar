import { useState, useEffect } from 'react';
import type { CategorySlug } from '@azkar/shared';
import HomePage from './components/HomePage';
import AzkarList from './components/AzkarList';
import Settings from './components/Settings';
import { apiService } from './services/api';
import { ThemeProvider } from './contexts/ThemeContext';

type Page = 'home' | 'azkar' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | null>(null);
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300 font-arabic">جاري تحميل الأذكار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800">
      {/* Status bar */}
      {!isOnline && (
        <div className="bg-amber-500 dark:bg-amber-600 text-white text-center py-2 px-4 text-sm">
          أنت في وضع عدم الاتصال - يتم عرض البيانات المحفوظة محلياً
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-emerald-100 dark:border-slate-700">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          {currentPage !== 'home' && (
            <button
              onClick={handleBackToHome}
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
            {currentPage === 'settings' && 'الإعدادات'}
          </h1>

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
      </header>

      {/* Main content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {currentPage === 'home' && <HomePage onCategorySelect={handleCategorySelect} />}
        {currentPage === 'azkar' && selectedCategory && (
          <AzkarList category={selectedCategory} />
        )}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

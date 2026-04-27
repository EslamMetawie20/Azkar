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
import StatsCard from './components/StatsCard';

type Page = 'home' | 'azkar' | 'settings' | 'quran' | 'surah';

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="min-h-screen bg-spiritual-paper dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-spiritual-dark border-solid"></div>
          <p className="text-spiritual-dark dark:text-spiritual-accent font-arabic font-bold text-lg">نور الطريق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spiritual-paper dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Spiritual Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-spiritual-dark/10">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center">
            {currentPage !== 'home' && (
              <button
                onClick={currentPage === 'surah' ? handleBackFromSurah : handleBackToHome}
                className="p-3 text-spiritual-dark dark:text-spiritual-accent hover:bg-spiritual-dark/5 rounded-2xl transition-all mr-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-2xl font-black text-spiritual-dark dark:text-spiritual-accent font-arabic tracking-tight">
              {currentPage === 'home' && 'الأذكار'}
              {currentPage === 'azkar' && (selectedCategory === 'morning' ? 'أذكار الصباح' : 'أذكار المساء')}
              {currentPage === 'quran' && 'القرآن الكريم'}
              {currentPage === 'surah' && 'تلاوة السورة'}
              {currentPage === 'settings' && 'الإعدادات'}
            </h1>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            <StatsCard hideLabel />
            <button
              onClick={toggleTheme}
              className="p-3 bg-spiritual-dark/5 text-spiritual-dark dark:text-spiritual-accent rounded-2xl hover:bg-spiritual-dark/10 transition-all border border-spiritual-dark/10"
            >
              {isDark ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setCurrentPage(currentPage === 'settings' ? 'home' : 'settings')}
              className={`p-3 rounded-2xl transition-all border ${currentPage === 'settings' ? 'bg-spiritual-dark text-white border-spiritual-dark' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-spiritual-dark/50'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-10 min-h-[calc(100vh-5rem)]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
        </div>
      </main>

      <footer className="py-10 text-center opacity-20 pointer-events-none select-none">
        <div className="flex justify-center space-x-4 space-x-reverse grayscale">
          <div className="w-2 h-2 bg-spiritual-dark rounded-full"></div>
          <div className="w-2 h-2 bg-spiritual-dark rounded-full"></div>
          <div className="w-2 h-2 bg-spiritual-dark rounded-full"></div>
        </div>
      </footer>
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
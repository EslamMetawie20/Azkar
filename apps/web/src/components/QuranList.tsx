import React, { useState, useEffect, useContext } from 'react';
import type { Surah } from '@azkar/shared';
import { quranApi } from '@azkar/shared';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontContext';

interface QuranListProps {
  onSurahSelect: (surahNumber: number) => void;
}

const QuranList: React.FC<QuranListProps> = ({ onSurahSelect }) => {
  const { isDark } = useTheme();
  const { fontSize } = useFontSize();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      const data = await quranApi.getSurahs();
      setSurahs(data);
    } catch (error) {
      console.error('Failed to load surahs:', error);
      alert('فشل في تحميل قائمة السور');
    } finally {
      setLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(
    surah =>
      surah.name.includes(searchText) ||
      surah.englishName.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 dark:border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400 font-arabic">جاري تحميل قائمة السور...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontSize: `${fontSize || 16}px` }}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2 font-arabic">
          القرآن الكريم
        </h2>
        <p className="text-gray-600 dark:text-slate-400 font-arabic">
          {surahs.length} سورة
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="ابحث عن سورة..."
          className="w-full p-4 pr-12 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl font-arabic text-right focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-400 outline-none"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Surahs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => (
          <button
            key={surah.number}
            onClick={() => onSurahSelect(surah.number)}
            className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-amber-400 text-right"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-amber-400 dark:to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {surah.number}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 font-arabic mb-1">
                  {surah.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                  {surah.englishName}
                </p>
                <div className="flex justify-end gap-3 text-xs text-gray-500 dark:text-slate-500">
                  <span className="font-arabic">{surah.numberOfAyahs} آية</span>
                  <span className="font-arabic">
                    {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuranList;
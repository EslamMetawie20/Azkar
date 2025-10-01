import React, { useState, useEffect, useContext } from 'react';
import type { SurahWithAyahs } from '@azkar/shared';
import { quranApi } from '@azkar/shared';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontContext';

interface SurahViewerProps {
  surahNumber: number;
  onBack: () => void;
}

const SurahViewer: React.FC<SurahViewerProps> = ({ surahNumber, onBack }) => {
  const { isDark } = useTheme();
  const { fontSize } = useFontSize();
  const [surah, setSurah] = useState<SurahWithAyahs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurah();
  }, [surahNumber]);

  const loadSurah = async () => {
    try {
      setLoading(true);
      const data = await quranApi.getSurah(surahNumber);
      setSurah(data);
    } catch (error) {
      console.error(`Failed to load surah ${surahNumber}:`, error);
      alert('فشل في تحميل السورة');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 dark:border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400 font-arabic">جاري تحميل السورة...</p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-slate-400 font-arabic">لم يتم العثور على السورة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontSize: `${fontSize || 16}px` }}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-emerald-600 dark:text-amber-400 hover:underline"
      >
        <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-arabic">رجوع لقائمة السور</span>
      </button>

      {/* Surah Header */}
      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-8 shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-slate-100 mb-3 font-arabic">
          {surah.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 mb-4">
          {surah.englishName} - {surah.englishNameTranslation}
        </p>
        <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-slate-500">
          <span className="font-arabic">السورة رقم {surah.number}</span>
          <span className="font-arabic">{surah.numberOfAyahs} آية</span>
          <span className="font-arabic">
            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </span>
        </div>
      </div>

      {/* Bismillah for all surahs except At-Tawbah (9) */}
      {surah.number !== 9 && surah.number !== 1 && (
        <div className="text-center py-6">
          <p className="text-2xl font-bold text-gray-800 dark:text-slate-100 font-arabic">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-4">
        {surah.ayahs.map((ayah) => (
          <div
            key={ayah.number}
            className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <p className="text-lg leading-relaxed text-gray-800 dark:text-slate-100 font-arabic text-right mb-2">
              {ayah.text}
              <span className="text-emerald-600 dark:text-amber-400 font-bold mx-2">
                ﴿{ayah.numberInSurah}﴾
              </span>
            </p>
            {ayah.sajda && typeof ayah.sajda === 'object' && (
              <div className="mt-3 inline-block bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-md text-sm font-arabic">
                {ayah.sajda.obligatory ? 'سجدة واجبة' : 'سجدة مستحبة'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer with back button */}
      <div className="text-center py-6">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-emerald-600 dark:bg-amber-500 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-amber-600 transition-colors font-arabic"
        >
          رجوع لقائمة السور
        </button>
      </div>
    </div>
  );
};

export default SurahViewer;
import React, { useState, useEffect } from 'react';
import type { Surah } from '@azkar/shared';
import { quranApi } from '@azkar/shared';

interface QuranListProps {
  onSurahSelect: (surahNumber: number) => void;
}

const QuranList: React.FC<QuranListProps> = ({ onSurahSelect }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      const data = await quranApi.getSurahs();
      setSurahs(data);
    } catch (error) {
      console.error('Failed to load surahs:', error);
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
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritual-dark"></div>
        <p className="text-spiritual-dark dark:text-spiritual-accent font-arabic">جاري تحميل الفهرس...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-spiritual-dark dark:text-spiritual-accent font-arabic">
          سور القرآن الكريم
        </h2>
        <p className="text-slate-400 font-arabic">
          {surahs.length} سورة مباركة
        </p>
      </div>

      {/* Search - Elegant Design */}
      <div className="relative max-w-xl mx-auto group">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="ابحث عن سورة..."
          className="w-full p-5 pr-14 bg-white dark:bg-slate-900 border-2 border-spiritual-dark/10 rounded-[2rem] font-arabic text-right focus:ring-4 focus:ring-spiritual-dark/5 focus:border-spiritual-dark outline-none transition-all shadow-sm group-hover:shadow-md"
        />
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-spiritual-dark opacity-40 group-focus-within:opacity-100 transition-opacity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Surahs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurahs.map((surah) => (
          <button
            key={surah.number}
            onClick={() => onSurahSelect(surah.number)}
            className="group p-6 bg-white dark:bg-slate-900 border-2 border-spiritual-dark/5 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-spiritual-dark/30 text-right relative overflow-hidden"
          >
            <div className="flex items-center space-x-4 space-x-reverse relative z-10">
              {/* Surah Number - FIXED: No more green! */}
              <div className="w-14 h-14 bg-spiritual-paper dark:bg-spiritual-dark/10 border-2 border-spiritual-dark/20 group-hover:border-spiritual-dark rounded-2xl flex items-center justify-center text-spiritual-dark dark:text-spiritual-accent font-bold text-lg transition-all duration-500 shadow-inner">
                {surah.number}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-spiritual-dark dark:text-spiritual-accent mb-1 group-hover:translate-x-[-2px] transition-transform" style={{ fontFamily: "'Amiri', serif" }}>
                  {surah.name}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-arabic italic">
                  {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                </p>
              </div>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-spiritual-dark/5 rounded-full blur-2xl group-hover:bg-spiritual-dark/10 transition-all"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuranList;
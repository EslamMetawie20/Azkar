import React, { useState, useEffect } from 'react';
import type { SurahWithAyahs } from '@azkar/shared';
import { quranApi } from '@azkar/shared';
import { useFontSize } from '../contexts/FontContext';

interface SurahViewerProps {
  surahNumber: number;
  onBack: () => void;
}

const SurahViewer: React.FC<SurahViewerProps> = ({ surahNumber, onBack }) => {
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritual-dark"></div>
        <p className="text-spiritual-dark dark:text-spiritual-accent font-arabic">جاري تحميل السورة...</p>
      </div>
    );
  }

  if (!surah) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24">
      {/* Header Navigation */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 space-x-reverse text-spiritual-dark opacity-60 hover:opacity-100 transition-all font-bold group px-2"
      >
        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-arabic text-lg">العودة للفهرس</span>
      </button>

      {/* Surah Decorative Frame */}
      <div className="relative p-[2px] bg-gradient-to-b from-spiritual-dark/20 via-spiritual-accent/10 to-spiritual-dark/20 rounded-[2.5rem] shadow-xl">
        <div className="bg-[#FCF8F1] dark:bg-slate-900 rounded-[2.4rem] p-6 md:p-12 shadow-inner">
          
          {/* Surah Title Section */}
          <div className="text-center mb-12 space-y-4 border-b border-spiritual-dark/5 pb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-spiritual-dark dark:text-spiritual-accent font-arabic">
              {surah.name}
            </h1>
            <div className="flex justify-center items-center space-x-4 space-x-reverse text-slate-400 font-arabic italic text-xs tracking-widest">
              <span>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
              <span className="w-1 h-1 bg-spiritual-gold/20 rounded-full"></span>
              <span>{surah.numberOfAyahs} آية</span>
            </div>
          </div>

          {/* Bismillah */}
          {surah.number !== 9 && (
            <div className="text-center mb-12">
              <p className="quran-text text-4xl md:text-5xl text-spiritual-dark dark:text-slate-100 leading-normal opacity-95">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            </div>
          )}

          {/* Mushaf Layout Content */}
          <div 
            className="quran-text text-right text-justify"
            style={{ 
              fontSize: `${fontSize * 1.5}px`,
              lineHeight: '2.4',
              wordSpacing: '2px',
              textAlignLast: 'center'
            }}
          >
            {surah.ayahs.map((ayah: any) => (
              <React.Fragment key={ayah.number}>
                <span className="inline text-slate-800 dark:text-slate-100 transition-colors hover:text-spiritual-dark">
                  {ayah.numberInSurah === 1 && surah.number !== 1 && surah.number !== 9
                    ? ayah.text.replace('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', '').trim()
                    : ayah.text}
                </span>
                
                {/* Traditional Ayah Marker */}
                <span className="inline-flex items-center justify-center mx-2 relative select-none translate-y-[4px]">
                  <svg className="w-8 h-8 text-spiritual-dark/40 fill-none stroke-current" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" strokeWidth="1" />
                    <path d="M18 3 L18 6 M18 33 L18 30 M3 18 L6 18 M33 18 L30 18" strokeWidth="1.5" />
                    <circle cx="18" cy="18" r="11" strokeWidth="0.5" strokeDasharray="1 2" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-spiritual-dark font-serif font-bold text-[10px] pb-[1px]">
                    {ayah.numberInSurah}
                  </span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center pt-8">
        <button
          onClick={onBack}
          className="px-14 py-4 bg-spiritual-dark text-white rounded-full hover:bg-spiritual-medium transition-all shadow-lg font-arabic font-bold text-lg"
        >
          صدق الله العظيم
        </button>
      </div>
    </div>
  );
};

export default SurahViewer;
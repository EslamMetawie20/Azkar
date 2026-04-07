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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritual-gold"></div>
        <p className="text-spiritual-dark dark:text-spiritual-sand font-arabic">جاري تحميل السورة...</p>
      </div>
    );
  }

  if (!surah) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Navigation Header */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 space-x-reverse text-spiritual-primary hover:text-spiritual-dark transition-colors font-bold group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-arabic text-lg">العودة للفهرس</span>
      </button>

      {/* Surah Title Card */}
      <div className="text-center p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 border-2 border-spiritual-gold/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-spiritual-gold/40 to-transparent"></div>
        <h1 className="text-6xl font-bold text-spiritual-dark dark:text-spiritual-sand font-arabic mb-6">
          {surah.name}
        </h1>
        <div className="flex justify-center items-center space-x-6 space-x-reverse text-slate-400 font-arabic tracking-wide">
          <span className="bg-spiritual-gold/5 px-4 py-1 rounded-full border border-spiritual-gold/10">
            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </span>
          <span className="w-1.5 h-1.5 bg-spiritual-gold/30 rounded-full"></span>
          <span className="bg-spiritual-gold/5 px-4 py-1 rounded-full border border-spiritual-gold/10">
            {surah.numberOfAyahs} آية
          </span>
        </div>
      </div>

      {/* Bismillah */}
      {surah.number !== 9 && (
        <div className="text-center py-6">
          <p className="quran-text text-5xl text-spiritual-dark dark:text-slate-100 opacity-90">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs Display - Line by Line Card Layout */}
      <div className="space-y-6">
        {surah.ayahs.map((ayah: any) => (
          <div 
            key={ayah.number}
            className="group relative bg-white/60 dark:bg-slate-900/60 p-8 rounded-[2.5rem] border border-white/20 hover:border-spiritual-gold/20 transition-all duration-500 hover:shadow-lg hover:scale-[1.01]"
          >
            {/* Verse Number Marker */}
            <div className="absolute top-6 right-6 flex items-center justify-center w-12 h-12 rounded-full border-2 border-spiritual-gold/20 text-spiritual-gold font-serif text-lg font-bold bg-white dark:bg-slate-900 group-hover:border-spiritual-gold group-hover:shadow-md transition-all duration-500">
              {ayah.numberInSurah}
            </div>

            {/* Verse Text */}
            <div 
              className="quran-text text-right pr-16" 
              style={{ fontSize: `${fontSize * 1.5}px` }}
            >
              {ayah.text.replace('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', '')}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-center pt-12">
        <button
          onClick={onBack}
          className="group relative overflow-hidden px-12 py-5 bg-spiritual-dark text-white rounded-3xl hover:bg-spiritual-primary transition-all duration-500 shadow-xl font-arabic font-bold text-xl"
        >
          <span className="relative z-10">تمت القراءة بحمد الله</span>
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </button>
      </div>
    </div>
  );
};

export default SurahViewer;
import React, { useState, useEffect, useRef } from 'react';
import type { SurahWithAyahs } from '@azkar/shared';
import { quranApi } from '@azkar/shared';
import { useFontSize } from '../contexts/FontContext';
import bismillahImg from '../assets/bismilah3.png';

interface SurahViewerProps {
  surahNumber: number;
  onBack: () => void;
}

const SurahViewer: React.FC<SurahViewerProps> = ({ surahNumber, onBack }) => {
  const { fontSize } = useFontSize();
  const [surah, setSurah] = useState<SurahWithAyahs | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auto-scroll state
  const [scrollSpeed, setScrollSpeed] = useState(0); // 0 = stop, 1-10 = speeds
  const scrollIntervalRef = useRef<any>(null);

  useEffect(() => {
    loadSurah();
    return () => stopScroll(); // Cleanup on unmount
  }, [surahNumber]);

  useEffect(() => {
    stopScroll();
    if (scrollSpeed > 0) {
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy({
          top: scrollSpeed * 0.5,
          behavior: 'auto'
        });
      }, 30);
    }
    return () => stopScroll();
  }, [scrollSpeed]);

  const stopScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

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

  const getCleanAyahText = (ayah: any, surahNum: number) => {
    let text = ayah.text;
    if (ayah.numberInSurah === 1 && surahNum !== 1 && surahNum !== 9) {
      text = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
      text = text.replace(/^بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\s*/, '');
      text = text.replace(/^بسم الله الرحمن الرحيم\s*/, '');
      
      if (text.includes('الرَّحِيمِ') || text.includes('ٱلرَّحِيمِ')) {
        const idx = Math.max(text.indexOf('الرَّحِيمِ'), text.indexOf('ٱلرَّحِيمِ'));
        if (idx >= 0 && idx < 45) {
          text = text.slice(idx + 10).trim();
        }
      }
    }
    return text;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24 relative">
      
      {/* Super Slim Auto-Scroll Controller (Fixed Left) */}
      <div className="fixed left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center space-y-4 p-2 md:p-2.5 bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl rounded-full border border-spiritual-dark/10 shadow-xl transition-all hover:opacity-100 opacity-30 hover:bg-white/40">
        <div className="relative h-48 w-6 flex flex-col items-center">
          <div className="text-[8px] text-spiritual-dark/40 mb-1">▼</div>
          
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={scrollSpeed}
            onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
            className="vertical-range accent-spiritual-dark cursor-pointer flex-1"
            style={{ 
              WebkitAppearance: 'slider-vertical', 
              width: '3px'
            } as any}
          />
          
          <div className="text-[8px] text-spiritual-dark/40 mt-1">▲</div>
        </div>
        
        {/* Slim Elegant Stop Button */}
        <button 
          onClick={() => setScrollSpeed(0)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${scrollSpeed === 0 ? 'bg-transparent text-spiritual-dark opacity-20' : 'bg-spiritual-dark text-white shadow-md active:scale-90'}`}
          title="توقف"
        >
          <div className="flex space-x-0.5 space-x-reverse">
            <div className="w-1 h-3 bg-current rounded-full"></div>
            <div className="w-1 h-3 bg-current rounded-full"></div>
          </div>
        </button>
      </div>

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
            <h1 className="text-5xl md:text-6xl font-bold text-spiritual-dark dark:text-spiritual-accent mb-6" style={{ fontFamily: "'Amiri', serif" }}>
              {surah.name}
            </h1>
            <div className="flex justify-center items-center space-x-4 space-x-reverse text-slate-400 font-arabic italic text-xs tracking-widest">
              <span>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
              <span className="w-1 h-1 bg-spiritual-gold/20 rounded-full"></span>
              <span>{surah.numberOfAyahs} آية</span>
            </div>
          </div>

          {/* Original Bismillah Image */}
          {surah.number !== 9 && (
            <div className="flex justify-center mb-12 animate-fade-in">
              <img
                src={bismillahImg}
                alt="بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ"
                className="object-contain dark:brightness-0 dark:invert opacity-90 transition-all hover:opacity-100"
                style={{ width: 'auto', maxWidth: '400px', height: 'auto', maxHeight: '10rem' }}
              />
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
                  {getCleanAyahText(ayah, surah.number)}
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
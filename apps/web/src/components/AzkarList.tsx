import React, { useState, useEffect } from 'react';
import { Zikr, CategorySlug } from '@azkar/shared';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';
import { useFontSize } from '../contexts/FontContext';

interface AzkarListProps {
  category: CategorySlug;
}

const AzkarList: React.FC<AzkarListProps> = ({ category }) => {
  const { fontSize } = useFontSize();
  const [azkar, setAzkar] = useState<Zikr[]>([]);
  const [counts, setCounts] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAzkar = async () => {
      setLoading(true);
      const data = await apiService.getAzkarByCategory(category);
      setAzkar(data);
      
      const savedProgress = await storage.getAllProgress();
      const progressMap: { [key: number]: number } = {};
      savedProgress.forEach(p => {
        progressMap[p.zikrId] = p.currentCount;
      });
      setCounts(progressMap);
      setLoading(false);
    };
    loadAzkar();
  }, [category]);

  const handleIncrement = async (zikrId: number, targetCount: number) => {
    const currentCount = counts[zikrId] || 0;
    if (currentCount < targetCount) {
      const newCount = currentCount + 1;
      setCounts({ ...counts, [zikrId]: newCount });
      await storage.saveProgress(zikrId, newCount, targetCount);
      
      // Haptic feedback simulation or sound could go here
      if (newCount === targetCount && window.navigator.vibrate) {
        window.navigator.vibrate(100);
      }
    }
  };

  const handleReset = async (zikrId: number) => {
    setCounts({ ...counts, [zikrId]: 0 });
    await storage.saveProgress(zikrId, 0, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritual-gold"></div>
        <p className="text-spiritual-dark dark:text-spiritual-sand font-arabic animate-pulse">جاري جلب الأذكار...</p>
      </div>
    );
  }

  const completedCount = azkar.filter(z => (counts[z.id] || 0) >= z.repeatMin).length;
  const progressPercent = azkar.length > 0 ? Math.round((completedCount / azkar.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* Progress Sticky Header */}
      <div className="sticky top-0 z-20 bg-spiritual-light/95 dark:bg-slate-950/95 backdrop-blur py-4 -mx-4 px-4 border-b border-spiritual-gold/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-spiritual-gold transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <span className="text-spiritual-dark dark:text-spiritual-gold font-bold font-arabic">
            {completedCount} / {azkar.length}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {azkar.map((zikr) => {
          const count = counts[zikr.id] || 0;
          const isCompleted = count >= zikr.repeatMin;

          return (
            <div
              key={zikr.id}
              className={`group transition-all duration-500 rounded-[2rem] overflow-hidden ${
                isCompleted 
                ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-2 border-emerald-500/20 opacity-75 scale-[0.98]' 
                : 'bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-800 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="p-8 space-y-6">
                {/* Zikr Text */}
                <p 
                  className={`arabic-text text-right leading-relaxed transition-colors duration-500 ${
                    isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {zikr.textAr}
                </p>

                {/* Footnote */}
                {zikr.footnoteAr && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-right border-r-2 border-spiritual-gold/20 pr-3 italic">
                    {zikr.footnoteAr}
                  </p>
                )}

                {/* Interaction Area */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => handleReset(zikr.id)}
                    className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                    title="إعادة تعيين"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleIncrement(zikr.id, zikr.repeatMin)}
                    disabled={isCompleted}
                    className={`relative flex items-center justify-center min-w-[140px] py-4 rounded-2xl font-bold transition-all duration-300 ${
                      isCompleted
                      ? 'bg-emerald-500 text-white cursor-default'
                      : 'bg-spiritual-dark text-white hover:bg-spiritual-primary active:scale-95 shadow-lg shadow-emerald-900/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse relative z-10">
                      <span className="text-2xl font-arabic">{zikr.repeatMin - count}</span>
                      <span className="text-sm font-arabic opacity-80">متبقي</span>
                    </div>
                    {/* Ripple Effect Background could go here */}
                  </button>

                  <div className="w-10">
                    {isCompleted && (
                      <div className="text-emerald-500 animate-bounce-short">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {progressPercent === 100 && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-spiritual-gold text-white px-8 py-4 rounded-full shadow-2xl animate-bounce font-arabic font-bold z-50">
          ✨ تقبل الله منك صلح الأعمال ✨
        </div>
      )}
    </div>
  );
};

export default AzkarList;
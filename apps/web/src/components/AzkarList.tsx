import React, { useState, useEffect } from 'react';
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import type { Zikr, CategorySlug } from '@azkar/shared';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';
import { useFontSize } from '../contexts/FontContext';

interface AzkarListProps {
  category: CategorySlug;
}

interface ZikrProgress {
  currentCount: number;
  targetCount: number;
}

const AzkarList: React.FC<AzkarListProps> = ({ category }) => {
  const { fontSize } = useFontSize();
  const [azkar, setAzkar] = useState<Zikr[]>([]);
  const [progress, setProgress] = useState<Record<number, ZikrProgress>>({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadAzkar = async () => {
      setLoading(true);
      try {
        const azkarData = await apiService.getAzkarByCategory(category);
        setAzkar(azkarData);

        // Load progress for each zikr
        const progressData: Record<number, ZikrProgress> = {};
        for (const zikr of azkarData) {
          const savedProgress = await storage.getProgress(zikr.id);
          progressData[zikr.id] = {
            currentCount: savedProgress?.currentCount || 0,
            targetCount: zikr.repeatMin
          };
        }
        setProgress(progressData);
      } catch (error) {
        console.error('Failed to load azkar:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAzkar();
  }, [category]);

  const handleIncrement = async (zikrId: number) => {
    const currentProgress = progress[zikrId];
    if (!currentProgress) return;

    const newCount = Math.min(currentProgress.currentCount + 1, currentProgress.targetCount);
    const newProgress = { ...currentProgress, currentCount: newCount };

    setProgress(prev => ({ ...prev, [zikrId]: newProgress }));
    await storage.saveProgress(zikrId, newCount, currentProgress.targetCount);

    // Move to next azkar if current one is completed
    if (newCount >= currentProgress.targetCount && currentIndex < azkar.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 500);
    }
  };

  const handleReset = async (zikrId: number) => {
    const currentProgress = progress[zikrId];
    if (!currentProgress) return;

    const newProgress = { ...currentProgress, currentCount: 0 };
    setProgress(prev => ({ ...prev, [zikrId]: newProgress }));
    await storage.saveProgress(zikrId, 0, currentProgress.targetCount);
  };

  const resetAllProgress = async () => {
    const newProgress: Record<number, ZikrProgress> = {};
    for (const zikr of azkar) {
      newProgress[zikr.id] = {
        currentCount: 0,
        targetCount: zikr.repeatMin
      };
      await storage.saveProgress(zikr.id, 0, zikr.repeatMin);
    }
    setProgress(newProgress);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-amber-400"></div>
      </div>
    );
  }

  const totalCompleted = Object.values(progress).filter(p => p.currentCount >= p.targetCount).length;
  const totalAzkar = azkar.length;

  // Animation variants for current card (large)
  const currentCardVariants: Variants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  // Animation variants for other cards (small)
  const otherCardVariants: Variants = {
    hidden: {
      opacity: 0.5,
      scale: 0.85
    },
    visible: {
      opacity: 0.7,
      scale: 0.85,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600 dark:text-amber-400 font-arabic">
              {totalCompleted} / {totalAzkar}
            </p>
            <p className="text-gray-600 dark:text-slate-300 text-sm font-arabic">مكتملة</p>
          </div>
          <button
            onClick={resetAllProgress}
            className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm text-gray-700 dark:text-slate-300 transition-colors font-arabic"
          >
            إعادة تعيين الكل
          </button>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-amber-400 dark:to-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalAzkar > 0 ? (totalCompleted / totalAzkar) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Azkar list with focus on current */}
      <div style={{ margin: "0 auto", maxWidth: 900, paddingBottom: 50 }}>
        {azkar.map((zikr, index) => {
          const zikrProgress = progress[zikr.id];
          const isCompleted = zikrProgress?.currentCount >= zikrProgress?.targetCount;
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={zikr.id}
              initial="hidden"
              animate="visible"
              variants={isCurrent ? currentCardVariants : otherCardVariants}
              onClick={() => !isCurrent && setCurrentIndex(index)}
              style={{
                marginBottom: 16,
                cursor: !isCurrent ? 'pointer' : 'default',
              }}
            >
              <motion.div
                animate={{
                  scale: isCurrent ? 1 : 0.85,
                  opacity: isCurrent ? 1 : 0.5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transition-all duration-300 border dark:border-slate-700 ${
                  isCompleted ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:ring-amber-400 dark:bg-slate-700' : ''
                } ${isCurrent ? 'ring-4 ring-emerald-300 dark:ring-amber-300' : ''}`}
                style={{
                  padding: isCurrent ? '2rem' : '1rem',
                  boxShadow: isCurrent
                    ? "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075), 0 0 32px hsl(0deg 0% 0% / 0.075)"
                    : "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {/* Zikr number */}
                <div className="flex justify-between items-start" style={{ marginBottom: isCurrent ? '1.5rem' : '0.5rem' }}>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span
                      className="bg-emerald-100 dark:bg-slate-700 text-emerald-700 dark:text-amber-400 rounded-full flex items-center justify-center font-bold"
                      style={{
                        width: isCurrent ? '2.5rem' : '2rem',
                        height: isCurrent ? '2.5rem' : '2rem',
                        fontSize: isCurrent ? '1rem' : '0.875rem',
                      }}
                    >
                      {index + 1}
                    </span>
                    {isCompleted && (
                      <span className="text-emerald-600 dark:text-amber-400">
                        <svg className={isCurrent ? "w-6 h-6" : "w-5 h-5"} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                {/* Zikr text - Large when current, small otherwise */}
                {isCurrent ? (
                  <div className="mb-8">
                    <p
                      className="text-gray-800 dark:text-slate-100 leading-relaxed font-arabic mb-4 text-center"
                      style={{ fontSize: `${fontSize * 2}px` }}
                    >
                      {zikr.textAr}
                    </p>
                    {zikr.footnoteAr && (
                      <p
                        className="text-gray-500 dark:text-slate-400 font-arabic border-r-2 border-emerald-200 dark:border-amber-400 pr-3"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {zikr.footnoteAr}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-2">
                    <p
                      className="text-gray-600 dark:text-slate-300 font-arabic line-clamp-2"
                      style={{ fontSize: `${fontSize * 0.875}px` }}
                    >
                      {zikr.textAr}
                    </p>
                  </div>
                )}

                {/* Counter - Full controls when current, minimal when not */}
                {isCurrent ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <button
                          onClick={() => handleIncrement(zikr.id)}
                          disabled={isCompleted}
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all ${
                            isCompleted
                              ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-amber-500 dark:to-yellow-500 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-amber-600 dark:hover:to-yellow-600 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {isCompleted ? '✓' : '+'}
                        </button>
                        <button
                          onClick={() => handleReset(zikr.id)}
                          className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm text-gray-600 dark:text-slate-300 transition-colors font-arabic"
                        >
                          إعادة
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800 dark:text-slate-100">
                          {zikrProgress?.currentCount || 0} / {zikrProgress?.targetCount || zikr.repeatMin}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-slate-400 font-arabic">
                          {zikr.repeatMin === 1 ? 'مرة واحدة' : `${zikr.repeatMin} مرات`}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6">
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-amber-400 dark:to-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${zikrProgress ? (zikrProgress.currentCount / zikrProgress.targetCount) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                    <span>{zikrProgress?.currentCount || 0} / {zikrProgress?.targetCount || zikr.repeatMin}</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {totalCompleted === totalAzkar && totalAzkar > 0 && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-amber-500 dark:to-yellow-500 rounded-2xl p-6 text-white text-center shadow-lg">
          <div className="text-3xl mb-2">🎉</div>
          <h3 className="text-xl font-bold mb-2 font-arabic">أحسنت!</h3>
          <p className="font-arabic">لقد أكملت جميع الأذكار بتوفيق الله</p>
        </div>
      )}
    </div>
  );
};

export default AzkarList;
import React, { useState, useEffect } from 'react';
import type { TasbihOption } from '@azkar/shared';
import { apiService } from '../services/api';

const TasbihCounter: React.FC = () => {
  const [tasbihOptions, setTasbihOptions] = useState<TasbihOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<TasbihOption | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadTasbihOptions = async () => {
      setLoading(true);
      try {
        const options = await apiService.getTasbihOptions();
        setTasbihOptions(options);
      } catch (error) {
        console.error('Failed to load tasbih options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasbihOptions();
  }, []);

  const handleOptionSelect = (option: TasbihOption) => {
    setSelectedOption(option);
    setCurrentItemIndex(0);
    setCurrentCount(0);
    setIsCompleted(false);
  };

  const handleIncrement = () => {
    if (!selectedOption || isCompleted) return;

    const currentItem = selectedOption.items[currentItemIndex];
    const newCount = currentCount + 1;

    if (newCount >= currentItem.count) {
      // Current item completed, move to next
      if (currentItemIndex < selectedOption.items.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
        setCurrentCount(0);
      } else {
        // All items completed
        setIsCompleted(true);
      }
    } else {
      setCurrentCount(newCount);
    }
  };

  const handleReset = () => {
    setCurrentItemIndex(0);
    setCurrentCount(0);
    setIsCompleted(false);
  };

  const getTotalProgress = () => {
    if (!selectedOption) return 0;

    let completedCounts = 0;

    // Add counts from completed items
    for (let i = 0; i < currentItemIndex; i++) {
      completedCounts += selectedOption.items[i].count;
    }

    // Add current count
    completedCounts += currentCount;

    // Calculate total possible counts
    const totalCounts = selectedOption.items.reduce((sum: number, item: any) => sum + item.count, 0);

    return Math.round((completedCounts / totalCounts) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-amber-400"></div>
      </div>
    );
  }

  if (!selectedOption) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 font-arabic">
            التسبيح
          </h2>
          <p className="text-gray-600 dark:text-slate-300 font-arabic text-sm leading-relaxed">
            اختر نوع التسبيح المناسب لك
          </p>
        </div>

        <div className="space-y-4">
          {tasbihOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className="w-full p-6 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-amber-400"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-2 font-arabic">
                  {option.nameAr}
                </h3>
                <div className="text-sm text-gray-600 dark:text-slate-400 font-arabic">
                  {option.items.map((item: any, index: number) => (
                    <span key={item.id}>
                      {item.textAr} ({item.count})
                      {index < option.items.length - 1 && ' • '}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info section */}
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 text-center font-arabic">
            فضل التسبيح
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-slate-300 font-arabic leading-relaxed">
            <p>
              قال رسول الله ﷺ: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم"
            </p>
            <p>
              وقال ﷺ: "أحب الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر"
            </p>
            <p>
              يُستحب أيضاً قراءة قل هو الله أحد والمعوذتين بعد كل صلاة، وتُكرر ثلاث مرات بعد المغرب والفجر وعند النوم.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = selectedOption.items[currentItemIndex];
  const progress = getTotalProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedOption(null)}
          className="p-2 text-emerald-600 dark:text-amber-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 font-arabic">
          {selectedOption.nameAr}
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600 dark:text-amber-400 font-arabic">
              {progress}%
            </p>
            <p className="text-gray-600 dark:text-slate-300 text-sm font-arabic">مكتمل</p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm text-gray-700 dark:text-slate-300 transition-colors font-arabic"
          >
            إعادة تعيين
          </button>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-amber-400 dark:to-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Item */}
      {!isCompleted && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border dark:border-slate-700">
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-4 font-arabic leading-loose">
              {currentItem.textAr}
            </p>
            <div className="text-lg font-bold text-gray-800 dark:text-slate-100">
              {currentCount} / {currentItem.count}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleIncrement}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-amber-500 dark:to-yellow-500 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-amber-600 dark:hover:to-yellow-600 shadow-lg hover:shadow-xl text-white font-bold text-2xl transition-all transform hover:scale-105"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isCompleted && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-amber-500 dark:to-yellow-500 rounded-2xl p-6 text-white text-center shadow-lg">
          <div className="text-3xl mb-2">🎉</div>
          <h3 className="text-xl font-bold mb-2 font-arabic">أحسنت!</h3>
          <p className="font-arabic">لقد أكملت التسبيح بتوفيق الله</p>
        </div>
      )}
    </div>
  );
};

export default TasbihCounter;
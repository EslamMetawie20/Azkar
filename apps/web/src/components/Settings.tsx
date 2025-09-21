import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [progressData, setProgressData] = useState<any[]>([]);

  useEffect(() => {
    // Load settings from localStorage
    const savedFontSize = localStorage.getItem('azkar-font-size');

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }

    // Load progress data
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const progress = await storage.getAllProgress();
      setProgressData(progress);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('azkar-font-size', newSize.toString());
    document.documentElement.style.setProperty('--arabic-font-size', `${newSize}px`);
  };


  const clearAllProgress = async () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await storage.clearProgress();
        setProgressData([]);
        alert('تم حذف جميع البيانات بنجاح');
      } catch (error) {
        console.error('Failed to clear progress:', error);
        alert('حدث خطأ أثناء حذف البيانات');
      }
    }
  };

  const exportProgress = () => {
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'azkar-progress.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Font size settings */}
      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 font-arabic">حجم الخط</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-slate-300 font-arabic">حجم النص</span>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => handleFontSizeChange(Math.max(fontSize - 2, 12))}
                className="w-8 h-8 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-full flex items-center justify-center text-gray-700 dark:text-slate-300"
              >
                -
              </button>
              <span className="w-12 text-center text-gray-800 dark:text-amber-400 font-bold">{fontSize}</span>
              <button
                onClick={() => handleFontSizeChange(Math.min(fontSize + 2, 24))}
                className="w-8 h-8 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-full flex items-center justify-center text-gray-700 dark:text-slate-300"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-center">
            <p
              className="arabic-text font-arabic border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 rounded-lg p-4 text-gray-800 dark:text-slate-200"
              style={{ fontSize: `${fontSize}px` }}
            >
              نموذج للنص العربي بالحجم المحدد
            </p>
          </div>
        </div>
      </div>

      {/* Night mode */}
      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 font-arabic">الوضع الليلي</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 dark:text-slate-300 font-arabic">الوضع الليلي المظلم</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-arabic">يوفر تجربة مريحة للعين في الإضاءة المنخفضة</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDark ? 'bg-amber-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                isDark ? 'translate-x-6 bg-yellow-400' : 'translate-x-1 bg-white'
              }`}
            />
          </button>
        </div>
      </div>


      {/* App info */}
      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 font-arabic">معلومات التطبيق</h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span className="font-arabic">الإصدار</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="font-arabic">المصدر</span>
            <span className="font-arabic">حصن المسلم</span>
          </div>
          <div className="flex justify-between">
            <span className="font-arabic">نوع التطبيق</span>
            <span className="font-arabic">ويب + PWA</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-emerald-50 dark:bg-amber-900/30 border dark:border-amber-800/50 rounded-lg">
          <p className="text-sm text-emerald-800 dark:text-amber-300 font-arabic text-center">
            "وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
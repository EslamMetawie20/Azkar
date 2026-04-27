import React, { useEffect, useState } from 'react';
import { getStats } from '../utils/stats';
import { vibrate } from '../utils/browser';

interface StatsCardProps {
  hideLabel?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ hideLabel = false }) => {
  const [stats, setStats] = useState(getStats());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStats(getStats());
    }
  }, [isOpen]);

  const toggleModal = () => {
    vibrate(20);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Professional Toggle Button */}
      <button
        onClick={toggleModal}
        className={`flex items-center space-x-2 space-x-reverse bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all active:scale-95 ${hideLabel ? 'p-3' : 'px-4 py-2'}`}
        title="إحصائيات الأذكار"
      >
        <svg className="w-6 h-6 text-emerald-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {!hideLabel && (
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 font-arabic">
            إحصائيات الأذكار
          </span>
        )}
      </button>

      {/* Pop-up Modal - Perfectly Centered */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white dark:border-slate-800 animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Elegant Header with SVG Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 dark:bg-amber-900/20 rounded-3xl mb-4 text-emerald-600 dark:text-amber-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-arabic tracking-tight">
                إحصائياتك الإيمانية
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-emerald-600 dark:text-amber-400 tabular-nums">
                    {stats.daily.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 font-arabic">أذكار اليوم</span>
                </div>
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-emerald-600 dark:text-amber-400 tabular-nums">
                    {stats.weekly.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 font-arabic">هذا الأسبوع</span>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-amber-500 dark:to-orange-600 rounded-[2rem] text-white shadow-xl shadow-emerald-600/20 dark:shadow-amber-500/10">
                <div className="flex flex-col">
                  <span className="text-3xl font-black tabular-nums">
                    {stats.total.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-xs font-bold opacity-80 font-arabic">إجمالي الأذكار</span>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <p className="text-center text-sm text-slate-400 dark:text-slate-500 font-arabic italic px-4">
                "أحب الأعمال إلى الله أدومها وإن قل"
              </p>
              
              <button
                onClick={toggleModal}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-2xl font-bold font-arabic hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
              >
                إغلاق
              </button>
            </div>
          </div>
          
          {/* Backdrop Overlay to close */}
          <div className="absolute inset-0 -z-10" onClick={toggleModal}></div>
        </div>
      )}
    </>
  );
};

export default StatsCard;

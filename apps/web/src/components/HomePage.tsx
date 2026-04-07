import React from 'react';
import type { CategorySlug } from '@azkar/shared';
import bismillahImg from '../assets/bismilah3.png';

interface HomePageProps {
  onCategorySelect: (category: CategorySlug) => void;
  onQuranSelect?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCategorySelect, onQuranSelect }) => {
  const categories = [
    {
      slug: 'morning' as CategorySlug,
      title: 'أذكار الصباح',
      description: 'نور لقلبك في بداية يومك',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bg: 'bg-spiritual-dark text-white'
    },
    {
      slug: 'evening' as CategorySlug,
      title: 'أذكار المساء',
      description: 'طمأنينة وراحة لليلك',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      bg: 'bg-white dark:bg-slate-800 border-2 border-spiritual-dark/20'
    }
  ];

  return (
    <div className="space-y-10 py-4">
      {/* Spiritual Header with Bismillah */}
      <div className="text-center space-y-6">
        <div className="flex justify-center animate-fade-in">
          <img
            src={bismillahImg}
            alt="بسم الله الرحمن الرحيم"
            className="object-contain dark:brightness-0 dark:invert opacity-90 transition-all hover:opacity-100"
            style={{ width: 'auto', maxWidth: '400px', height: 'auto', maxHeight: '12rem' }}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-spiritual-dark dark:text-spiritual-accent font-arabic tracking-wide">
            طريق النور
          </h2>
          <p className="text-spiritual-medium dark:text-slate-400 font-arabic italic">
            "ألا بذكر الله تطمئن القلوب"
          </p>
        </div>
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto px-2">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onCategorySelect(category.slug)}
            className={`group relative overflow-hidden p-8 rounded-[2rem] shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${category.bg}`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-6 space-x-reverse">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${category.slug === 'morning' ? 'bg-white/20' : 'bg-spiritual-dark/10 text-spiritual-dark'}`}>
                  {category.icon}
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold font-arabic mb-1">
                    {category.title}
                  </h3>
                  <p className={`text-sm font-arabic ${category.slug === 'morning' ? 'text-spiritual-paper/80' : 'text-slate-500'}`}>
                    {category.description}
                  </p>
                </div>
              </div>
              <div className={`p-3 rounded-full transition-colors ${category.slug === 'morning' ? 'bg-white/10 group-hover:bg-white/20' : 'bg-spiritual-dark/5 group-hover:bg-spiritual-dark/10 text-spiritual-dark'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>
          </button>
        ))}

        {/* Quran Section */}
        <button
          onClick={onQuranSelect}
          className="group flex items-center justify-between p-6 bg-white dark:bg-spiritual-dark/10 border-2 border-spiritual-dark/20 rounded-[2rem] hover:border-spiritual-dark transition-all duration-300 shadow-md"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">📖</span>
            <div className="text-right">
              <h3 className="text-xl font-bold text-spiritual-dark dark:text-spiritual-accent font-arabic">القرآن الكريم</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-arabic">تلاوة وتدبر لآيات الله</p>
            </div>
          </div>
          <div className="text-spiritual-dark">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>
      </div>

      {/* Quote Footer */}
      <div className="max-w-md mx-auto text-center pt-8 border-t border-spiritual-dark/10">
        <p className="text-spiritual-dark/60 dark:text-spiritual-accent/60 font-arabic text-sm">
          "فاذكروني أذكركم"
        </p>
      </div>
    </div>
  );
};

export default HomePage;
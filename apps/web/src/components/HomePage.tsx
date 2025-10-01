import React from 'react';
import type { CategorySlug } from '@azkar/shared';

interface HomePageProps {
  onCategorySelect: (category: CategorySlug) => void;
  onQuranSelect?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCategorySelect, onQuranSelect }) => {
  const categories = [
    {
      slug: 'morning' as CategorySlug,
      title: 'أذكار الصباح',
      description: 'أذكار وأدعية الصباح المستجابة',
      icon: '🌅',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      slug: 'evening' as CategorySlug,
      title: 'أذكار المساء',
      description: 'أذكار وأدعية المساء المباركة',
      icon: '🌙',
      gradient: 'from-indigo-400 to-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mx-auto mb-4">
  <img
  src="/bismilah3.png"
  alt="بسم الله الرحمن الرحيم"
            className="object-contain dark:brightness-0 dark:invert"
            style={{ width: '30rem', height: '20rem' }}
/>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 font-arabic">
          أهلاً وسهلاً
        </h2>
        <p className="text-gray-600 dark:text-slate-300 leading-relaxed font-arabic">
          اختر نوع الأذكار التي تريد قراءتها
        </p>
      </div>

      {/* Category cards */}
      <div className="space-y-4">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onCategorySelect(category.slug)}
            className="w-full p-6 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-amber-400"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                {category.icon}
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-1 font-arabic">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm font-arabic">
                  {category.description}
                </p>
              </div>
              <div className="text-emerald-500 dark:text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}

        {/* Quran button */}
        <button
          onClick={onQuranSelect}
          className="w-full p-6 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-amber-400"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              📖
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-1 font-arabic">
                القرآن الكريم
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm font-arabic">
                جميع سور القرآن الكريم
              </p>
            </div>
            <div className="text-emerald-500 dark:text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Features section */}
      <div className="mt-12 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 text-center font-arabic">
          مميزات التطبيق
        </h3>
        <div className="space-y-3">
          {[
            { icon: '📱', text: 'يعمل بدون اتصال بالإنترنت' },
            { icon: '🕒', text: 'عداد تلقائي لكل ذكر' },
            { icon: '🎯', text: 'تتبع التقدم اليومي' },
            { icon: '📖', text: 'نصوص أصيلة من حصن المسلم' }
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 space-x-reverse">
              <span className="text-lg">{feature.icon}</span>
              <span className="text-gray-700 dark:text-slate-300 font-arabic">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
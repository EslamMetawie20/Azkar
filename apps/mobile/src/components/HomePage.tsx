import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { CategorySlug } from '@azkar/shared';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface HomePageProps {
  onCategorySelect: (category: CategorySlug) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCategorySelect }) => {
  const { theme, colors } = useTheme();

  const categories = [
    {
      slug: 'morning' as CategorySlug,
      title: 'أذكار الصباح',
      description: 'أذكار وأدعية الصباح المستجابة',
      emoji: '🌅',
      gradientColors: theme === 'light'
        ? ['#fbbf24', '#f97316'] // amber-400 to orange-500
        : ['#fbbf24', '#f97316']
    },
    {
      slug: 'evening' as CategorySlug,
      title: 'أذكار المساء',
      description: 'أذكار وأدعية المساء المباركة',
      emoji: '🌙',
      gradientColors: theme === 'light'
        ? ['#818cf8', '#a855f7'] // indigo-400 to purple-500
        : ['#818cf8', '#a855f7']
    }
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Welcome section with Bismillah */}
      <View style={styles.welcomeSection}>
        <Image
          source={require('../../assets/bismilah3.png')}
          style={[
            styles.bismillahImage,
            theme === 'dark' && styles.bismillahImageDark
          ]}
          resizeMode="contain"
        />
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>أهلاً وسهلاً</Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
          اختر نوع الأذكار التي تريد قراءتها
        </Text>
      </View>

      {/* Category cards */}
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.slug}
            style={[styles.categoryCard, { backgroundColor: colors.surface }]}
            onPress={() => onCategorySelect(category.slug)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              {Platform.OS === 'web' ? (
                <View
                  style={[
                    styles.categoryIcon,
                    {
                      background: `linear-gradient(135deg, ${category.gradientColors[0]}, ${category.gradientColors[1]})`
                    }
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </View>
              ) : (
                <LinearGradient
                  colors={category.gradientColors}
                  style={styles.categoryIcon}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </LinearGradient>
              )}
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>{category.description}</Text>
              </View>
              <Text style={[styles.arrow, { color: colors.primary }]}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Features section */}
      <View style={[styles.featuresSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.featuresTitle, { color: colors.text }]}>مميزات التطبيق</Text>
        <View style={styles.featuresList}>
          {[
            { icon: '📱', text: 'يعمل بدون اتصال بالإنترنت' },
            { icon: '🕒', text: 'عداد تلقائي لكل ذكر' },
            { icon: '🎯', text: 'تتبع التقدم اليومي' },
            { icon: '📖', text: 'نصوص أصيلة من حصن المسلم' }
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  bismillahImage: {
    width: 250,
    height: 120,
    marginBottom: 16,
  },
  bismillahImageDark: {
    tintColor: '#ffffff',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#059669',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainIcon: {
    fontSize: 36,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  arrow: {
    fontSize: 20,
    color: '#059669',
    marginRight: 8,
  },
  featuresSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 18,
    marginLeft: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    textAlign: 'right',
  },
});

export default HomePage;
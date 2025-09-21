import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CategorySlug } from '@azkar/shared';

interface HomePageProps {
  onCategorySelect: (category: CategorySlug) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCategorySelect }) => {
  const categories = [
    {
      slug: 'morning' as CategorySlug,
      title: 'أذكار الصباح',
      description: 'أذكار وأدعية الصباح المستجابة',
      emoji: '🌅',
      color: '#f59e0b'
    },
    {
      slug: 'evening' as CategorySlug,
      title: 'أذكار المساء',
      description: 'أذكار وأدعية المساء المباركة',
      emoji: '🌙',
      color: '#7c3aed'
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome section */}
      <View style={styles.welcomeSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.mainIcon}>🤲</Text>
        </View>
        <Text style={styles.welcomeTitle}>أهلاً وسهلاً</Text>
        <Text style={styles.welcomeSubtitle}>
          اختر نوع الأذكار التي تريد قراءتها
        </Text>
      </View>

      {/* Category cards */}
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.slug}
            style={styles.categoryCard}
            onPress={() => onCategorySelect(category.slug)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Features section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>مميزات التطبيق</Text>
        <View style={styles.featuresList}>
          {[
            { icon: '📱', text: 'يعمل بدون اتصال بالإنترنت' },
            { icon: '🕒', text: 'عداد تلقائي لكل ذكر' },
            { icon: '🎯', text: 'تتبع التقدم اليومي' },
            { icon: '📖', text: 'نصوص أصيلة من حصن المسلم' }
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
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
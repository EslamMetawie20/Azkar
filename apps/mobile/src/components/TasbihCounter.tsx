import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import type { TasbihOption } from '@azkar/shared';
import { mobileApiService } from '../services/api';

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
        const options = await mobileApiService.getTasbihOptions();
        setTasbihOptions(options);
      } catch (error) {
        console.error('Failed to load tasbih options:', error);
        Alert.alert('خطأ', 'فشل في تحميل بيانات التسبيح');
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
        Alert.alert('أحسنت!', 'لقد أكملت التسبيح بتوفيق الله 🎉');
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
    const totalCounts = selectedOption.items.reduce((sum, item) => sum + item.count, 0);

    return Math.round((completedCounts / totalCounts) * 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>جاري تحميل التسبيح...</Text>
      </View>
    );
  }

  if (!selectedOption) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>التسبيح</Text>
          <Text style={styles.subtitle}>اختر نوع التسبيح المناسب لك</Text>
        </View>

        <View style={styles.optionsContainer}>
          {tasbihOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionTitle}>{option.nameAr}</Text>
              <Text style={styles.optionDescription}>
                {option.items.map((item, index) => (
                  `${item.textAr} (${item.count})${index < option.items.length - 1 ? ' • ' : ''}`
                )).join('')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>فضل التسبيح</Text>
          <Text style={styles.infoText}>
            قال رسول الله ﷺ: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم"
          </Text>
          <Text style={styles.infoText}>
            وقال ﷺ: "أحب الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر"
          </Text>
          <Text style={styles.infoText}>
            يُستحب أيضاً قراءة قل هو الله أحد والمعوذتين بعد كل صلاة، وتُكرر ثلاث مرات بعد المغرب والفجر وعند النوم.
          </Text>
        </View>
      </ScrollView>
    );
  }

  const currentItem = selectedOption.items[currentItemIndex];
  const progress = getTotalProgress();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedOption(null)}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedOption.nameAr}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressPercentage}>{progress}%</Text>
            <Text style={styles.progressLabel}>مكتمل</Text>
          </View>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>إعادة تعيين</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Current Item */}
      {!isCompleted && (
        <View style={styles.currentItemCard}>
          <Text style={styles.currentItemText}>{currentItem.textAr}</Text>
          <Text style={styles.currentItemCount}>
            {currentCount} / {currentItem.count}
          </Text>

          <TouchableOpacity
            style={styles.incrementButton}
            onPress={handleIncrement}
          >
            <Text style={styles.incrementButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Completion Message */}
      {isCompleted && (
        <View style={styles.completionCard}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={styles.completionTitle}>أحسنت!</Text>
          <Text style={styles.completionText}>لقد أكملت التسبيح بتوفيق الله</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#059669',
    textAlign: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'right',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 20,
    color: '#059669',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 12,
    color: '#4b5563',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  currentItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentItemText: {
    fontSize: 20,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
  },
  currentItemCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  incrementButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  incrementButtonText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  completionCard: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  completionText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});

export default TasbihCounter;
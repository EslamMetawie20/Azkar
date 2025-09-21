import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { Zikr, CategorySlug } from '@azkar/shared';
import { mobileApiService } from '../services/api';
import { mobileStorage } from '../utils/storage';

interface AzkarListProps {
  category: CategorySlug;
}

interface ZikrProgress {
  currentCount: number;
  targetCount: number;
}

const AzkarList: React.FC<AzkarListProps> = ({ category }) => {
  const [azkar, setAzkar] = useState<Zikr[]>([]);
  const [progress, setProgress] = useState<Record<number, ZikrProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAzkar();
  }, [category]);

  const loadAzkar = async () => {
    setLoading(true);
    try {
      const azkarData = await mobileApiService.getAzkarByCategory(category);
      setAzkar(azkarData);

      // Load progress for each zikr
      const progressData: Record<number, ZikrProgress> = {};
      for (const zikr of azkarData) {
        const savedProgress = await mobileStorage.getProgress(zikr.id);
        progressData[zikr.id] = {
          currentCount: savedProgress?.currentCount || 0,
          targetCount: zikr.repeatMin
        };
      }
      setProgress(progressData);
    } catch (error) {
      console.error('Failed to load azkar:', error);
      Alert.alert('خطأ', 'فشل في تحميل الأذكار');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async (zikrId: number) => {
    const currentProgress = progress[zikrId];
    if (!currentProgress) return;

    const newCount = Math.min(currentProgress.currentCount + 1, currentProgress.targetCount);
    const newProgress = { ...currentProgress, currentCount: newCount };

    setProgress(prev => ({ ...prev, [zikrId]: newProgress }));
    await mobileStorage.saveProgress(zikrId, newCount, currentProgress.targetCount);
  };

  const handleReset = async (zikrId: number) => {
    const currentProgress = progress[zikrId];
    if (!currentProgress) return;

    const newProgress = { ...currentProgress, currentCount: 0 };
    setProgress(prev => ({ ...prev, [zikrId]: newProgress }));
    await mobileStorage.saveProgress(zikrId, 0, currentProgress.targetCount);
  };

  const resetAllProgress = async () => {
    Alert.alert(
      'إعادة تعيين',
      'هل تريد إعادة تعيين جميع العدادات؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نعم',
          onPress: async () => {
            const newProgress: Record<number, ZikrProgress> = {};
            for (const zikr of azkar) {
              newProgress[zikr.id] = {
                currentCount: 0,
                targetCount: zikr.repeatMin
              };
              await mobileStorage.saveProgress(zikr.id, 0, zikr.repeatMin);
            }
            setProgress(newProgress);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  const totalCompleted = Object.values(progress).filter(p => p.currentCount >= p.targetCount).length;
  const totalAzkar = azkar.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress summary */}
      <View style={styles.progressSummary}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryStats}>
            <Text style={styles.progressCount}>{totalCompleted} / {totalAzkar}</Text>
            <Text style={styles.progressLabel}>مكتملة</Text>
          </View>
          <TouchableOpacity onPress={resetAllProgress} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>إعادة تعيين الكل</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${totalAzkar > 0 ? (totalCompleted / totalAzkar) * 100 : 0}%` }
            ]}
          />
        </View>
      </View>

      {/* Azkar list */}
      {azkar.map((zikr, index) => {
        const zikrProgress = progress[zikr.id];
        const isCompleted = zikrProgress?.currentCount >= zikrProgress?.targetCount;

        return (
          <View
            key={zikr.id}
            style={[styles.zikrCard, isCompleted && styles.zikrCardCompleted]}
          >
            {/* Zikr number and completion indicator */}
            <View style={styles.zikrHeader}>
              <View style={styles.zikrNumber}>
                <Text style={styles.zikrNumberText}>{index + 1}</Text>
              </View>
              {isCompleted && <Text style={styles.completedIcon}>✓</Text>}
            </View>

            {/* Zikr text */}
            <View style={styles.zikrContent}>
              <Text style={styles.zikrText}>{zikr.textAr}</Text>
              {zikr.footnoteAr && (
                <View style={styles.footnoteContainer}>
                  <Text style={styles.footnoteText}>{zikr.footnoteAr}</Text>
                </View>
              )}
            </View>

            {/* Counter controls */}
            <View style={styles.counterContainer}>
              <View style={styles.counterButtons}>
                <TouchableOpacity
                  onPress={() => handleIncrement(zikr.id)}
                  disabled={isCompleted}
                  style={[styles.incrementButton, isCompleted && styles.incrementButtonDisabled]}
                >
                  <Text style={[styles.incrementButtonText, isCompleted && styles.incrementButtonTextDisabled]}>
                    {isCompleted ? '✓' : '+'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReset(zikr.id)} style={styles.resetZikrButton}>
                  <Text style={styles.resetZikrButtonText}>إعادة</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.counterStats}>
                <Text style={styles.counterText}>
                  {zikrProgress?.currentCount || 0} / {zikrProgress?.targetCount || zikr.repeatMin}
                </Text>
                <Text style={styles.counterLabel}>
                  {zikr.repeatMin === 1 ? 'مرة واحدة' : `${zikr.repeatMin} مرات`}
                </Text>
              </View>
            </View>

            {/* Progress indicator */}
            <View style={styles.zikrProgressContainer}>
              <View
                style={[
                  styles.zikrProgressBar,
                  {
                    width: `${zikrProgress ? (zikrProgress.currentCount / zikrProgress.targetCount) * 100 : 0}%`
                  }
                ]}
              />
            </View>
          </View>
        );
      })}

      {/* Completion celebration */}
      {totalCompleted === totalAzkar && totalAzkar > 0 && (
        <View style={styles.celebrationCard}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>أحسنت!</Text>
          <Text style={styles.celebrationText}>لقد أكملت جميع الأذكار بتوفيق الله</Text>
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
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressSummary: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryStats: {
    alignItems: 'flex-end',
  },
  progressCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 12,
    color: '#374151',
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
  zikrCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  zikrCardCompleted: {
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#059669',
  },
  zikrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  zikrNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zikrNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  completedIcon: {
    fontSize: 20,
    color: '#059669',
  },
  zikrContent: {
    marginBottom: 20,
  },
  zikrText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 12,
  },
  footnoteContainer: {
    borderRightWidth: 2,
    borderRightColor: '#d1fae5',
    paddingRight: 12,
  },
  footnoteText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    lineHeight: 18,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  incrementButton: {
    width: 48,
    height: 48,
    backgroundColor: '#059669',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  incrementButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  incrementButtonTextDisabled: {
    color: '#f3f4f6',
  },
  resetZikrButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  resetZikrButtonText: {
    fontSize: 12,
    color: '#6b7280',
  },
  counterStats: {
    alignItems: 'flex-end',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  counterLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  zikrProgressContainer: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  zikrProgressBar: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 2,
  },
  celebrationCard: {
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  celebrationEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  celebrationText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});

export default AzkarList;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import type { SurahWithAyahs } from '@azkar/shared';
import { quranApi } from '@azkar/shared';
import { useTheme } from '../contexts/ThemeContext';
import { useFont } from '../contexts/FontContext';

interface SurahViewerProps {
  surahNumber: number;
}

const SurahViewer: React.FC<SurahViewerProps> = ({ surahNumber }) => {
  const { colors } = useTheme();
  const { fontSize } = useFont();
  const [surah, setSurah] = useState<SurahWithAyahs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurah();
  }, [surahNumber]);

  const loadSurah = async () => {
    try {
      setLoading(true);
      const data = await quranApi.getSurah(surahNumber);
      setSurah(data);
    } catch (error) {
      console.error(`Failed to load surah ${surahNumber}:`, error);
      Alert.alert('خطأ', 'فشل في تحميل السورة');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          جاري تحميل السورة...
        </Text>
      </View>
    );
  }

  if (!surah) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          لم يتم العثور على السورة
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Surah Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.surahName, { color: colors.text, fontSize: fontSize + 8 }]}>
          {surah.name}
        </Text>
        <Text style={[styles.surahEnglishName, { color: colors.textSecondary, fontSize: fontSize }]}>
          {surah.englishName} - {surah.englishNameTranslation}
        </Text>
        <View style={styles.surahMeta}>
          <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fontSize - 2 }]}>
            السورة رقم {surah.number}
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fontSize - 2 }]}>
            {surah.numberOfAyahs} آية
          </Text>
          <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fontSize - 2 }]}>
            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </Text>
        </View>
      </View>

      {/* Bismillah for all surahs except At-Tawbah (9) */}
      {surah.number !== 9 && surah.number !== 1 && (
        <View style={styles.bismillahContainer}>
          <Text style={[styles.bismillah, { color: colors.text, fontSize: fontSize + 4 }]}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
        </View>
      )}

      {/* Ayahs */}
      <View style={styles.ayahsContainer}>
        {surah.ayahs.map((ayah) => (
          <View key={ayah.number} style={[styles.ayahCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.ayahText, { color: colors.text, fontSize: fontSize + 2 }]}>
              {ayah.text}
              <Text style={[styles.ayahNumber, { color: colors.primary }]}>
                {' '}﴿{ayah.numberInSurah}﴾
              </Text>
            </Text>
            {ayah.sajda && typeof ayah.sajda === 'object' && (
              <View style={[styles.sajdaIndicator, { backgroundColor: colors.warning }]}>
                <Text style={styles.sajdaText}>
                  {ayah.sajda.obligatory ? 'سجدة واجبة' : 'سجدة مستحبة'}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  header: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surahName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  surahEnglishName: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  surahMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 12,
  },
  bismillahContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bismillah: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ayahsContainer: {
    gap: 12,
  },
  ayahCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  ayahText: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'right',
  },
  ayahNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sajdaIndicator: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  sajdaText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SurahViewer;
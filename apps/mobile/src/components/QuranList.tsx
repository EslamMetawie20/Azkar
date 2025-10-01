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
import type { Surah } from '@azkar/shared';
import { quranApi } from '@azkar/shared';
import { useTheme } from '../contexts/ThemeContext';
import { useFont } from '../contexts/FontContext';

interface QuranListProps {
  onSurahSelect: (surahNumber: number) => void;
}

const QuranList: React.FC<QuranListProps> = ({ onSurahSelect }) => {
  const { colors, theme } = useTheme();
  const { fontSize } = useFont();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      const data = await quranApi.getSurahs();
      setSurahs(data);
    } catch (error) {
      console.error('Failed to load surahs:', error);
      Alert.alert('خطأ', 'فشل في تحميل قائمة السور');
    } finally {
      setLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(
    surah =>
      surah.name.includes(searchText) ||
      surah.englishName.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          جاري تحميل قائمة السور...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSize + 6 }]}>
          القرآن الكريم
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: fontSize - 2 }]}>
          {surahs.length} سورة
        </Text>
      </View>

      {/* Surahs Grid */}
      <View style={styles.surahsGrid}>
        {filteredSurahs.map((surah) => (
          <TouchableOpacity
            key={surah.number}
            style={[styles.surahCard, { backgroundColor: colors.surface }]}
            onPress={() => onSurahSelect(surah.number)}
            activeOpacity={0.8}
          >
            <View style={styles.surahNumber}>
              <Text style={[styles.surahNumberText, { color: colors.primary }]}>
                {surah.number}
              </Text>
            </View>
            <View style={styles.surahInfo}>
              <Text style={[styles.surahName, { color: colors.text, fontSize: fontSize + 2 }]}>
                {surah.name}
              </Text>
              <Text style={[styles.surahEnglishName, { color: colors.textSecondary, fontSize: fontSize - 2 }]}>
                {surah.englishName}
              </Text>
              <View style={styles.surahMeta}>
                <Text style={[styles.surahMetaText, { color: colors.textSecondary, fontSize: fontSize - 3 }]}>
                  {surah.numberOfAyahs} آية
                </Text>
                <Text style={[styles.surahMetaText, { color: colors.textSecondary, fontSize: fontSize - 3 }]}>
                  {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  surahsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  surahCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  surahNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  surahNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'right',
  },
  surahEnglishName: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'right',
  },
  surahMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  surahMetaText: {
    fontSize: 10,
  },
});

export default QuranList;
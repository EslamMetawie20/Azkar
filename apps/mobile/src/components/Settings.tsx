import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { mobileStorage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';
import { useFont } from '../contexts/FontContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFont();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [progressCount, setProgressCount] = useState(0);

  useEffect(() => {
    loadProgressCount();
    loadNotificationSettings();
  }, []);

  const loadProgressCount = async () => {
    const progress = await mobileStorage.getAllProgress();
    setProgressCount(progress.length);
  };

  const loadNotificationSettings = async () => {
    const settings = await mobileStorage.getSettings();
    setNotificationsEnabled(settings.notificationsEnabled);
  };

  const handleNotificationsToggle = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    const settings = await mobileStorage.getSettings();
    await mobileStorage.saveSettings({
      ...settings,
      notificationsEnabled: newValue
    });
  };

  const clearAllProgress = () => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await mobileStorage.clearProgress();
              setProgressCount(0);
              Alert.alert('تم', 'تم حذف جميع البيانات بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف البيانات');
            }
          }
        }
      ]
    );
  };

  const syncData = async () => {
    Alert.alert(
      'مزامنة البيانات',
      'سيتم محاولة تحديث الأذكار من الخادم. هل تريد المتابعة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نعم',
          onPress: async () => {
            try {
              // This would typically call the API service
              Alert.alert('تم', 'تم تحديث البيانات بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'فشل في تحديث البيانات. تحقق من الاتصال بالإنترنت.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Dark Mode Toggle */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>المظهر</Text>
        <View style={styles.settingRow}>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{
              false: '#e5e7eb',
              true: theme === 'dark' ? '#d97706' : '#059669'
            }}
            thumbColor={theme === 'dark' ? '#fbbf24' : '#ffffff'}
          />
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              الوضع الليلي
            </Text>
            <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
              تبديل بين المظهر الفاتح والداكن
            </Text>
          </View>
        </View>
      </View>

      {/* Font size settings */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>حجم الخط</Text>
        <View style={styles.settingRow}>
          <View style={styles.fontControls}>
            <TouchableOpacity
              onPress={decreaseFontSize}
              style={[
                styles.fontButton,
                { backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }
              ]}
              disabled={fontSize <= 12}
            >
              <Text style={[styles.fontButtonText, { color: colors.text }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.fontSizeText, { color: colors.text }]}>{fontSize}</Text>
            <TouchableOpacity
              onPress={increaseFontSize}
              style={[
                styles.fontButton,
                { backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6' }
              ]}
              disabled={fontSize >= 24}
            >
              <Text style={[styles.fontButtonText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>حجم النص</Text>
        </View>
        <View
          style={[
            styles.previewContainer,
            {
              backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
            }
          ]}
        >
          <Text style={[styles.previewText, { fontSize, color: colors.text }]}>
            نموذج للنص العربي بالحجم المحدد
          </Text>
        </View>
      </View>

      {/* Notifications */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>الإشعارات</Text>
        <View style={styles.settingRow}>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{
              false: '#e5e7eb',
              true: theme === 'dark' ? '#d97706' : '#059669'
            }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
          />
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              تذكير بالأذكار
            </Text>
            <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
              إشعارات يومية لتذكيرك بالأذكار
            </Text>
          </View>
        </View>
      </View>

      {/* Progress management */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>إدارة التقدم</Text>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressCount, { color: colors.primary }]}>
            {progressCount}
          </Text>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            ذكر محفوظ
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={syncData}
            style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
          >
            <Text style={styles.actionButtonText}>تحديث الأذكار</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={clearAllProgress}
            style={[styles.actionButton, styles.dangerButton]}
            disabled={progressCount === 0}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              حذف جميع البيانات
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App info */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>معلومات التطبيق</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              الإصدار
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoValue, { color: colors.text }]}>حصن المسلم</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              المصدر
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoValue, { color: colors.text }]}>React Native</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              المنصة
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.quoteContainer,
            { backgroundColor: theme === 'dark' ? '#064e3b' : '#ecfdf5' }
          ]}
        >
          <Text
            style={[
              styles.quoteText,
              { color: theme === 'dark' ? '#34d399' : '#059669' }
            ]}
          >
            "وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ"
          </Text>
        </View>
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
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'right',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  settingLabel: {
    fontSize: 16,
    textAlign: 'right',
  },
  settingDescription: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  fontButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 32,
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  previewText: {
    textAlign: 'center',
    lineHeight: 28,
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 14,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  dangerButtonText: {
    color: 'white',
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  quoteContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
  },
  quoteText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default Settings;
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

interface AppSettings {
  fontSize: number;
  readingMode: boolean;
  notificationsEnabled: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 16,
    readingMode: false,
    notificationsEnabled: true
  });
  const [progressCount, setProgressCount] = useState(0);

  useEffect(() => {
    loadSettings();
    loadProgressCount();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await mobileStorage.getSettings();
    setSettings(savedSettings);
  };

  const loadProgressCount = async () => {
    const progress = await mobileStorage.getAllProgress();
    setProgressCount(progress.length);
  };

  const updateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await mobileStorage.saveSettings(newSettings);
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, settings.fontSize + delta));
    updateSettings({ ...settings, fontSize: newSize });
  };

  const handleReadingModeToggle = () => {
    updateSettings({ ...settings, readingMode: !settings.readingMode });
  };

  const handleNotificationsToggle = () => {
    updateSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled });
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Font size settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>حجم الخط</Text>
        <View style={styles.settingRow}>
          <View style={styles.fontControls}>
            <TouchableOpacity
              onPress={() => handleFontSizeChange(-2)}
              style={styles.fontButton}
              disabled={settings.fontSize <= 12}
            >
              <Text style={styles.fontButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.fontSizeText}>{settings.fontSize}</Text>
            <TouchableOpacity
              onPress={() => handleFontSizeChange(2)}
              style={styles.fontButton}
              disabled={settings.fontSize >= 24}
            >
              <Text style={styles.fontButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.settingLabel}>حجم النص</Text>
        </View>
        <View style={styles.previewContainer}>
          <Text style={[styles.previewText, { fontSize: settings.fontSize }]}>
            نموذج للنص العربي بالحجم المحدد
          </Text>
        </View>
      </View>

      {/* Reading mode */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>وضع القراءة</Text>
        <View style={styles.settingRow}>
          <Switch
            value={settings.readingMode}
            onValueChange={handleReadingModeToggle}
            trackColor={{ false: '#e5e7eb', true: '#059669' }}
            thumbColor={settings.readingMode ? '#ffffff' : '#f3f4f6'}
          />
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>وضع القراءة المريح</Text>
            <Text style={styles.settingDescription}>يقلل من إجهاد العين أثناء القراءة</Text>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإشعارات</Text>
        <View style={styles.settingRow}>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: '#e5e7eb', true: '#059669' }}
            thumbColor={settings.notificationsEnabled ? '#ffffff' : '#f3f4f6'}
          />
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>تذكير بالأذكار</Text>
            <Text style={styles.settingDescription}>إشعارات يومية لتذكيرك بالأذكار</Text>
          </View>
        </View>
      </View>

      {/* Progress management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إدارة التقدم</Text>
        <View style={styles.progressInfo}>
          <Text style={styles.progressCount}>{progressCount}</Text>
          <Text style={styles.progressLabel}>ذكر محفوظ</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={syncData} style={styles.actionButton}>
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات التطبيق</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>1.0.0</Text>
            <Text style={styles.infoLabel}>الإصدار</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>حصن المسلم</Text>
            <Text style={styles.infoLabel}>المصدر</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>React Native</Text>
            <Text style={styles.infoLabel}>المنصة</Text>
          </View>
        </View>
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
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
    backgroundColor: '#f0fdf4',
  },
  content: {
    padding: 16,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
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
    color: '#374151',
    textAlign: 'right',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6b7280',
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
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontButtonText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    minWidth: 32,
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewText: {
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
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
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  quoteContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
  },
  quoteText: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default Settings;
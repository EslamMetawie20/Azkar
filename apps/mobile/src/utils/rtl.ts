import { I18nManager } from 'react-native';

export const setupRTL = () => {
  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
    // Note: In a real app, you might want to restart the app here
    // For demo purposes, we'll just log a warning
    console.warn('RTL has been enabled. You may need to reload the app to see changes.');
  }
};

export const isRTL = () => I18nManager.isRTL;
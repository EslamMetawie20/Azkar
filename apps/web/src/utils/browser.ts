/**
 * Triggers haptic feedback (vibration) if supported by the browser/device.
 * @param pattern Duration or pattern of vibration in milliseconds.
 */
export const vibrate = (pattern: number | number[] = 30) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors
    }
  }
};

/**
 * Shares text using the Web Share API or falls back to clipboard.
 * @param title Title of the share content.
 * @param text Text to share.
 * @returns Promise that resolves when shared or copied.
 */
export const shareContent = async (title: string, text: string): Promise<'shared' | 'copied'> => {
  const shareData = {
    title,
    text,
    url: window.location.origin
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return 'shared';
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw err; // User cancelled
      }
      // Fallback to clipboard if share fails for other reasons
    }
  }

  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n\n${window.location.origin}`);
    return 'copied';
  } catch (err) {
    console.error('Failed to copy text: ', err);
    throw new Error('Clipboard failed');
  }
};

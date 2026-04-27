interface Stats {
  daily: number;
  weekly: number;
  total: number;
  lastUpdated: string; // ISO Date
}

const STATS_KEY = 'azkar-stats-v1';

const getInitialStats = (): Stats => ({
  daily: 0,
  weekly: 0,
  total: 0,
  lastUpdated: new Date().toISOString(),
});

export const getStats = (): Stats => {
  const saved = localStorage.getItem(STATS_KEY);
  if (!saved) return getInitialStats();

  try {
    const stats: Stats = JSON.parse(saved);
    const lastDate = new Date(stats.lastUpdated);
    const now = new Date();

    // Check if it's a new day
    if (lastDate.toDateString() !== now.toDateString()) {
      stats.daily = 0;
      
      // Check if it's a new week (Sunday as start)
      const dayDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff >= 7 || now.getDay() < lastDate.getDay()) {
        stats.weekly = 0;
      }
    }
    
    return stats;
  } catch (e) {
    return getInitialStats();
  }
};

export const incrementStats = (count: number = 1) => {
  const stats = getStats();
  stats.daily += count;
  stats.weekly += count;
  stats.total += count;
  stats.lastUpdated = new Date().toISOString();
  
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
};

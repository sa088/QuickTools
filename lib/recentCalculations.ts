export interface RecentCalculation {
  id: string;
  name: string;
  href: string;
  iconName: string;
  category: string;
  timestamp: number;
  summary: string;
  tag?: string;
  gradient?: string;
}

const STORAGE_KEY = 'quicktools_recent_calculations';
const MAX_RECENT_ITEMS = 6;

export function getRecentCalculations(): RecentCalculation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_RECENT_ITEMS);
    }
  } catch (e) {
    console.warn('Error reading recent calculations:', e);
  }
  return [];
}

export function saveRecentCalculation(item: {
  id: string;
  name: string;
  href: string;
  iconName: string;
  category: string;
  summary: string;
  tag?: string;
  gradient?: string;
}): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentCalculations();
    // Filter out existing tool with same id so it bubbles to top
    const filtered = current.filter((calc) => calc.id !== item.id);
    const newEntry: RecentCalculation = {
      ...item,
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('quicktools_recent_update'));
  } catch (e) {
    console.warn('Error saving recent calculation:', e);
  }
}

export function clearRecentCalculations(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('quicktools_recent_update'));
  } catch (e) {
    console.warn('Error clearing recent calculations:', e);
  }
}

export function removeRecentCalculation(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentCalculations();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('quicktools_recent_update'));
  } catch (e) {
    console.warn('Error removing recent calculation:', e);
  }
}

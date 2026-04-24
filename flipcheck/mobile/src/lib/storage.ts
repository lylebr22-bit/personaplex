import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalyzeResponse } from '@/api/client';

const KEY_SCAN_COUNT = 'flipcheck:scanCount';
const KEY_HISTORY = 'flipcheck:history';
const KEY_SUBSCRIBED = 'flipcheck:subscribed';

export const FREE_SCAN_LIMIT = 3;

export interface HistoryEntry {
  id: string;
  createdAt: number;
  imageUri: string;
  result: AnalyzeResponse;
}

export async function getScanCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEY_SCAN_COUNT);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export async function incrementScanCount(): Promise<number> {
  const next = (await getScanCount()) + 1;
  await AsyncStorage.setItem(KEY_SCAN_COUNT, String(next));
  return next;
}

export async function isSubscribed(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEY_SUBSCRIBED)) === '1';
}

export async function setSubscribed(v: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY_SUBSCRIBED, v ? '1' : '0');
}

export async function canScan(): Promise<{ allowed: boolean; remaining: number }> {
  if (await isSubscribed()) return { allowed: true, remaining: Infinity };
  const count = await getScanCount();
  const remaining = Math.max(0, FREE_SCAN_LIMIT - count);
  return { allowed: remaining > 0, remaining };
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const raw = await AsyncStorage.getItem(KEY_HISTORY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addHistoryEntry(entry: HistoryEntry): Promise<void> {
  const current = await getHistory();
  const next = [entry, ...current].slice(0, 50);
  await AsyncStorage.setItem(KEY_HISTORY, JSON.stringify(next));
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(KEY_HISTORY);
}

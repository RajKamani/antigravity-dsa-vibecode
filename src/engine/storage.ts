import { AppState } from '../types';

const STORAGE_KEY = 'dsa-tracker-data';

const defaultState: AppState = {
  problems: [],
  designQuestions: [],
  mockSessions: [],
  streaks: {
    current: 0,
    best: 0,
    lastActiveDate: null
  },
  settings: {
    theme: 'dark',
    dailyGoal: 5,
    notificationsEnabled: false
  }
};

export const loadData = (): AppState => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return defaultState;
    
    const parsed = JSON.parse(rawData);
    return { ...defaultState, ...parsed };
  } catch (error) {
    console.error('Failed to load data from localStorage', error);
    return defaultState;
  }
};

export const saveData = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save data to localStorage', error);
  }
};

export const exportData = (): void => {
  const data = loadData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `dsa-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importData = (file: File): Promise<AppState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation 
        if (json && typeof json === 'object') {
          const newState = { ...defaultState, ...json };
          saveData(newState);
          resolve(newState);
        } else {
          reject(new Error('Invalid JSON format'));
        }
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const clearData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * GYM STORAGE PROXY
 * This utility acts as a bridge between the app and the Local Database.
 */

const IS_SERVER = typeof window === 'undefined';

export const getData = (key) => {
  if (IS_SERVER) return [];
  const storageKey = `gym_db_${key}`;
  const data = localStorage.getItem(storageKey);
  
  const parsedData = data ? JSON.parse(data) : [];

  // Auto-initialize Default Data
  if (parsedData.length === 0) {
    if (key === 'db_trainers' || key === 'trainers') {
      const defaults = [
        { id: 1, name: 'Arjun (Pro)', email: 'trainer@gympro.com', password: 'trainer123' },
        { id: 2, name: 'Rahul (Strength)', email: 'rahul@gympro.com', password: 'password' }
      ];
      localStorage.setItem(`gym_db_${key}`, JSON.stringify(defaults));
      return defaults;
    }
    if (key === 'db_admins' || key === 'admins') {
      const defaults = [{ id: 1, name: 'System Admin', email: 'admin@gympro.com', password: 'admin123' }];
      localStorage.setItem(`gym_db_${key}`, JSON.stringify(defaults));
      return defaults;
    }
  }

  return parsedData;
};

export const saveData = (key, data) => {
  if (IS_SERVER) return;
  const storageKey = `gym_db_${key}`;
  localStorage.setItem(storageKey, JSON.stringify(data));
};
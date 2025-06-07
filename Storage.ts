import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key: string, value: string): Promise<void> => {
  await AsyncStorage.setItem(key, value);
};

export const loadItem = async (key: string): Promise<string | null> => {
  return AsyncStorage.getItem(key);
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

export const saveJSON = async (key: string, value: any): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const loadJSON = async <T = any>(key: string): Promise<T | null> => {
  const str = await AsyncStorage.getItem(key);
  return str ? (JSON.parse(str) as T) : null;
};

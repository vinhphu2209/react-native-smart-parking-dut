import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_KEY = 'api_base_url';
const DEFAULT_API_URL = 'http://192.168.137.213:8000'; // URL mặc định an toàn

let currentApiUrl = '';

export const getApiUrl = async (): Promise<string> => {
  if (currentApiUrl) {
    return currentApiUrl;
  }

  try {
    const url = await AsyncStorage.getItem(API_URL_KEY);
    currentApiUrl = url || DEFAULT_API_URL;
    return currentApiUrl;
  } catch (error) {
    console.error('Failed to load API URL from storage', error);
    return DEFAULT_API_URL;
  }
};

export const setApiUrl = async (url: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(API_URL_KEY, url);
    currentApiUrl = url; // Cập nhật URL hiện tại trong bộ nhớ
  } catch (error) {
    console.error('Failed to save API URL to storage', error);
  }
}; 
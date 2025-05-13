import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Địa chỉ API Backend - thay đổi theo cấu hình của bạn
const API_BASE_URL = 'http://192.168.1.100:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Các hàm API
export const login = async (email: string, password: string) => {
  const response = await api.post('/login/', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/register/', { name, email, password });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/user/profile/');
  return response.data;
};

export const linkBank = async (bankName: string, accountNumber: string, otp: string) => {
  const response = await api.post('/link-bank/', { bank_name: bankName, account_number: accountNumber, otp });
  return response.data;
};

export const parkingIn = async () => {
  const response = await api.post('/parking/in/');
  return response.data;
};

export const parkingOut = async () => {
  const response = await api.post('/parking/out/');
  return response.data;
};

export const getParkingHistory = async () => {
  const response = await api.get('/parking/history/');
  return response.data;
};

export const updateUserProfile = async (userData: {name?: string, email?: string, password?: string}) => {
  const response = await api.put('/user/profile/', userData);
  return response.data;
};

export default api;

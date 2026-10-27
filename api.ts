import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Platform } from "react-native";
import Constants from 'expo-constants';

// Dynamic hostname detection for Web and Physical Devices
// In development, Constants.expoConfig.hostUri gives us the server IP (e.g. 192.168.1.6:8081)
const debuggerHost = Constants.expoConfig?.hostUri;
const LOCAL_IP = debuggerHost ? debuggerHost.split(':')[0] : "192.168.1.6";

const getBaseURL = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || "127.0.0.1";
      // If we are on localhost, explicitly use 127.0.0.1 to avoid Windows IPv6 resolution hangs
      const safeHost = host === 'localhost' ? '127.0.0.1' : host;
      return `http://${safeHost}:3001/api`;
    }
    return `http://127.0.0.1:3001/api`;
  }
  
  // For physical devices, use the IP where the metro server is running
  return `http://${LOCAL_IP}:3001/api`;
};

export const API = axios.create({
  baseURL: getBaseURL(),
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


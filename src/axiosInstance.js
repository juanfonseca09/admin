import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_SECRET_TOKEN}`;
  return config;
});

export default instance;

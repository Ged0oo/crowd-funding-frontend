import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    console.log(token)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
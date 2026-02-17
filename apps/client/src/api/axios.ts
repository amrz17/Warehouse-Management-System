import axios from "axios"
import { getToken } from "@/services/auth.service"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // ambil URL request yang sedang jalan
      const originalRequestUrl = error.config.url;

      // jangan paksa refresh jika sedang memanggil API logout
      if (!originalRequestUrl.includes('/logout')) {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api

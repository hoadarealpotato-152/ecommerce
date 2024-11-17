import { message } from 'antd';
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_IP}:${
    import.meta.env.VITE_BACKEND_PORT
  }/api`,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');
      if (refreshToken) {
        try {
          const response = await api.post('/v1/auth/refreshToken', {
            refreshToken: refreshToken,
            userId: userId,
          });
          console.log(response.data);
          const { accessToken, refreshToken: newRefreshToken } =
            response.data?.data || {};
          if (accessToken && newRefreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (err) {
          console.log(err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          window.location.href = '/login';
        }
      }
    }
    if (error.response?.status === 403) {
      message.error(
        'Trang này không tồn tại hoặc bạn không có quyền truy cập vào trang này!',
        10
      );
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

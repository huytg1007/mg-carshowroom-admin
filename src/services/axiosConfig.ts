import axios, { InternalAxiosRequestConfig } from 'axios'
import {config} from '@/services/config'

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
})

// Add authentication token to all requests
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// // Intercept requests to include the token in the headers
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// Intercept responses to handle token expiration
// export const setupInterceptors = (refreshAccessToken: () => Promise<void>) => {
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config

//       // Check if the error is due to an expired token
//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true

//         try {
//           await refreshAccessToken() // Call the refresh function

//           // Update the Authorization header with the new token
//           const newToken = localStorage.getItem('access_token')
//           originalRequest.headers.Authorization = `Bearer ${newToken}`

//           return axiosInstance(originalRequest) // Retry the original request
//         } catch (err) {
//           return Promise.reject(err)
//         }
//       }

//       return Promise.reject(error)
//     },
//   )
// }

export default axiosInstance

import { ApiResponse } from '@/interfaces/apiInterface';
import { PagedResult } from '@/interfaces/PagingInterface';
import { AuthResponse, ChangePasswordRequest, LoginRequest, RegisterRequest, User, UserFilterParams } from '@/interfaces/userInterface';
import { axiosInstance, handleError } from './apiClient';

const baseUrl = '/api/Auth';
const usersUrl = '/api/Users';

// Login
async function login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(`${baseUrl}/login`, credentials);

    if (response.data.success && response.data.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken || '');
    }

    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// Register
async function register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(`${baseUrl}/register`, userData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// Logout
async function logout(): Promise<boolean> {
  try {
    await axiosInstance.post(`${baseUrl}/logout`);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

// Refresh token
async function refreshToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(`${baseUrl}/refresh-token`, { refreshToken });

    if (response.data.success && response.data.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken || '');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}

// Get current user
async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(`${usersUrl}/me`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// Change password
async function changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<null>> {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(`${usersUrl}/change-password`, passwordData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// Get all users (admin only)
async function getAllUsers(): Promise<ApiResponse<User[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<User[]>>(usersUrl);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// Get paged users with filtering (admin only)
async function getPagedUsers(params: UserFilterParams): Promise<ApiResponse<PagedResult<User>>> {
  try {
    const response = await axiosInstance.get<ApiResponse<PagedResult<User>>>(`${usersUrl}/paged`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// Check if user is authenticated
function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export const AuthService = {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  changePassword,
  getAllUsers,
  getPagedUsers,
  isAuthenticated
};

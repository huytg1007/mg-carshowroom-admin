export interface User {
  id?: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface UserFilterParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
  searchTerm?: string;
  includeInactive: boolean;
}
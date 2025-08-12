import { ApiResponse } from '@/interfaces/apiInterface';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import axiosInstance from './axiosConfig';

// Convert object to FormData for multipart/form-data requests
export function toFormData<T extends object>(data: T): FormData {
  const formData = new FormData();

  const appendFormData = (obj: unknown, parentKey?: string) => {
    if (obj && typeof obj === 'object' && !(obj instanceof File)) {
      Object.entries(obj).forEach(([key, value]) => {
        const formKey = parentKey ? `${parentKey}.${key}` : key;

        if (value instanceof File) {
          formData.append(formKey, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const arrayKey = `${formKey}[${index}]`;
            if (item instanceof File) {
              formData.append(arrayKey, item);
            } else if (typeof item === 'object' && item !== null) {
              appendFormData(item, arrayKey);
            } else if (item !== undefined && item !== null) {
              formData.append(arrayKey, String(item));
            }
          });
        } else if (value !== null && typeof value === 'object') {
          appendFormData(value, formKey);
        } else if (value !== undefined && value !== null) {
          formData.append(formKey, String(value));
        }
      });
    } else if (obj instanceof File) {
      formData.append(parentKey || 'file', obj);
    }
  };

  appendFormData(data);
  return formData;
}

// Error handling helper
export function handleError<T>(error: unknown): ApiResponse<T> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<T>>;
    const responseData = axiosError.response?.data;
    return (
      responseData || {
        success: false,
        statusCode: axiosError.response?.status || 500,
        message: axiosError.message || 'An error occurred',
        errors: ['Request failed'],
      }
    );
  }
  return {
    success: false,
    statusCode: 500,
    message: 'An unexpected error occurred',
    errors: [(error as Error).message || 'Unknown error'],
  };
}

// Generic HTTP methods
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

export { axiosInstance };

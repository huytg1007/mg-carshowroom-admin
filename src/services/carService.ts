
import { 
  Car, 
  CarFilterParams, 
  CarMinimal, 
  CreateCarRequest
}from '@/interfaces/carInterface'; 
import { ApiResponse } from '@/interfaces/apiInterface';
import { PagedResult } from '@/interfaces/PagingInterface';
import axiosInstance from './axiosConfig';
import { handleError, toFormData } from './apiClient';

const baseUrl = '/api/cars';

// Service functions
async function getAllCars(): Promise<ApiResponse<Car[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Car[]>>(baseUrl);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getCarById(id: number): Promise<ApiResponse<Car>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Car>>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function createCar(car: CreateCarRequest): Promise<ApiResponse<Car>> {
  try {
    const formData = toFormData(car);
    const response = await axiosInstance.post<ApiResponse<Car>>(baseUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function updateCar(id: number, car: CreateCarRequest): Promise<ApiResponse<Car>> {
  try {
    const formData = toFormData(car);
    const response = await axiosInstance.put<ApiResponse<Car>>(`${baseUrl}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// Update car with FormData (for file upload)
async function updateCarWithFormData(id: number, formData: FormData): Promise<ApiResponse<Car>> {
  try {
    const response = await axiosInstance.put<ApiResponse<Car>>(`${baseUrl}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function deleteCar(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function softDeleteCar(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`${baseUrl}/soft/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getPagedCars(params: CarFilterParams): Promise<ApiResponse<PagedResult<Car>>> {
  try {
    const response = await axiosInstance.get<ApiResponse<PagedResult<Car>>>(`${baseUrl}/paged`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// Add this method to your carService.ts file
async function getAllCarsMinimal(includeInactive: boolean = false): Promise<ApiResponse<CarMinimal[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<CarMinimal[]>>(
      `${baseUrl}/minimal`, 
      { params: { includeInactive } }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}


const carService = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  updateCarWithFormData,
  deleteCar,
  softDeleteCar,
  getPagedCars,
  getAllCarsMinimal
};

export default carService;
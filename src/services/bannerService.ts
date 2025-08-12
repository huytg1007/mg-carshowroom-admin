
import { ApiResponse } from '@/interfaces/apiInterface';
import { BannerType, BannerFilterParams, CreateBannerRequest } from '@/interfaces/bannerInterface';
import { PagedResult } from '@/interfaces/PagingInterface';
import axiosInstance from './axiosConfig';
import { handleError, toFormData } from './apiClient';

const baseUrl = '/api/banners';


// Service functions
async function getAllBanners(): Promise<ApiResponse<BannerType[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<BannerType[]>>(baseUrl);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getBannerById(id: number): Promise<ApiResponse<BannerType>> {
  try {
    const response = await axiosInstance.get<ApiResponse<BannerType>>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function createBanner(banner: CreateBannerRequest, bannerImageFile?: File): Promise<ApiResponse<BannerType>> {
  try {
    const formData = toFormData(banner);
    if (bannerImageFile) {
      formData.append('bannerImageFile', bannerImageFile);
    }
    const response = await axiosInstance.post<ApiResponse<BannerType>>(baseUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function updateBanner(id: number, banner: CreateBannerRequest, bannerImageFile?: File): Promise<ApiResponse<BannerType>> {
  try {
    const formData = toFormData(banner);
    if (bannerImageFile) {
      formData.append('bannerImageFile', bannerImageFile);
    }
    const response = await axiosInstance.put<ApiResponse<BannerType>>(`${baseUrl}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function deleteBanner(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function softDeleteBanner(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`${baseUrl}/soft/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getPagedBanners(params: BannerFilterParams): Promise<ApiResponse<PagedResult<BannerType>>> {
  try {
    const response = await axiosInstance.get<ApiResponse<PagedResult<BannerType>>>(`${baseUrl}/paged`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

const bannerService = {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  softDeleteBanner,
  getPagedBanners
};

export default bannerService;
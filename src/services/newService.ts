
import { ApiResponse } from '@/interfaces/apiInterface';
import { CreateNewsRequest, News, NewsFilterParams } from '@/interfaces/newsInterface';
import { PagedResult } from '@/interfaces/PagingInterface';
import { axiosInstance, handleError, toFormData } from './apiClient';

const baseUrl = '/api/news';

// Service functions
async function getAllNews(): Promise<ApiResponse<News[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<News[]>>(baseUrl);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getNewsById(id: number): Promise<ApiResponse<News>> {
  try {
    const response = await axiosInstance.get<ApiResponse<News>>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function createNews(news: CreateNewsRequest, newsImageFile?: File): Promise<ApiResponse<News>> {
  try {
    const formData = toFormData(news);
    if (newsImageFile) {
      formData.append('newsImageFile', newsImageFile);
    }
    const response = await axiosInstance.post<ApiResponse<News>>(baseUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function updateNews(id: number, news: CreateNewsRequest, newsImageFile?: File): Promise<ApiResponse<News>> {
  try {
    const formData = toFormData(news);
    if (newsImageFile) {
      formData.append('newsImageFile', newsImageFile);
    }
    const response = await axiosInstance.put<ApiResponse<News>>(`${baseUrl}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function deleteNews(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function softDeleteNews(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`${baseUrl}/soft/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getPagedNews(params: NewsFilterParams): Promise<ApiResponse<PagedResult<News>>> {
  try {
    const response = await axiosInstance.get<ApiResponse<PagedResult<News>>>(`${baseUrl}/paged`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

const newsService = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  softDeleteNews,
  getPagedNews
};

export default newsService;
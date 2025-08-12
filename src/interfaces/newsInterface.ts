import { ImageUpload } from "./image";

export interface News {
  id?: number;
  name: string;
  content: string;
  imageId?: number;
  imageUrl?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface CreateNewsRequest {
  name: string;
  content: string;
  newsImage?: ImageUpload;
}

export interface NewsFilterParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
  searchTerm?: string;
  includeInactive: boolean;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  news?: News;
}
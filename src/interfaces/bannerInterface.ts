import { ImageUpload } from "./image";

export interface BannerType {
  id: number;
  name: string;
  carId?: number;
  carName?: string;
  imageId?: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface CreateBannerRequest {
  name: string;
  carId?: number;
  bannerImage?: ImageUpload;
}

export interface BannerFilterParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
  searchTerm?: string;
  carId?: number;
  includeInactive: boolean;
}

export interface BannerResponse {
  success: boolean;
  message: string;
  banner?: BannerType;
}
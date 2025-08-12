import { ImageUpload } from "./image";

// Basic interfaces for car-related data
export interface CarProperty {
  id?: number;
  name: string;
  value: string;
  carDetailId?: number;
}

export interface CarFeature {
  id?: number;
  name: string;
  carId?: number;
  imageId?: number;
  imageUrl?: string;
  featureImage?: ImageUpload;
}

export interface CarDetail {
  id?: number;
  carName: string;
  price: number;
  description?: string;
  carId?: number;
  thumbnailImageId?: number;
  thumbnailImageUrl?: string;
  thumbnailImage?: ImageUpload;
  detailImageUploads?: ImageUpload[];
  properties: CarProperty[];
}

export interface Car {
  id?: number;
  name: string;
  description?: string;
  featureTitle?: string;
  featureDescription?: string;
  imageId?: number;
  imageUrl?: string;
  details: CarDetail[];
  features: CarFeature[];
  isActive: boolean;
}

export interface CreateCarRequest {
  name: string;
  description?: string;
  featureTitle?: string;
  featureDescription?: string;
  imageId?: number;
  carImage: ImageUpload;
  details: CarDetail[];
  features: CarFeature[];
}

export interface CarFilterParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  includeInactive: boolean;
}

export interface CarMinimal {
  id: number;
  name: string;
  imageUrl?: string;
}
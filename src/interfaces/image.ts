// Request and response interfaces
export interface ImageUpload {
  file?: File;
  imageType?: string;
  color?: string;
  sortOrder: number;
  existingImageId?: number;
}
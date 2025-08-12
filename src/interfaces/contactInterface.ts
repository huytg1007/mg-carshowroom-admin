export interface Contact {
  id?: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  address?: string;
  title: string;
  content: string;
  carId?: number;
  carName?: string;
  createdAt: Date;
}

export interface CreateContactRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  address?: string;
  title: string;
  content: string;
  carId?: number;
}

export interface ContactFilterParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
  searchTerm?: string;
  carId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contact?: Contact;
}
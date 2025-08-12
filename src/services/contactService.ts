import { ApiResponse } from '@/interfaces/apiInterface';
import { Contact, ContactFilterParams, CreateContactRequest } from '@/interfaces/contactInterface';
import { PagedResult } from '@/interfaces/PagingInterface';
import axiosInstance from './axiosConfig';
import { handleError } from './apiClient';

const baseUrl = '/api/contacts';

// Service functions
async function getAllContacts(): Promise<ApiResponse<Contact[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Contact[]>>(baseUrl);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getContactById(id: number): Promise<ApiResponse<Contact>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Contact>>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function createContact(contact: CreateContactRequest): Promise<ApiResponse<Contact>> {
  try {
    const response = await axiosInstance.post<ApiResponse<Contact>>(baseUrl, contact);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function updateContact(id: number, contact: CreateContactRequest): Promise<ApiResponse<Contact>> {
  try {
    const response = await axiosInstance.put<ApiResponse<Contact>>(`${baseUrl}/${id}`, contact);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function deleteContact(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getPagedContacts(params: ContactFilterParams): Promise<ApiResponse<PagedResult<Contact>>> {
  try {
    const response = await axiosInstance.get<ApiResponse<PagedResult<Contact>>>(`${baseUrl}/paged`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

const contactService = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getPagedContacts
};

export default contactService;
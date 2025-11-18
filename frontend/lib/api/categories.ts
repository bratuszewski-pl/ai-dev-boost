/**
 * Categories API functions
 */

import { apiRequest } from '../api-client'
import type {
	CreateCategoryRequest,
	CreateCategoryResponse,
	UpdateCategoryRequest,
	UpdateCategoryResponse,
	DeleteCategoryResponse,
	CategoryResponse,
	CategoriesListResponse,
	CategoriesQueryParams,
} from '@/types/models'

export async function getCategories(
	params?: CategoriesQueryParams
): Promise<CategoriesListResponse> {
	const searchParams = new URLSearchParams()
	if (params?.includeCounts) {
		searchParams.set('includeCounts', 'true')
	}

	const queryString = searchParams.toString()
	const endpoint = `/categories${queryString ? `?${queryString}` : ''}`

	return apiRequest<CategoriesListResponse>(endpoint, {
		method: 'GET',
	})
}

export async function getCategory(id: string): Promise<CategoryResponse> {
	return apiRequest<CategoryResponse>(`/categories/${id}`, {
		method: 'GET',
	})
}

export async function createCategory(
	data: CreateCategoryRequest
): Promise<CreateCategoryResponse> {
	return apiRequest<CreateCategoryResponse>('/categories', {
		method: 'POST',
		body: JSON.stringify(data),
	})
}

export async function updateCategory(
	id: string,
	data: UpdateCategoryRequest
): Promise<UpdateCategoryResponse> {
	return apiRequest<UpdateCategoryResponse>(`/categories/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	})
}

export async function deleteCategory(
	id: string
): Promise<DeleteCategoryResponse> {
	return apiRequest<DeleteCategoryResponse>(`/categories/${id}`, {
		method: 'DELETE',
	})
}


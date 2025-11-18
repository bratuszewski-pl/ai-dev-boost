/**
 * Search API functions
 */

import { apiRequest } from '../api-client'
import type { SearchResponse, SearchQueryParams } from '@/types/models'

export async function searchNotes(
	params: SearchQueryParams
): Promise<SearchResponse> {
	const searchParams = new URLSearchParams()
	searchParams.set('type', params.type)
	if (params.query) searchParams.set('query', params.query)
	if (params.startDate) searchParams.set('startDate', params.startDate)
	if (params.endDate) searchParams.set('endDate', params.endDate)
	if (params.categoryId) searchParams.set('categoryId', params.categoryId)
	if (params.tags) searchParams.set('tags', params.tags)
	if (params.page) searchParams.set('page', params.page.toString())
	if (params.limit) searchParams.set('limit', params.limit.toString())

	return apiRequest<SearchResponse>(`/search?${searchParams.toString()}`, {
		method: 'GET',
	})
}


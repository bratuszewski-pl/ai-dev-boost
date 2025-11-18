/**
 * Sharing API functions
 */

import { apiRequest } from '../api-client'
import type {
	ShareNoteRequest,
	ShareNoteResponse,
	SharedNotesListResponse,
	SharedNotesQueryParams,
} from '@/types/models'

export async function getSharedNotes(
	params?: SharedNotesQueryParams
): Promise<SharedNotesListResponse> {
	const searchParams = new URLSearchParams()
	if (params?.page) searchParams.set('page', params.page.toString())
	if (params?.limit) searchParams.set('limit', params.limit.toString())
	if (params?.cursor) searchParams.set('cursor', params.cursor)

	const queryString = searchParams.toString()
	const endpoint = `/notes/shared${queryString ? `?${queryString}` : ''}`

	return apiRequest<SharedNotesListResponse>(endpoint, {
		method: 'GET',
	})
}

export async function shareNote(
	id: string,
	data: ShareNoteRequest
): Promise<ShareNoteResponse> {
	return apiRequest<ShareNoteResponse>(`/notes/${id}/share`, {
		method: 'POST',
		body: JSON.stringify(data),
	})
}


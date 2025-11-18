/**
 * Notes API functions
 */

import { apiRequest } from '../api-client'
import type {
	CreateNoteRequest,
	CreateNoteResponse,
	UpdateNoteRequest,
	UpdateNoteResponse,
	DeleteNoteResponse,
	AnalyzeNoteResponse,
	NoteResponse,
	NotesListResponse,
	NotesQueryParams,
} from '@/types/models'

export async function getNotes(
	params?: NotesQueryParams
): Promise<NotesListResponse> {
	const searchParams = new URLSearchParams()
	if (params?.page) searchParams.set('page', params.page.toString())
	if (params?.limit) searchParams.set('limit', params.limit.toString())
	if (params?.cursor) searchParams.set('cursor', params.cursor)
	if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
	if (params?.tags) searchParams.set('tags', params.tags)
	if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
	if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)

	const queryString = searchParams.toString()
	const endpoint = `/notes${queryString ? `?${queryString}` : ''}`

	return apiRequest<NotesListResponse>(endpoint, {
		method: 'GET',
	})
}

export async function getNote(id: string): Promise<NoteResponse> {
	return apiRequest<NoteResponse>(`/notes/${id}`, {
		method: 'GET',
	})
}

export async function createNote(
	data: CreateNoteRequest
): Promise<CreateNoteResponse> {
	return apiRequest<CreateNoteResponse>('/notes', {
		method: 'POST',
		body: JSON.stringify(data),
	})
}

export async function updateNote(
	id: string,
	data: UpdateNoteRequest
): Promise<UpdateNoteResponse> {
	return apiRequest<UpdateNoteResponse>(`/notes/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	})
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
	return apiRequest<DeleteNoteResponse>(`/notes/${id}`, {
		method: 'DELETE',
	})
}

export async function analyzeNote(id: string): Promise<AnalyzeNoteResponse> {
	return apiRequest<AnalyzeNoteResponse>(`/notes/${id}/analyze`, {
		method: 'POST',
	})
}


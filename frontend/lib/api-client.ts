/**
 * API Client for NoteFlow
 * Handles all API requests with authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface ApiError {
	error: string
	message: string
	statusCode: number
	details?: Record<string, unknown>
}

async function getAuthToken(): Promise<string | null> {
	if (typeof window === 'undefined') return null
	return localStorage.getItem('auth_token')
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const error: ApiError = await response.json().catch(() => ({
			error: 'Unknown Error',
			message: response.statusText,
			statusCode: response.status,
		}))
		throw error
	}

	return response.json()
}

export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = await getAuthToken()

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...options.headers,
	}

	if (token) {
		(headers as any)['Authorization'] = `Bearer ${token}`
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	})

	return handleResponse<T>(response)
}

export function saveAuthToken(token: string): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem('auth_token', token)
	}
}

export function removeAuthToken(): void {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('auth_token')
	}
}


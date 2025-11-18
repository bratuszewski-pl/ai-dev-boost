/**
 * Authentication API functions
 */

import { apiRequest, saveAuthToken, removeAuthToken } from './../api-client'
import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	MeResponse,
	LogoutResponse,
} from '@/types/models'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
	const response = await apiRequest<LoginResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify(credentials),
	})

	if (response.token) {
		saveAuthToken(response.token)
	}

	return response
}

export async function register(
	data: RegisterRequest
): Promise<RegisterResponse> {
	const response = await apiRequest<RegisterResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify(data),
	})

	return response
}

export async function logout(): Promise<LogoutResponse> {
	const response = await apiRequest<LogoutResponse>('/auth/logout', {
		method: 'POST',
	})

	removeAuthToken()

	return response
}

export async function getCurrentUser(): Promise<MeResponse> {
	return apiRequest<MeResponse>('/auth/me', {
		method: 'GET',
	})
}


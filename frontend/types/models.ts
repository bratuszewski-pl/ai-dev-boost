/**
 * TypeScript Models for NoteFlow Frontend
 * Re-exported from common/models.ts for frontend use
 */

export type ObjectId = string
export type ISO8601DateTime = string
export type URL = string

// Enums
export enum SearchType {
	DATE = 'date',
	CATEGORY = 'category',
	KEYWORD = 'keyword',
	SEMANTIC = 'semantic',
}

export enum SortBy {
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export enum AIAnalysisStatus {
	PENDING = 'pending',
	COMPLETED = 'completed',
	FAILED = 'failed',
}

// User Models
export interface User {
	id: ObjectId
	username: string
	createdAt: ISO8601DateTime
	updatedAt: ISO8601DateTime
}

export interface PublicUser {
	id: ObjectId
	username: string
	createdAt: ISO8601DateTime
}

export interface RegisterRequest {
	username: string
	password: string
}

export interface LoginRequest {
	username: string
	password: string
}

export interface RegisterResponse {
	message: string
	user: PublicUser
}

export interface LoginResponse {
	message: string
	token: string
	user: {
		id: ObjectId
		username: string
	}
}

export interface LogoutResponse {
	message: string
}

export interface MeResponse {
	user: PublicUser
}


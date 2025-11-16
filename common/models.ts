/**
 * TypeScript Models for NoteFlow API
 * Based on REST API Plan
 */

// ============================================================================
// Enums
// ============================================================================

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

export enum TagSortBy {
	NAME = 'name',
	COUNT = 'count',
}

// ============================================================================
// Base Types
// ============================================================================

export type ObjectId = string
export type ISO8601DateTime = string
export type URL = string

// ============================================================================
// User Models
// ============================================================================

export interface User {
	id: ObjectId
	username: string
	password?: string // Only in database, never in API responses
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

// ============================================================================
// Note Content Models
// ============================================================================

export interface ImageMetadata {
	url: URL
	filename: string
	mimeType: string
	size: number
	uploadedAt: ISO8601DateTime
}

export interface NoteContent {
	text: string
	links: URL[]
	images: ImageMetadata[]
}

export interface NoteContentRequest {
	text: string
	links?: URL[]
	images?: string[] // base64 or file references
}

// ============================================================================
// Note Models
// ============================================================================

export interface Note {
	id: ObjectId
	userId: ObjectId
	content: NoteContent
	categoryId: ObjectId | null
	categoryName: string | null
	tags: string[]
	keywords: string[]
	vectorId: ObjectId | null
	version: number
	aiAnalysisStatus?: AIAnalysisStatus
	createdAt: ISO8601DateTime
	updatedAt: ISO8601DateTime
	sharedWith?: SharedWith[]
}

export interface NotePreview {
	id: ObjectId
	title: string
	preview: string
	categoryId: ObjectId | null
	categoryName: string | null
	tags: string[]
	keywords: string[]
	createdAt: ISO8601DateTime
	updatedAt: ISO8601DateTime
}

export interface SharedWith {
	userId: ObjectId
	username: string
	sharedAt: ISO8601DateTime
}

export interface SharedBy {
	userId: ObjectId
	username: string
	sharedAt: ISO8601DateTime
}

export interface CreateNoteRequest {
	content: NoteContentRequest
	categoryId?: ObjectId
	tags?: string[]
}

export interface UpdateNoteRequest {
	content?: NoteContentRequest
	categoryId?: ObjectId
	tags?: string[]
	version: number
}

export interface CreateNoteResponse {
	message: string
	note: Note
}

export interface UpdateNoteResponse {
	message: string
	note: Note
}

export interface DeleteNoteResponse {
	message: string
}

export interface AnalyzeNoteResponse {
	message: string
	noteId: ObjectId
	status: AIAnalysisStatus
}

// ============================================================================
// Category Models
// ============================================================================

export interface Category {
	id: ObjectId
	name: string
	userId: ObjectId
	noteCount?: number
	createdAt: ISO8601DateTime
	updatedAt: ISO8601DateTime
}

export interface CategoryWithCount extends Category {
	noteCount: number
}

export interface CreateCategoryRequest {
	name: string
}

export interface UpdateCategoryRequest {
	name: string
}

export interface CreateCategoryResponse {
	message: string
	category: Category
}

export interface UpdateCategoryResponse {
	message: string
	category: Category
}

export interface DeleteCategoryResponse {
	message: string
	notesUpdated: number
}

// ============================================================================
// Sharing Models
// ============================================================================

export interface ShareNoteRequest {
	username: string
}

export interface ShareNoteResponse {
	message: string
	noteId: ObjectId
	sharedWith: {
		userId: ObjectId
		username: string
	}
}

export interface UnshareNoteResponse {
	message: string
	noteId: ObjectId
	unsharedWith: {
		userId: ObjectId
		username: string
	}
}

export interface SharedNotePreview extends NotePreview {
	sharedBy: SharedBy
}

// ============================================================================
// Tag Models
// ============================================================================

export interface Tag {
	name: string
	count: number
}

// ============================================================================
// Pagination Models
// ============================================================================

export interface CursorPagination {
	page: number
	limit: number
	hasMore: boolean
	nextCursor: ISO8601DateTime | null
}

export interface OffsetPagination {
	page: number
	limit: number
	total: number
	hasMore: boolean
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface NotesQueryParams {
	page?: number
	limit?: number
	cursor?: ISO8601DateTime
	categoryId?: ObjectId
	tags?: string
	sortBy?: SortBy
	sortOrder?: SortOrder
}

export interface SearchQueryParams {
	type: SearchType
	query?: string
	startDate?: ISO8601DateTime
	endDate?: ISO8601DateTime
	categoryId?: ObjectId
	tags?: string
	page?: number
	limit?: number
}

export interface CategoriesQueryParams {
	includeCounts?: boolean
}

export interface TagsQueryParams {
	sortBy?: TagSortBy
	sortOrder?: SortOrder
}

export interface SharedNotesQueryParams {
	page?: number
	limit?: number
	cursor?: ISO8601DateTime
}

// ============================================================================
// Response Models
// ============================================================================

export interface NotesListResponse {
	notes: NotePreview[]
	pagination: CursorPagination
}

export interface NoteResponse {
	note: Note
}

export interface CategoriesListResponse {
	categories: Category[]
}

export interface CategoryResponse {
	category: CategoryWithCount
}

export interface TagsListResponse {
	tags: Tag[]
}

export interface SharedNotesListResponse {
	notes: SharedNotePreview[]
	pagination: CursorPagination
}

// ============================================================================
// Search Models
// ============================================================================

export interface SearchResult {
	id: ObjectId
	title: string
	preview: string
	categoryId: ObjectId | null
	categoryName: string | null
	tags: string[]
	keywords: string[]
	relevanceScore?: number // Only for semantic search (0-1)
	createdAt: ISO8601DateTime
	updatedAt: ISO8601DateTime
}

export interface SearchResponse {
	results: SearchResult[]
	pagination: OffsetPagination
	searchType: SearchType
	queryTime: number // milliseconds
}

// ============================================================================
// Error Models
// ============================================================================

export interface ApiError {
	error: string
	message: string
	statusCode: number
	details?: Record<string, unknown>
}

// ============================================================================
// JWT Payload
// ============================================================================

export interface JWTPayload {
	userId: ObjectId
	username: string
	iat?: number
	exp?: number
}


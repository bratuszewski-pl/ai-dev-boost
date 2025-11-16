/**
 * Fastify JSON Schema Definitions for NoteFlow API
 * Based on API Plan and TypeScript Models
 */

import { FastifySchema } from 'fastify'

// ============================================================================
// Common Schema Definitions
// ============================================================================

const objectIdSchema = {
	type: 'string',
	pattern: '^[0-9a-fA-F]{24}$',
	description: 'MongoDB ObjectId',
}

const iso8601DateTimeSchema = {
	type: 'string',
	format: 'date-time',
	description: 'ISO 8601 datetime string',
}

const urlSchema = {
	type: 'string',
	format: 'uri',
	description: 'Valid URL',
}

// ============================================================================
// Authentication Schemas
// ============================================================================

export const registerSchema: FastifySchema = {
	description: 'Register a new user account',
	tags: ['auth'],
	body: {
		type: 'object',
		required: ['username', 'password'],
		properties: {
			username: {
				type: 'string',
				minLength: 3,
				maxLength: 50,
				pattern: '^[a-zA-Z0-9_]+$',
				description: 'Unique username (alphanumeric and underscore only)',
			},
			password: {
				type: 'string',
				minLength: 8,
				description: 'Password (minimum 8 characters)',
			},
		},
	},
	response: {
		201: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				user: {
					type: 'object',
					properties: {
						id: objectIdSchema,
						username: { type: 'string' },
						createdAt: iso8601DateTimeSchema,
					},
					required: ['id', 'username', 'createdAt'],
				},
			},
			required: ['message', 'user'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		409: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const loginSchema: FastifySchema = {
	description: 'Authenticate user and create session',
	tags: ['auth'],
	body: {
		type: 'object',
		required: ['username', 'password'],
		properties: {
			username: {
				type: 'string',
				description: 'Username',
			},
			password: {
				type: 'string',
				description: 'Password',
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				token: { type: 'string' },
				user: {
					type: 'object',
					properties: {
						id: objectIdSchema,
						username: { type: 'string' },
					},
					required: ['id', 'username'],
				},
			},
			required: ['message', 'token', 'user'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const logoutSchema: FastifySchema = {
	description: 'Invalidate user session',
	tags: ['auth'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
			},
			required: ['message'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const meSchema: FastifySchema = {
	description: 'Get current authenticated user information',
	tags: ['auth'],
	response: {
		200: {
			type: 'object',
			properties: {
				user: {
					type: 'object',
					properties: {
						id: objectIdSchema,
						username: { type: 'string' },
						createdAt: iso8601DateTimeSchema,
					},
					required: ['id', 'username', 'createdAt'],
				},
			},
			required: ['user'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

// ============================================================================
// Notes Schemas
// ============================================================================

const imageMetadataSchema = {
	type: 'object',
	properties: {
		url: urlSchema,
		filename: { type: 'string' },
		mimeType: { type: 'string' },
		size: { type: 'number' },
		uploadedAt: iso8601DateTimeSchema,
	},
	required: ['url', 'filename', 'mimeType', 'size', 'uploadedAt'],
}

const noteContentSchema = {
	type: 'object',
	properties: {
		text: { type: 'string' },
		links: {
			type: 'array',
			items: urlSchema,
			maxItems: 50,
		},
		images: {
			type: 'array',
			items: imageMetadataSchema,
			maxItems: 20,
		},
	},
	required: ['text', 'links', 'images'],
}

const noteContentRequestSchema = {
	type: 'object',
	properties: {
		text: { type: 'string' },
		links: {
			type: 'array',
			items: urlSchema,
			maxItems: 50,
		},
		images: {
			type: 'array',
			items: { type: 'string' },
			maxItems: 20,
			description: 'Base64 encoded images or file references',
		},
	},
	required: ['text'],
}

const notePreviewSchema = {
	type: 'object',
	properties: {
		id: objectIdSchema,
		title: { type: 'string' },
		preview: { type: 'string' },
		categoryId: {
			...objectIdSchema,
			nullable: true,
		},
		categoryName: {
			type: 'string',
			nullable: true,
		},
		tags: {
			type: 'array',
			items: { type: 'string' },
		},
		keywords: {
			type: 'array',
			items: { type: 'string' },
		},
		createdAt: iso8601DateTimeSchema,
		updatedAt: iso8601DateTimeSchema,
	},
	required: ['id', 'title', 'preview', 'categoryId', 'categoryName', 'tags', 'keywords', 'createdAt', 'updatedAt'],
}

const sharedWithSchema = {
	type: 'object',
	properties: {
		userId: objectIdSchema,
		username: { type: 'string' },
		sharedAt: iso8601DateTimeSchema,
	},
	required: ['userId', 'username', 'sharedAt'],
}

const fullNoteSchema = {
	type: 'object',
	properties: {
		id: objectIdSchema,
		userId: objectIdSchema,
		content: noteContentSchema,
		categoryId: {
			...objectIdSchema,
			nullable: true,
		},
		categoryName: {
			type: 'string',
			nullable: true,
		},
		tags: {
			type: 'array',
			items: { type: 'string' },
		},
		keywords: {
			type: 'array',
			items: { type: 'string' },
		},
		vectorId: {
			...objectIdSchema,
			nullable: true,
		},
		version: { type: 'number' },
		aiAnalysisStatus: {
			type: 'string',
			enum: ['pending', 'completed', 'failed'],
		},
		createdAt: iso8601DateTimeSchema,
		updatedAt: iso8601DateTimeSchema,
		sharedWith: {
			type: 'array',
			items: sharedWithSchema,
		},
	},
	required: ['id', 'userId', 'content', 'categoryId', 'categoryName', 'tags', 'keywords', 'vectorId', 'version', 'createdAt', 'updatedAt'],
}

const cursorPaginationSchema = {
	type: 'object',
	properties: {
		page: { type: 'number' },
		limit: { type: 'number' },
		hasMore: { type: 'boolean' },
		nextCursor: {
			type: 'string',
			nullable: true,
		},
	},
	required: ['page', 'limit', 'hasMore', 'nextCursor'],
}

export const getNotesSchema: FastifySchema = {
	description: 'Retrieve paginated list of user notes with optional filtering and sorting',
	tags: ['notes'],
	querystring: {
		type: 'object',
		properties: {
			page: {
				type: 'number',
				minimum: 1,
				default: 1,
			},
			limit: {
				type: 'number',
				minimum: 1,
				maximum: 100,
				default: 20,
			},
			cursor: {
				type: 'string',
				format: 'date-time',
			},
			categoryId: objectIdSchema,
			tags: {
				type: 'string',
				description: 'Comma-separated tags',
			},
			sortBy: {
				type: 'string',
				enum: ['createdAt', 'updatedAt'],
				default: 'createdAt',
			},
			sortOrder: {
				type: 'string',
				enum: ['asc', 'desc'],
				default: 'desc',
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				notes: {
					type: 'array',
					items: notePreviewSchema,
				},
				pagination: cursorPaginationSchema,
			},
			required: ['notes', 'pagination'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const getNoteSchema: FastifySchema = {
	description: 'Retrieve a single note by ID with full content',
	tags: ['notes'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
		},
		required: ['id'],
	},
	response: {
		200: {
			type: 'object',
			properties: {
				note: fullNoteSchema,
			},
			required: ['note'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const createNoteSchema: FastifySchema = {
	description: 'Create a new note and trigger AI analysis',
	tags: ['notes'],
	body: {
		type: 'object',
		required: ['content'],
		properties: {
			content: noteContentRequestSchema,
			categoryId: objectIdSchema,
			tags: {
				type: 'array',
				items: {
					type: 'string',
					minLength: 1,
					maxLength: 50,
					pattern: '^[a-zA-Z0-9-]+$',
				},
				maxItems: 20,
			},
		},
	},
	response: {
		201: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				note: {
					...fullNoteSchema,
					properties: {
						...fullNoteSchema.properties,
						keywords: {
							type: 'array',
							items: { type: 'string' },
						},
					},
				},
			},
			required: ['message', 'note'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		413: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const updateNoteSchema: FastifySchema = {
	description: 'Update an existing note with optimistic concurrency control',
	tags: ['notes'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
		},
		required: ['id'],
	},
	body: {
		type: 'object',
		required: ['version'],
		properties: {
			content: noteContentRequestSchema,
			categoryId: objectIdSchema,
			tags: {
				type: 'array',
				items: {
					type: 'string',
					minLength: 1,
					maxLength: 50,
					pattern: '^[a-zA-Z0-9-]+$',
				},
				maxItems: 20,
			},
			version: {
				type: 'number',
				minimum: 1,
				description: 'Current version for optimistic locking',
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				note: fullNoteSchema,
			},
			required: ['message', 'note'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		409: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		413: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const deleteNoteSchema: FastifySchema = {
	description: 'Delete a note permanently (hard delete)',
	tags: ['notes'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
		},
		required: ['id'],
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
			},
			required: ['message'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const analyzeNoteSchema: FastifySchema = {
	description: 'Manually trigger AI analysis for a note (retry failed analysis)',
	tags: ['notes'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
		},
		required: ['id'],
	},
	response: {
		202: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				noteId: objectIdSchema,
				status: {
					type: 'string',
					enum: ['pending'],
				},
			},
			required: ['message', 'noteId', 'status'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		429: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

// ============================================================================
// Search Schemas
// ============================================================================

const searchResultSchema = {
	type: 'object',
	properties: {
		id: objectIdSchema,
		title: { type: 'string' },
		preview: { type: 'string' },
		categoryId: {
			...objectIdSchema,
			nullable: true,
		},
		categoryName: {
			type: 'string',
			nullable: true,
		},
		tags: {
			type: 'array',
			items: { type: 'string' },
		},
		keywords: {
			type: 'array',
			items: { type: 'string' },
		},
		relevanceScore: {
			type: 'number',
			minimum: 0,
			maximum: 1,
			description: 'Only for semantic search',
		},
		createdAt: iso8601DateTimeSchema,
		updatedAt: iso8601DateTimeSchema,
	},
	required: ['id', 'title', 'preview', 'categoryId', 'categoryName', 'tags', 'keywords', 'createdAt', 'updatedAt'],
}

const offsetPaginationSchema = {
	type: 'object',
	properties: {
		page: { type: 'number' },
		limit: { type: 'number' },
		total: { type: 'number' },
		hasMore: { type: 'boolean' },
	},
	required: ['page', 'limit', 'total', 'hasMore'],
}

export const searchSchema: FastifySchema = {
	description: 'Multi-modal search endpoint supporting date, category, keyword, and semantic search',
	tags: ['search'],
	querystring: {
		type: 'object',
		required: ['type'],
		properties: {
			type: {
				type: 'string',
				enum: ['date', 'category', 'keyword', 'semantic'],
			},
			query: {
				type: 'string',
				minLength: 1,
				maxLength: 500,
			},
			startDate: {
				type: 'string',
				format: 'date',
			},
			endDate: {
				type: 'string',
				format: 'date',
			},
			categoryId: objectIdSchema,
			tags: {
				type: 'string',
				description: 'Comma-separated tags',
			},
			page: {
				type: 'number',
				minimum: 1,
				default: 1,
			},
			limit: {
				type: 'number',
				minimum: 1,
				maximum: 100,
				default: 20,
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				results: {
					type: 'array',
					items: searchResultSchema,
				},
				pagination: offsetPaginationSchema,
				searchType: {
					type: 'string',
					enum: ['date', 'category', 'keyword', 'semantic'],
				},
				queryTime: {
					type: 'number',
					description: 'Query time in milliseconds',
				},
			},
			required: ['results', 'pagination', 'searchType', 'queryTime'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		408: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

// ============================================================================
// Categories Schemas
// ============================================================================

const categorySchema = {
	type: 'object',
	properties: {
		id: objectIdSchema,
		name: { type: 'string' },
		userId: objectIdSchema,
		noteCount: { type: 'number' },
		createdAt: iso8601DateTimeSchema,
		updatedAt: iso8601DateTimeSchema,
	},
	required: ['id', 'name', 'userId', 'createdAt', 'updatedAt'],
}

export const getCategoriesSchema: FastifySchema = {
	description: 'Retrieve all categories for the authenticated user',
	tags: ['categories'],
	querystring: {
		type: 'object',
		properties: {
			includeCounts: {
				type: 'boolean',
				default: false,
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				categories: {
					type: 'array',
					items: categorySchema,
				},
			},
			required: ['categories'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const getCategorySchema: FastifySchema = {
	description: 'Retrieve a single category by ID',
	tags: ['categories'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
		},
		required: ['id'],
	},
	response: {
		200: {
			type: 'object',
			properties: {
				category: {
					...categorySchema,
					required: ['id', 'name', 'userId', 'noteCount', 'createdAt', 'updatedAt'],
				},
			},
			required: ['category'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const createCategorySchema: FastifySchema = {
	description: 'Create a new category',
	tags: ['categories'],
	body: {
		type: 'object',
		required: ['name'],
		properties: {
			name: {
				type: 'string',
				minLength: 1,
				maxLength: 100,
			},
		},
	},
	response: {
		201: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				category: categorySchema,
			},
			required: ['message', 'category'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		409: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const updateCategorySchema: FastifySchema = {
	description: 'Update an existing category name',
	tags: ['categories'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
		},
		required: ['id'],
	},
	body: {
		type: 'object',
		required: ['name'],
		properties: {
			name: {
				type: 'string',
				minLength: 1,
				maxLength: 100,
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				category: categorySchema,
			},
			required: ['message', 'category'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		409: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const deleteCategorySchema: FastifySchema = {
	description: 'Delete a category (notes with this category will have categoryId set to null)',
	tags: ['categories'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
		},
		required: ['id'],
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				notesUpdated: { type: 'number' },
			},
			required: ['message', 'notesUpdated'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

// ============================================================================
// Sharing Schemas
// ============================================================================

export const shareNoteSchema: FastifySchema = {
	description: 'Share a note with another user',
	tags: ['sharing'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
		},
		required: ['id'],
	},
	body: {
		type: 'object',
		required: ['username'],
		properties: {
			username: {
				type: 'string',
				description: 'Recipient username',
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				noteId: objectIdSchema,
				sharedWith: {
					type: 'object',
					properties: {
						userId: objectIdSchema,
						username: { type: 'string' },
					},
					required: ['userId', 'username'],
				},
			},
			required: ['message', 'noteId', 'sharedWith'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		409: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

export const unshareNoteSchema: FastifySchema = {
	description: 'Unshare a note with a specific user',
	tags: ['sharing'],
	params: {
		type: 'object',
		properties: {
			id: objectIdSchema,
			userId: objectIdSchema,
		},
		required: ['id', 'userId'],
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				noteId: objectIdSchema,
				unsharedWith: {
					type: 'object',
					properties: {
						userId: objectIdSchema,
						username: { type: 'string' },
					},
					required: ['userId', 'username'],
				},
			},
			required: ['message', 'noteId', 'unsharedWith'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		403: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		404: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

const sharedNotePreviewSchema = {
	type: 'object',
	properties: {
		id: objectIdSchema,
		title: { type: 'string' },
		preview: { type: 'string' },
		categoryId: {
			...objectIdSchema,
			nullable: true,
		},
		categoryName: {
			type: 'string',
			nullable: true,
		},
		tags: {
			type: 'array',
			items: { type: 'string' },
		},
		sharedBy: {
			type: 'object',
			properties: {
				userId: objectIdSchema,
				username: { type: 'string' },
				sharedAt: iso8601DateTimeSchema,
			},
			required: ['userId', 'username', 'sharedAt'],
		},
		createdAt: iso8601DateTimeSchema,
		updatedAt: iso8601DateTimeSchema,
	},
	required: ['id', 'title', 'preview', 'categoryId', 'categoryName', 'tags', 'sharedBy', 'createdAt', 'updatedAt'],
}

export const getSharedNotesSchema: FastifySchema = {
	description: 'Retrieve all notes shared with the authenticated user',
	tags: ['sharing'],
	querystring: {
		type: 'object',
		properties: {
			page: {
				type: 'number',
				minimum: 1,
				default: 1,
			},
			limit: {
				type: 'number',
				minimum: 1,
				maximum: 100,
				default: 20,
			},
			cursor: {
				type: 'string',
				format: 'date-time',
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				notes: {
					type: 'array',
					items: sharedNotePreviewSchema,
				},
				pagination: cursorPaginationSchema,
			},
			required: ['notes', 'pagination'],
		},
		400: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}

// ============================================================================
// Tags Schemas
// ============================================================================

const tagSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		count: { type: 'number' },
	},
	required: ['name', 'count'],
}

export const getTagsSchema: FastifySchema = {
	description: 'Retrieve all tags used by the authenticated user with usage counts',
	tags: ['tags'],
	querystring: {
		type: 'object',
		properties: {
			sortBy: {
				type: 'string',
				enum: ['name', 'count'],
				default: 'name',
			},
			sortOrder: {
				type: 'string',
				enum: ['asc', 'desc'],
				default: 'asc',
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				tags: {
					type: 'array',
					items: tagSchema,
				},
			},
			required: ['tags'],
		},
		401: {
			type: 'object',
			properties: {
				error: { type: 'string' },
				message: { type: 'string' },
				statusCode: { type: 'number' },
			},
		},
	},
}


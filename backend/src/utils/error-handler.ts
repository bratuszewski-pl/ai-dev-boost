import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { logger } from './logger'

export async function errorHandler(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply
) {
	logger.error('Request error:', {
		method: request.method,
		url: request.url,
		error: error.message,
		stack: error.stack,
	})

	// Handle validation errors
	if (error.validation) {
		return reply.status(400).send({
			error: 'Validation Error',
			message: error.message,
			statusCode: 400,
			details: error.validation,
		})
	}

	// Handle Prisma errors
	if (error.name === 'PrismaClientKnownRequestError') {
		// Unique constraint violation
		if (error.code === 'P2002') {
			return reply.status(409).send({
				error: 'Conflict',
				message: 'Resource already exists',
				statusCode: 409,
			})
		}
		// Record not found
		if (error.code === 'P2025') {
			return reply.status(404).send({
				error: 'Not Found',
				message: 'Resource not found',
				statusCode: 404,
			})
		}
	}

	// Handle JWT errors
	if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
		return reply.status(401).send({
			error: 'Unauthorized',
			message: 'Invalid or expired token',
			statusCode: 401,
		})
	}

	// Default error response
	const statusCode = error.statusCode || 500
	return reply.status(statusCode).send({
		error: error.name || 'Internal Server Error',
		message: error.message || 'An unexpected error occurred',
		statusCode,
	})
}


import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '../utils/auth'
import { redis } from '../utils/redis'
import type { JWTPayload } from '../../../common/models'

export interface AuthenticatedRequest extends FastifyRequest {
	user?: JWTPayload
}

export async function authenticate(
	request: AuthenticatedRequest,
	reply: FastifyReply
): Promise<void> {
	try {
		const authHeader = request.headers.authorization

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return reply.status(401).send({
				error: 'Unauthorized',
				message: 'Missing or invalid authorization header',
				statusCode: 401,
			})
		}

		const token = authHeader.substring(7)
		const payload = verifyToken(token)

		// Check if token is blacklisted in Redis
		const isBlacklisted = await redis.get(`blacklist:${token}`)
		if (isBlacklisted) {
			return reply.status(401).send({
				error: 'Unauthorized',
				message: 'Token has been revoked',
				statusCode: 401,
			})
		}

		request.user = payload
	} catch (error) {
		return reply.status(401).send({
			error: 'Unauthorized',
			message: 'Invalid or expired token',
			statusCode: 401,
		})
	}
}


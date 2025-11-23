import { FastifyInstance } from 'fastify'
import { registerSchema, loginSchema, meSchema, logoutSchema } from '../../schemas'
import { prisma } from '../utils/db'
import { hashPassword, comparePassword, generateToken } from '../utils/auth'
import { redis } from '../utils/redis'
import { authenticate, type AuthenticatedRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

export async function authRoutes(fastify: FastifyInstance) {
	// POST /api/auth/register
	fastify.post<{ Body: { username: string; password: string } }>(
		'/register',
		{ schema: registerSchema },
		async (request, reply) => {
			const { username, password } = request.body

			try {
				// Check if username already exists
				const existingUser = await prisma.user.findUnique({
					where: { username },
				})

				if (existingUser) {
					return reply.status(409).send({
						error: 'Conflict',
						message: 'Username already exists',
						statusCode: 409,
					})
				}

				// Hash password
				const hashedPassword = await hashPassword(password)

				// Create user
				const now = new Date().toISOString()
				const user = await prisma.user.create({
					data: {
						username,
						password: hashedPassword,
						createdAt: now,
						updatedAt: now,
					},
				})

				logger.info(`User registered: ${username}`)

				return reply.status(201).send({
					message: 'User registered successfully',
					user: {
						id: user.id,
						username: user.username,
						createdAt: user.createdAt,
					},
				})
			} catch (error) {
				logger.error('Registration error:', error)
				return reply.status(500).send({
					error: 'Internal Server Error',
					message: 'An error occurred during registration',
					statusCode: 500,
				})
			}
		}
	)

	// POST /api/auth/login
	fastify.post<{ Body: { username: string; password: string } }>(
		'/login',
		{ schema: loginSchema },
		async (request, reply) => {
			const { username, password } = request.body

			try {
				// Find user
				const user = await prisma.user.findUnique({
					where: { username },
				})

				if (!user) {
					return reply.status(401).send({
						error: 'Unauthorized',
						message: 'Invalid username or password',
						statusCode: 401,
					})
				}

				// Verify password
				const isValidPassword = await comparePassword(password, user.password)

				if (!isValidPassword) {
					return reply.status(401).send({
						error: 'Unauthorized',
						message: 'Invalid username or password',
						statusCode: 401,
					})
				}

				// Generate JWT token
				const token = generateToken({
					userId: user.id,
					username: user.username,
				})

				// Store session in Redis (optional, for token blacklisting)
				await redis.setex(`session:${user.id}`, 86400, token) // 24 hours

				logger.info(`User logged in: ${username}`)

				return reply.send({
					message: 'Login successful',
					token,
					user: {
						id: user.id,
						username: user.username,
					},
				})
			} catch (error) {
				logger.error('Login error:', error)
				return reply.status(500).send({
					error: 'Internal Server Error',
					message: 'An error occurred during login',
					statusCode: 500,
				})
			}
		}
	)

	// GET /api/auth/me
	fastify.get(
		'/me',
		{ schema: meSchema, preHandler: authenticate },
		async (request: AuthenticatedRequest, reply) => {
			try {
				const userId = request.user?.userId

				if (!userId) {
					return reply.status(401).send({
						error: 'Unauthorized',
						message: 'Invalid token',
						statusCode: 401,
					})
				}

				const user = await prisma.user.findUnique({
					where: { id: userId },
					select: {
						id: true,
						username: true,
						createdAt: true,
					},
				})

				if (!user) {
					return reply.status(401).send({
						error: 'Unauthorized',
						message: 'User not found',
						statusCode: 401,
					})
				}

				return reply.send({
					user: {
						id: user.id,
						username: user.username,
						createdAt: user.createdAt,
					},
				})
			} catch (error) {
				logger.error('Get user error:', error)
				return reply.status(500).send({
					error: 'Internal Server Error',
					message: 'An error occurred while fetching user information',
					statusCode: 500,
				})
			}
		}
	)

	// POST /api/auth/logout
	fastify.post(
		'/logout',
		{ schema: logoutSchema, preHandler: authenticate },
		async (request: AuthenticatedRequest, reply) => {
			try {
				const authHeader = request.headers.authorization
				const token = authHeader?.substring(7)

				if (token) {
					// Blacklist token in Redis
					const payload = request.user
					if (payload) {
						await redis.setex(`blacklist:${token}`, 86400, '1') // 24 hours
						await redis.del(`session:${payload.userId}`)
					}
				}

				logger.info(`User logged out: ${request.user?.username}`)

				return reply.send({
					message: 'Logout successful',
				})
			} catch (error) {
				logger.error('Logout error:', error)
				return reply.status(500).send({
					error: 'Internal Server Error',
					message: 'An error occurred during logout',
					statusCode: 500,
				})
			}
		}
	)
}


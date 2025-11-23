import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import dotenv from 'dotenv'
import { authRoutes } from './routes/auth'
import { errorHandler } from './utils/error-handler'
import { logger } from './utils/logger'

dotenv.config()

const app = Fastify({
	logger: false, // We'll use Winston for logging
})

// Register plugins
async function buildApp() {
	// Security
	await app.register(helmet, {
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				scriptSrc: ["'self'"],
				imgSrc: ["'self'", 'data:', 'https:'],
			},
		},
	})

	// CORS
	await app.register(cors, {
		origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
		credentials: true,
	})

	// Error handler
	app.setErrorHandler(errorHandler)

	// Health check
	app.get('/health', async () => {
		return { status: 'ok', timestamp: new Date().toISOString() }
	})

	// API routes
	await app.register(authRoutes, { prefix: '/api/auth' })

	return app
}

// Start server
async function start() {
	try {
		const app = await buildApp()
		const port = Number(process.env.PORT) || 3001
		const host = process.env.HOST || '0.0.0.0'

		await app.listen({ port, host })
		logger.info(`Server listening on http://${host}:${port}`)
	} catch (err) {
		logger.error('Error starting server:', err)
		process.exit(1)
	}
}

start()


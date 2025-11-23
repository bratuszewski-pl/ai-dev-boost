import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined
}

export const prisma =
	globalThis.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	})

if (process.env.NODE_ENV !== 'production') {
	globalThis.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
	await prisma.$disconnect()
	logger.info('Database connection closed')
})


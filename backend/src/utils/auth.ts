import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { JWTPayload } from '../../../common/models'

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10)
}

export async function comparePassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	})
}

export function verifyToken(token: string): JWTPayload {
	return jwt.verify(token, JWT_SECRET) as JWTPayload
}


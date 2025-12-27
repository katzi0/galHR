import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export interface TokenPayload {
  userId: string
  role: Role
}

export function createToken(userId: string, role: Role): string {
  return jwt.sign(
    { userId, role } as TokenPayload,
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function requireAdmin(token: string): TokenPayload | null {
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'ADMIN') {
    return null
  }
  return payload
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}


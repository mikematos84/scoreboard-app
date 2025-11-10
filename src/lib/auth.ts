import { UserRole } from '@/generated/prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d'; // 7 days

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function getTokenFromRequest(request: Request): Promise<string | null> {
  // First check Authorization header (for API clients that might use it)
  const authHeader = request.headers.get('authorization');
  
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Then check cookies (for browser clients)
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return token || null;
}
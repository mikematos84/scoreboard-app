import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './auth';
import { UserRole } from '@/generated/prisma/client';

export function requireAuth(request: Request) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }

  return payload; // Return user payload if valid
}

export function requireRole(request: Request, allowedRoles: UserRole[]) {
  const user = requireAuth(request);
  
  if (user instanceof NextResponse) {
    return user; // Error response
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    );
  }

  return user;
}
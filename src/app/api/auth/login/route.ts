import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    // On Vercel, always use HTTPS, so secure should be true in production
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = isProduction || process.env.VERCEL === '1';
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: isSecure, // Send over HTTPS in production/Vercel
      sameSite: 'lax', // More permissive than 'strict' but still secure - works better with Vercel
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
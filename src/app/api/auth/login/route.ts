import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

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
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = isProduction || process.env.VERCEL === '1';
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response;
  } catch (error) {
    // Enhanced error logging for Vercel
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('Login error details:', {
      message: errorMessage,
      name: errorName,
      stack: errorStack,
      // Log environment info for debugging
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      // Check if it's a Prisma error
      isPrismaError: errorName.includes('Prisma') || errorMessage.includes('Prisma'),
    });
    
    // Return error details in response for debugging (you can remove this in production)
    return NextResponse.json(
      { 
        error: 'Login failed',
        // Include error details for debugging on Vercel
        details: process.env.VERCEL ? {
          message: errorMessage,
          name: errorName,
          isPrismaError: errorName.includes('Prisma') || errorMessage.includes('Prisma'),
        } : undefined
      },
      { status: 500 }
    );
  }
}
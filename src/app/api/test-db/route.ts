import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Simple test query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      prismaClientInitialized: !!prisma,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('Database test error:', {
      message: errorMessage,
      name: errorName,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        name: errorName,
        isPrismaError: errorName.includes('Prisma') || errorMessage.includes('Prisma'),
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const token = await getTokenFromRequest(request);

        if(!token){
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);

        if(!payload){
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            }
        });

        if(!user){
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json(
            { error: 'Auth check failed' },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';

export async function POST(){
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = isProduction || process.env.VERCEL === '1';
    
    response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: isSecure, // Send over HTTPS in production/Vercel
        sameSite: 'lax', // More permissive than 'strict' but still secure - works better with Vercel
        path: '/',
        maxAge: 0,
    })

    return response;
}
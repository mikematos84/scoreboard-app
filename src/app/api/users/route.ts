import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@/generated/prisma/client";


const prisma = new PrismaClient();

export async function GET(request: Request) {
    const users = await prisma.user.findMany({
    });
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const data = await request.json();
    const user = await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: data.password,
            role: data.role || UserRole.PLAYER,
        }
    });
    return NextResponse.json(user);
}
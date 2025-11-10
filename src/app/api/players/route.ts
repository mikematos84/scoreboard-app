import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@/generated/prisma/client";
import { requireAuth, requireRole } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
        return user; // Error response
    }
    
    const players = await prisma.player.findMany({
        include: {teams: true}
    });
    
    return NextResponse.json(players);
}

export async function POST(request: Request) {
    // Require authentication + admin role
    const user = await requireRole(request, [UserRole.ADMIN, UserRole.COACH]);
    if (user instanceof NextResponse) {
      return user; // Error response
    }
  
    const data = await request.json();
    const player = await prisma.player.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            position: data.position,
            jerseyNumber: data.jerseyNumber,
        }
    });
    return NextResponse.json(player);
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's household
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { household: true }
    });

    if (!user?.household) {
      return NextResponse.json({ error: "No household found" }, { status: 404 });
    }

    // Get all kids for the household
    const kids = await prisma.kid.findMany({
      where: { householdId: user.household.id },
      select: {
        id: true,
        displayName: true,
        avatar: true,
        level: true,
        xp: true,
        coins: true,
        createdAt: true
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(kids);
  } catch (error) {
    console.error("Error fetching kids:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
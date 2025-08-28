import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { kidId } = body;

    if (!kidId) {
      return NextResponse.json({ error: "Kid ID is required" }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { household: true }
    });

    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "user@example.com", // We'll get this from Clerk later
          role: "PARENT"
        },
        include: { household: true }
      });
    }

    if (!user?.household) {
      // Create a default household for the user if none exists
      const household = await prisma.household.create({
        data: {
          name: "Mijn Gezin",
          locale: "nl",
          ownerId: user.id
        }
      });
      
      // Update the user object for this request
      user.household = household;
    }

    // Get the chore
    const chore = await prisma.chore.findUnique({
      where: { 
        id: params.id,
        householdId: user.household.id
      }
    });

    if (!chore) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 });
    }

    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingCompletion = await prisma.completion.findFirst({
      where: {
        choreId: params.id,
        kidId,
        createdAt: {
          gte: today
        }
      }
    });

    if (existingCompletion) {
      return NextResponse.json({ error: "Chore already completed today" }, { status: 400 });
    }

    // Create completion record
    const completion = await prisma.completion.create({
      data: {
        choreId: params.id,
        kidId,
        xpEarned: chore.baseXp,
        coinsEarned: chore.baseCoins,
        approved: true // Auto-approve for now, can be made configurable later
      }
    });

    // Update kid's XP and coins
    await prisma.kid.update({
      where: { id: kidId },
      data: {
        xp: { increment: chore.baseXp },
        coins: { increment: chore.baseCoins }
      }
    });

    // Check if kid leveled up (every 100 XP = 1 level)
    const kid = await prisma.kid.findUnique({
      where: { id: kidId }
    });

    if (kid) {
      const newLevel = Math.floor((kid.xp + chore.baseXp) / 100) + 1;
      if (newLevel > kid.level) {
        await prisma.kid.update({
          where: { id: kidId },
          data: { level: newLevel }
        });
      }
    }

    return NextResponse.json(completion, { status: 201 });
  } catch (error) {
    console.error("Error completing chore:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
export const dynamic = "force-dynamic";


export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `chores:[id]:complete:POST:${ip}`, limit: 20, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const choreId = params.id;

    // Find the chore
    const chore = await prisma.chore.findUnique({
      where: { id: choreId },
      include: { kid: true }
    });

    if (!chore) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 });
    }

    // Check if user has access to this chore (through household)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        household: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            ownerId: true,
            name: true,
            locale: true,
          }
        }
      }
    });

    if (!user?.household || chore.kid?.householdId !== user.household.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Create completion record
    const completion = await prisma.completion.create({
      data: {
        choreId: choreId,
        kidId: chore.kidId!,
        approved: false, // Parent needs to approve
        xpEarned: chore.baseXp,
        coinsEarned: chore.baseCoins,
      }
    });

    // Update kid's XP and coins
    await prisma.kid.update({
      where: { id: chore.kidId! },
      data: {
        xp: { increment: chore.baseXp },
        coins: { increment: chore.baseCoins }
      }
    });

    return NextResponse.json({
      success: true,
      completion,
      message: "Chore completed successfully! Waiting for parent approval."
    });

  } catch (error) {
    console.error("Error completing chore:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 

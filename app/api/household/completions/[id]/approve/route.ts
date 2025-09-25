import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
export const runtime = "edge";

export const dynamic = "force-dynamic";


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
    const { approved } = body;

    if (typeof approved !== "boolean") {
      return NextResponse.json(
        { error: "Approved status is required" },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
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

    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "user@example.com", // We'll get this from Clerk later
          role: "PARENT"
        },
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

    // Get the completion and verify it belongs to the user's household
    const completion = await prisma.completion.findFirst({
      where: {
        id: params.id,
        chore: {
          householdId: user.household.id
        }
      },
      include: {
        chore: true,
        kid: true
      }
    });

    if (!completion) {
      return NextResponse.json({ error: "Completion not found" }, { status: 404 });
    }

    // Update the completion approval status
    const updatedCompletion = await prisma.completion.update({
      where: { id: params.id },
      data: { approved }
    });

    // If approved, update the kid's XP and coins
    if (approved) {
      await prisma.kid.update({
        where: { id: completion.kidId },
        data: {
          xp: { increment: completion.xpEarned },
          coins: { increment: completion.coinsEarned }
        }
      });

      // Check if kid leveled up (every 100 XP = 1 level)
      const kid = await prisma.kid.findUnique({
        where: { id: completion.kidId }
      });

      if (kid) {
        const newLevel = Math.floor((kid.xp + completion.xpEarned) / 100) + 1;
        if (newLevel > kid.level) {
          await prisma.kid.update({
            where: { id: completion.kidId },
            data: { level: newLevel }
          });
        }
      }
    }

    return NextResponse.json({ success: true, completion: updatedCompletion });
  } catch (error) {
    console.error("Error updating completion approval:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 


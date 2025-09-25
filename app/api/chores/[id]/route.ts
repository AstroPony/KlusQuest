import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { choreUpdateSchema } from "@/lib/schemas";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { z } from "zod";
export const dynamic = "force-dynamic";


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `chores:[id]:PUT:${ip}`, limit: 30, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idCheck = z.object({ id: z.string().min(1) }).safeParse(params);
    if (!idCheck.success) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = choreUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const { title, description, frequency, kidId, baseXp, baseCoins, active } = parsed.data;

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

    // Update the chore
    const chore = await prisma.chore.update({
      where: { 
        id: params.id,
        householdId: user.household.id // Ensure chore belongs to user's household
      },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(frequency !== undefined ? { frequency } : {}),
        ...(kidId !== undefined ? { kidId: kidId } : {}),
        ...(baseXp !== undefined ? { baseXp } : {}),
        ...(baseCoins !== undefined ? { baseCoins } : {}),
        ...(active !== undefined ? { active } : {}),
      },
      include: {
        kid: {
          select: {
            id: true,
            displayName: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json(chore);
  } catch (error) {
    console.error("Error updating chore:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `chores:[id]:DELETE:${ip}`, limit: 20, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Soft delete by setting active to false
    await prisma.chore.update({
      where: { 
        id: params.id,
        householdId: user.household.id // Ensure chore belongs to user's household
      },
      data: { active: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chore:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 

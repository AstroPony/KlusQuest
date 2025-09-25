import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
export const dynamic = "force-dynamic";


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `kids:PUT:${ip}`, limit: 30, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { displayName, avatar } = body;

    if (!displayName || displayName.trim().length < 2) {
      return NextResponse.json(
        { error: "Display name must be at least 2 characters" },
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

    // Verify the kid belongs to the user's household
    const existingKid = await prisma.kid.findFirst({
      where: {
        id: params.id,
        householdId: user.household.id
      }
    });

    if (!existingKid) {
      return NextResponse.json({ error: "Kid not found" }, { status: 404 });
    }

    // Update the kid
    const updatedKid = await prisma.kid.update({
      where: { id: params.id },
      data: {
        displayName: displayName,
        avatar: avatar || "??"
      },
      select: {
        id: true,
        displayName: true,
        avatar: true,
        level: true,
        xp: true,
        coins: true,
        createdAt: true
      }
    });

    return NextResponse.json(updatedKid);
  } catch (error) {
    console.error("Error updating kid:", error);
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
    const rl = rateLimit({ key: `kids:DELETE:${ip}`, limit: 20, windowMs: 60_000 });
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

    // Verify the kid belongs to the user's household
    const existingKid = await prisma.kid.findFirst({
      where: {
        id: params.id,
        householdId: user.household.id
      }
    });

    if (!existingKid) {
      return NextResponse.json({ error: "Kid not found" }, { status: 404 });
    }

    // Delete the kid (this will cascade to related records)
    await prisma.kid.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting kid:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 




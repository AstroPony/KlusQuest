import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `kids:GET:${ip}`, limit: 60, windowMs: 60_000 });
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

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `kids:POST:${ip}`, limit: 20, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const schema = z.object({
      displayName: z.string().trim().min(2).max(50),
      avatar: z.string().trim().max(64).optional(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const { displayName, avatar } = parsed.data;

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

    // Create the kid
    const kid = await prisma.kid.create({
      data: {
        displayName: displayName,
        avatar: avatar || "??",
        householdId: user.household.id,
        level: 1,
        xp: 0,
        coins: 0
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

    return NextResponse.json(kid, { status: 201 });
  } catch (error) {
    console.error("Error creating kid:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 

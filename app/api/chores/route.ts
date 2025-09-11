import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { choreCreateSchema } from "@/lib/schemas";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `chores:GET:${ip}`, limit: 60, windowMs: 60_000 });
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

    console.log("User found:", user?.id, "Clerk ID:", userId, "Household:", user?.household?.id);

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
      console.log("Created new user:", user.id);
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
      
      console.log("Created default household:", household.id);
      
      console.log("Created default household:", household.id);
      
      // Update the user object for this request
      user.household = household;
    }

    // Get all chores for the household
    const chores = await prisma.chore.findMany({
      where: { 
        householdId: user.household.id,
        active: true 
      },
      include: {
        kid: {
          select: {
            id: true,
            displayName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Add completions for today to each chore
    const choresWithCompletions = await Promise.all(
      chores.map(async (chore: any) => {
        const todayCompletions = await prisma.completion.findMany({
          where: {
            choreId: chore.id,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today
            }
          }
        });
        
        return {
          ...chore,
          completions: todayCompletions
        };
      })
    );

    return NextResponse.json(choresWithCompletions);
  } catch (error) {
    console.error("Error fetching chores:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `chores:POST:${ip}`, limit: 20, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = choreCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { title, description, frequency, kidId, baseXp, baseCoins } = parsed.data;

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

    console.log("POST - User found:", user?.id, "Clerk ID:", userId, "Household:", user?.household?.id);

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
      console.log("POST - Created new user:", user.id);
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
      
      console.log("POST - Created default household:", household.id);
      
      // Update the user object for this request
      user.household = household;
    }

    // Ensure we have the household ID for chore creation
    const householdId = user.household?.id;
    if (!householdId) {
      return NextResponse.json(
        { error: "Failed to create or retrieve household" },
        { status: 500 }
      );
    }

    // Validate kidId if provided
    if (kidId) {
      const kid = await prisma.kid.findFirst({
        where: {
          id: kidId,
          householdId: householdId
        }
      });
      
      if (!kid) {
        return NextResponse.json(
          { error: "Kid not found or doesn't belong to your household" },
          { status: 400 }
        );
      }
    }

    // Create the chore
    const chore = await prisma.chore.create({
      data: {
        title,
        description,
        frequency,
        kidId: kidId || null,
        baseXp: baseXp ?? 10,
        baseCoins: baseCoins ?? 1,
        householdId: householdId,
        nextDueAt: new Date()
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

    return NextResponse.json(chore, { status: 201 });
  } catch (error) {
    console.error("Error creating chore:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 

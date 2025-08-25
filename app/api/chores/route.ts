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

    console.log("User found:", user?.id, "Household:", user?.household?.id);

    if (!user?.household) {
      // Create a default household for the user if none exists
      const household = await prisma.household.create({
        data: {
          name: "Mijn Gezin",
          locale: "nl",
          ownerId: userId
        }
      });
      
      console.log("Created default household:", household.id);
      
      // Update user to have this household
      await prisma.user.update({
        where: { id: userId },
        data: { householdId: household.id }
      });
      
      console.log("Updated user with household");
      
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, frequency, kidId, baseXp, baseCoins } = body;

    if (!title || !frequency) {
      return NextResponse.json(
        { error: "Title and frequency are required" },
        { status: 400 }
      );
    }

    // Get user's household
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { household: true }
    });

    console.log("POST - User found:", user?.id, "Household:", user?.household?.id);

    if (!user?.household) {
      // Create a default household for the user if none exists
      const household = await prisma.household.create({
        data: {
          name: "Mijn Gezin",
          locale: "nl",
          ownerId: userId
        }
      });
      
      console.log("POST - Created default household:", household.id);
      
      // Update user to have this household
      await prisma.user.update({
        where: { id: userId },
        data: { householdId: household.id }
      });
      
      console.log("POST - Updated user with household");
      
      // Update the user object for this request
      user.household = household;
    }

    // Create the chore
    const chore = await prisma.chore.create({
      data: {
        title,
        description,
        frequency,
        kidId: kidId || null,
        baseXp: baseXp || 10,
        baseCoins: baseCoins || 1,
        householdId: user.household.id,
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
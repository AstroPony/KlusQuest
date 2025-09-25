import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
export const dynamic = "force-dynamic";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Get chores assigned to this kid
    const chores = await prisma.chore.findMany({
      where: { 
        householdId: user.household.id,
        kidId: params.id,
        active: true 
      },
      orderBy: { createdAt: "desc" }
    });

    // Add completion status for today to each chore
    const choresWithCompletions = await Promise.all(
      chores.map(async (chore: any) => {
        const todayCompletions = await prisma.completion.findMany({
          where: {
            choreId: chore.id,
            kidId: params.id,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today
            }
          }
        });
        
        return {
          ...chore,
          completed: todayCompletions.length > 0,
          completions: todayCompletions
        };
      })
    );

    return NextResponse.json(choresWithCompletions);
  } catch (error) {
    console.error("Error fetching kid chores:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Get household statistics
    const [
      totalKids,
      totalChores,
      completedToday,
      totalXP,
      totalCoins
    ] = await Promise.all([
      // Count kids
      prisma.kid.count({
        where: { householdId: user.household.id }
      }),
      
      // Count active chores
      prisma.chore.count({
        where: { 
          householdId: user.household.id,
          active: true
        }
      }),
      
      // Count completions today
      prisma.completion.count({
        where: {
          chore: {
            householdId: user.household.id
          },
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today
          }
        }
      }),
      
      // Sum total XP
      prisma.kid.aggregate({
        where: { householdId: user.household.id },
        _sum: { xp: true }
      }),
      
      // Sum total coins
      prisma.kid.aggregate({
        where: { householdId: user.household.id },
        _sum: { coins: true }
      })
    ]);

    // Calculate completion rate
    const completionRate = totalChores > 0 ? completedToday / totalChores : 0;

    const stats = {
      totalKids,
      totalChores,
      completedToday,
      totalXP: totalXP._sum.xp || 0,
      totalCoins: totalCoins._sum.coins || 0,
      completionRate
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching household stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
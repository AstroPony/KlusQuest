import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's household to verify ownership
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { household: true }
    });

    if (!user?.household) {
      return NextResponse.json({ error: "No household found" }, { status: 404 });
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
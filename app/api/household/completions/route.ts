import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
export const runtime = "edge";


export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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
          },
        },
      },
    });

    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "user@example.com", // We'll get this from Clerk later
          role: "PARENT",
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
            },
          },
        },
      });
    }

    if (!user?.household) {
      // Create a default household for the user if none exists
      const household = await prisma.household.create({
        data: {
          name: "Mijn Gezin",
          locale: "nl",
          ownerId: user.id,
        },
      });

      // Update the user object for this request
      user.household = household;
    }

    // Get chore completions for the household
    const completions = await prisma.completion.findMany({
      where: {
        chore: {
          householdId: user.household.id,
        },
      },
      include: {
        chore: {
          select: {
            id: true,
            title: true,
          },
        },
        kid: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform the data to match the frontend interface
    const transformedCompletions = completions.map((completion) => ({
      id: completion.id,
      choreId: completion.choreId,
      choreTitle: completion.chore.title,
      kidId: completion.kidId,
      kidName: completion.kid.displayName,
      kidAvatar: completion.kid.avatar,
      xpEarned: completion.xpEarned,
      coinsEarned: completion.coinsEarned,
      createdAt: completion.createdAt.toISOString(),
      approved: completion.approved,
    }));

    return NextResponse.json(transformedCompletions);
  } catch (error) {
    console.error("Error fetching completions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


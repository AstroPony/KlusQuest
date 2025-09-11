import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user?.household) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 });
    }

    // Get all kids in the household
    const kids = await prisma.kid.findMany({
      where: { householdId: user.household.id }
    });

    if (kids.length === 0) {
      return NextResponse.json({ error: "No kids found in household" }, { status: 400 });
    }

    // Mock chores data
    const mockChores = [
      {
        title: "Kamer opruimen",
        description: "Ruim je kamer op en maak je bed op",
        frequency: "DAILY",
        baseXp: 15,
        baseCoins: 2,
        kidId: kids[0].id
      },
      {
        title: "Tafel afruimen",
        description: "Help met het afruimen van de eettafel",
        frequency: "DAILY",
        baseXp: 10,
        baseCoins: 1,
        kidId: kids[0].id
      },
      {
        title: "Afval weggooien",
        description: "Gooi het afval weg en vervang de vuilniszak",
        frequency: "WEEKLY",
        baseXp: 20,
        baseCoins: 3,
        kidId: kids[0].id
      },
      {
        title: "Planten water geven",
        description: "Geef alle planten in huis water",
        frequency: "WEEKLY",
        baseXp: 25,
        baseCoins: 4,
        kidId: kids[0].id
      },
      {
        title: "Wasmachine legen",
        description: "Haal de was uit de wasmachine en hang het op",
        frequency: "WEEKLY",
        baseXp: 30,
        baseCoins: 5,
        kidId: kids[0].id
      }
    ];

    // If there are multiple kids, create some chores for the second kid too
    if (kids.length > 1) {
      const secondKidChores = [
        {
          title: "Kamer opruimen",
          description: "Ruim je kamer op en maak je bed op",
          frequency: "DAILY",
          baseXp: 15,
          baseCoins: 2,
          kidId: kids[1].id
        },
        {
          title: "Tafel afruimen",
          description: "Help met het afruimen van de eettafel",
          frequency: "DAILY",
          baseXp: 10,
          baseCoins: 1,
          kidId: kids[1].id
        },
        {
          title: "Hond uitlaten",
          description: "Neem de hond mee voor een wandeling",
          frequency: "DAILY",
          baseXp: 35,
          baseCoins: 6,
          kidId: kids[1].id
        }
      ];
      mockChores.push(...secondKidChores);
    }

    // Create all mock chores
    const createdChores = await Promise.all(
      mockChores.map(chore => 
        prisma.chore.create({
          data: {
            ...chore,
            householdId: user.household!.id, // We know it exists due to the check above
            nextDueAt: new Date(),
            active: true
          }
        })
      )
    );

    return NextResponse.json({
      message: `${createdChores.length} mock klussen aangemaakt`,
      chores: createdChores
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating mock chores:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 

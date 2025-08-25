import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, frequency, kidId, baseXp, baseCoins, active } = body;

    // Get user's household to verify ownership
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { household: true }
    });

    if (!user?.household) {
      return NextResponse.json({ error: "No household found" }, { status: 404 });
    }

    // Update the chore
    const chore = await prisma.chore.update({
      where: { 
        id: params.id,
        householdId: user.household.id // Ensure chore belongs to user's household
      },
      data: {
        title,
        description,
        frequency,
        kidId: kidId || null,
        baseXp,
        baseCoins,
        active
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
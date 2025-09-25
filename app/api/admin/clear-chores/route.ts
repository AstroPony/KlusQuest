import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export function GET() {
  return NextResponse.json({ ok: true, message: "Use POST to clear chores" });
}

export async function POST(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
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

    if (!user?.household) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 });
    }

    const householdId = user.household.id;

    const choreIds = (
      await prisma.chore.findMany({ where: { householdId }, select: { id: true } })
    ).map((c) => c.id);

    if (choreIds.length) {
      await prisma.completion.deleteMany({ where: { choreId: { in: choreIds } } });
    }

    const deleted = await prisma.chore.deleteMany({ where: { householdId } });

    return NextResponse.json({ success: true, deletedChores: deleted.count });
  } catch (error) {
    console.error("Error clearing chores:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

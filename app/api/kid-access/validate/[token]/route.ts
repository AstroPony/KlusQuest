import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
export const runtime = "edge";

export const dynamic = "force-dynamic";


export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    // Decode the token to get kid ID and household ID
    let decodedToken: string;
    try {
      decodedToken = Buffer.from(params.token, 'base64').toString('utf-8');
    } catch {
      return NextResponse.json({ error: "Invalid invite token" }, { status: 404 });
    }

    const [kidId, householdId, timestamp] = decodedToken.split(':');
    
    if (!kidId || !householdId || !timestamp) {
      return NextResponse.json({ error: "Invalid invite token format" }, { status: 404 });
    }

    // Check if token is expired (30 days)
    const tokenDate = new Date(parseInt(timestamp));
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    if (tokenDate < thirtyDaysAgo) {
      return NextResponse.json({ error: "Invite expired" }, { status: 410 });
    }

    // Get the kid and household data
    const kid = await prisma.kid.findUnique({
      where: { 
        id: kidId,
        householdId: householdId
      }
    });

    if (!kid) {
      return NextResponse.json({ error: "Kid not found" }, { status: 404 });
    }

    const household = await prisma.household.findUnique({
      where: { id: householdId },
      select: { id: true, name: true }
    });

    if (!household) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 });
    }

    // Return kid data
    return NextResponse.json({
      kid: {
        id: kid.id,
        displayName: kid.displayName,
        avatar: kid.avatar,
        level: kid.level,
        xp: kid.xp,
        coins: kid.coins
      },
      household: household
    });

  } catch (error) {
    console.error("Error validating kid access:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 


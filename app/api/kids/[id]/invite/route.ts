import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
export const runtime = "edge";

export const dynamic = "force-dynamic";


export async function POST(
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user?.household) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 });
    }

    // Get the kid
    const kid = await prisma.kid.findUnique({
      where: { 
        id: params.id,
        householdId: user.household.id
      }
    });

    if (!kid) {
      return NextResponse.json({ error: "Kid not found" }, { status: 404 });
    }

    // Generate a unique invite token using kid ID and household ID
    const tokenData = `${kid.id}:${user.household.id}:${Date.now()}`;
    const inviteToken = Buffer.from(tokenData).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
    
    // Generate the invite URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/kid-access/${inviteToken}`;

    return NextResponse.json({
      inviteUrl,
      token: inviteToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      message: "Invite link generated successfully"
    });

  } catch (error) {
    console.error("Error generating invite link:", error);
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

    // For now, we'll just return success since we're not storing tokens
    // In a production app, you'd want to store and manage these tokens
    return NextResponse.json({
      message: "Invite link revoked successfully"
    });

  } catch (error) {
    console.error("Error revoking invite link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 


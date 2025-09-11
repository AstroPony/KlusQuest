import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const bodySchema = z.object({ kidId: z.string().min(1) });

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `games:win:${params.id}:${ip}`, limit: 30, windowMs: 60_000 });
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { kidId } = parsed.data;

    const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { household: true } });
    if (!user?.household) return NextResponse.json({ error: "No household" }, { status: 400 });

    const kid = await prisma.kid.findFirst({ where: { id: kidId, householdId: user.household.id } });
    if (!kid) return NextResponse.json({ error: "Kid not found" }, { status: 404 });

    const gameId = params.id;

    // Find top-ranked active luxury for this game that hasn't been granted
    const luxuries = await prisma.luxury.findMany({
      where: { kidId, assignedGame: gameId, active: true },
      orderBy: { rank: "asc" },
    });

    let granted: any = null;
    for (const lux of luxuries) {
      const already = await prisma.luxuryGrant.findFirst({ where: { kidId, luxuryId: lux.id, status: "GRANTED" } });
      if (!already) {
        const grant = await prisma.luxuryGrant.create({
          data: {
            kidId,
            luxuryId: lux.id,
            status: "GRANTED",
          },
          include: { luxury: true },
        });
        granted = grant;
        break;
      }
    }

    return NextResponse.json({
      success: true,
      granted,
      message: granted ? `Unlocked luxury: ${granted.luxury.title}` : "No luxury assigned for this game or all already granted",
    });
  } catch (err) {
    console.error("Error processing game win:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


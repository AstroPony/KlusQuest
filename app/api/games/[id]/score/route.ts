import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const postSchema = z.object({
  kidId: z.string().min(1),
  score: z.number().int().nonnegative(),
  durationSeconds: z.number().int().nonnegative().optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `games:score:${params.id}:${ip}`, limit: 60, windowMs: 60_000 });
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await request.json();
    const parsed = postSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { kidId, score, durationSeconds } = parsed.data;

    const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { household: true } });
    if (!user?.household) return NextResponse.json({ error: "No household" }, { status: 400 });

    const kid = await prisma.kid.findFirst({ where: { id: kidId, householdId: user.household.id } });
    if (!kid) return NextResponse.json({ error: "Kid not found" }, { status: 404 });

    const gameId = params.id;

    const attempt = await prisma.gameScore.create({
      data: { kidId, gameId, score, durationSeconds },
    });

    const best = await prisma.gameScore.aggregate({
      where: { kidId, gameId },
      _max: { score: true },
      _count: true,
    });

    return NextResponse.json({ success: true, attempt, bestScore: best._max.score ?? score, attempts: best._count });
  } catch (err) {
    console.error("Error saving game score:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Return best score and up to 5 recent attempts for this kid + game
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const kidId = searchParams.get("kidId");
    if (!kidId) return NextResponse.json({ error: "kidId required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { household: true } });
    if (!user?.household) return NextResponse.json({ error: "No household" }, { status: 400 });

    const kid = await prisma.kid.findFirst({ where: { id: kidId, householdId: user.household.id } });
    if (!kid) return NextResponse.json({ error: "Kid not found" }, { status: 404 });

    const gameId = params.id;

    const recent = await prisma.gameScore.findMany({
      where: { kidId, gameId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const best = await prisma.gameScore.aggregate({
      where: { kidId, gameId },
      _max: { score: true },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      bestScore: best._max.score ?? 0,
      attempts: best._count,
      recent,
    });
  } catch (err) {
    console.error("Error fetching game scores:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


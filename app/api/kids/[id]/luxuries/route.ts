import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const luxurySchema = z.object({
  title: z.string().trim().min(2).max(100),
  type: z.enum(["TIME", "ITEM", "PRIVILEGE"]).default("ITEM"),
  minutes: z.number().int().min(1).max(240).optional(),
  rank: z.number().int().min(1).max(4),
  assignedGame: z.enum(["reaction", "memory", "math", "mole", "memory-match", "color-sort", "number-puzzle", "word-scramble"]).default("memory"),
  active: z.boolean().optional().default(true),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `luxuries:GET:${ip}`, limit: 60, windowMs: 60_000 });
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { household: true },
    });
    if (!user?.household) return NextResponse.json({ error: "No household" }, { status: 400 });

    const kid = await prisma.kid.findFirst({ where: { id: params.id, householdId: user.household.id } });
    if (!kid) return NextResponse.json({ error: "Kid not found" }, { status: 404 });

    const luxuries = await prisma.luxury.findMany({
      where: { kidId: kid.id, active: true },
      orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(luxuries);
  } catch (err) {
    console.error("Error fetching luxuries:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit({ key: `luxuries:POST:${ip}`, limit: 20, windowMs: 60_000 });
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { household: true },
    });
    if (!user?.household) return NextResponse.json({ error: "No household" }, { status: 400 });

    const kid = await prisma.kid.findFirst({ where: { id: params.id, householdId: user.household.id } });
    if (!kid) return NextResponse.json({ error: "Kid not found" }, { status: 404 });

    const json = await request.json();
    const data = Array.isArray(json) ? json : [json];
    const parsed = z.array(luxurySchema).max(4).safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    // Upsert up to 4 luxuries by rank for this kid
    const createdOrUpdated = await Promise.all(
      parsed.data.map(async (l) => {
        const existing = await prisma.luxury.findFirst({
          where: { kidId: kid.id, rank: l.rank },
        });
        if (existing) {
          return prisma.luxury.update({
            where: { id: existing.id },
            data: {
              title: l.title,
              type: l.type,
              minutes: l.minutes ?? null,
              assignedGame: l.assignedGame,
              active: l.active,
            },
          });
        }
        return prisma.luxury.create({
          data: {
            householdId: user.household!.id,
            kidId: kid.id,
            title: l.title,
            type: l.type,
            minutes: l.minutes ?? null,
            rank: l.rank,
            assignedGame: l.assignedGame,
            active: l.active,
          },
        });
      })
    );

    return NextResponse.json(createdOrUpdated, { status: 201 });
  } catch (err) {
    console.error("Error saving luxuries:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

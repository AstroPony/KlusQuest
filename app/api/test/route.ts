import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const households = await prisma.household.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        name: true,
        locale: true,
        owner: {
          select: { id: true, email: true, role: true }
        },
        kids: {
          select: { id: true, displayName: true, level: true, xp: true, coins: true }
        },
        chores: {
          select: { id: true, title: true, frequency: true, active: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: households,
      message: 'Database connection successful'
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    )
  }
} 

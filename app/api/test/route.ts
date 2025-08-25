import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const households = await prisma.household.findMany({
      include: {
        owner: true,
        kids: true,
        chores: true
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
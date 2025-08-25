import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create a sample household
  const household = await prisma.household.create({
    data: {
      name: 'Demo Gezin',
      locale: 'nl',
      owner: {
        create: {
          email: 'demo@klusquest.nl',
          role: 'PARENT'
        }
      }
    }
  })

  console.log('✅ Created household:', household.name)

  // Create a sample kid
  const kid = await prisma.kid.create({
    data: {
      displayName: 'Demo Kid',
      level: 1,
      xp: 0,
      coins: 10,
      householdId: household.id
    }
  })

  console.log('✅ Created kid:', kid.displayName)

  // Create a sample chore
  const chore = await prisma.chore.create({
    data: {
      title: 'Tafel afruimen',
      description: 'Na het eten de tafel afruimen',
      frequency: 'DAILY',
      baseXp: 15,
      baseCoins: 2,
      householdId: household.id,
      kidId: kid.id
    }
  })

  console.log('✅ Created chore:', chore.title)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
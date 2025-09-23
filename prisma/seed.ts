import { prisma } from "../lib/db/prisma";

async function main() {
  console.log("Seeding KlusQuest demo data...");

  const user = await prisma.user.upsert({
    where: { email: "demo@klusquest.nl" },
    update: {},
    create: {
      clerkId: "demo-user-123",
      email: "demo@klusquest.nl",
      role: "PARENT",
    },
  });

  const household = await prisma.household.upsert({
    where: { ownerId: user.id },
    update: {},
    create: {
      name: "Demo Gezin",
      locale: "nl",
      ownerId: user.id,
    },
  });

  console.log(`Household ready: ${household.name}`);

  let kid = await prisma.kid.findFirst({
    where: { householdId: household.id, displayName: "Demo Kid" },
  });

  if (!kid) {
    kid = await prisma.kid.create({
      data: {
        displayName: "Demo Kid",
        level: 1,
        xp: 0,
        coins: 10,
        householdId: household.id,
      },
    });
    console.log(`Created kid: ${kid.displayName}`);
  } else {
    console.log(`Kid already exists: ${kid.displayName}`);
  }

  let chore = await prisma.chore.findFirst({
    where: { householdId: household.id, title: "Tafel afruimen" },
  });

  if (!chore) {
    chore = await prisma.chore.create({
      data: {
        title: "Tafel afruimen",
        description: "Na het eten de tafel afruimen",
        frequency: "DAILY",
        baseXp: 15,
        baseCoins: 2,
        householdId: household.id,
        kidId: kid.id,
      },
    });
    console.log(`Created chore: ${chore.title}`);
  } else {
    chore = await prisma.chore.update({
      where: { id: chore.id },
      data: {
        description: "Na het eten de tafel afruimen",
        frequency: "DAILY",
        baseXp: 15,
        baseCoins: 2,
        kidId: kid.id,
      },
    });
    console.log(`Updated chore: ${chore.title}`);
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
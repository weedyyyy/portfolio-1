import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [],
});

async function main() {
  try {
    // Seed personal info
    await prisma.personalInfo.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "Your Name",
        initials: "YN",
        url: "yourportfolio.com",
        location: "Your Location",
        locationLink: "https://maps.google.com",
        description: "Software Engineer",
        summary: "I am a passionate software engineer with experience in web development.",
        avatarUrl: "/IMG_2871.jpg"
      }
    });

    // Seed skills
    const skills = [
      { name: "React", icon: "react", category: "Frontend" },
      { name: "Next.js", icon: "nextjs", category: "Frontend" },
      { name: "TypeScript", icon: "typescript", category: "Frontend" },
      { name: "Node.js", icon: "nodejs", category: "Backend" },
      { name: "Prisma", icon: "database", category: "Backend" }
    ];

    for (const skill of skills) {
      await prisma.skill.upsert({
        where: { id: skills.indexOf(skill) + 1 },
        update: skill,
        create: skill
      });
    }

    console.log('Database has been seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Database connection successful");
    console.log("Users count:", users.length);
  } catch (err) {
    console.error("Database connection failed:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

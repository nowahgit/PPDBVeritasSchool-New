const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = "admin_veritas";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: hashedPassword,
      role: "PANITIA",
    },
  });

  await prisma.admin.upsert({
    where: { user_id: adminUser.id },
    update: {},
    create: {
      user_id: adminUser.id,
      nama_panitia: "Admin Veritas",
      no_hp: "081234567890",
    },
  });

  console.log("Admin user created successfully:");
  console.log("Username: " + username);
  console.log("Password: " + password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

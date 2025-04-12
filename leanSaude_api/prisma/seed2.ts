import { PrismaClient, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 50 }).map((_, index) => {
    const number = (index + 1).toString().padStart(2, "0");

    return {
      name: `Usuário ${number}`,
      phone: `119${Math.floor(10000000 + Math.random() * 89999999)}`,
      email: `usuario${number}@lean.com`,
      password: "123456",
      status: index % 2 === 0 ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  });

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: hashedPassword,
        status: user.status,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Alice Oliveira",
      phone: "11911110000",
      email: "alice@lean.com",
      password: "123456",
      status: UserStatus.ACTIVE,
    },
    {
      name: "Bruno Souza",
      phone: "11922220000",
      email: "bruno@lean.com",
      password: "123456",
      status: UserStatus.INACTIVE,
    },
    {
      name: "Camila Lima",
      phone: "11933330000",
      email: "camila@lean.com",
      password: "123456",
      status: UserStatus.ACTIVE,
    },
    {
      name: "Daniel Ferreira",
      phone: "11944440000",
      email: "daniel@lean.com",
      password: "123456",
      status: UserStatus.INACTIVE,
    },
    {
      name: "Eduarda Martins",
      phone: "11955550000",
      email: "eduarda@lean.com",
      password: "123456",
      status: UserStatus.ACTIVE,
    },
  ];

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

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

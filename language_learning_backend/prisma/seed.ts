import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import {
  PrismaClient,
  UserRole,
  UserStatus,
} from '../src/generated/prisma/client';

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const adapter = new PrismaPg({
  connectionString: getRequiredEnv('DATABASE_URL'),
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const email = getRequiredEnv('ADMIN_EMAIL').trim().toLowerCase();
  const password = getRequiredEnv('ADMIN_PASSWORD');
  const name = process.env.ADMIN_NAME?.trim() || 'Administrator';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      name,
      email,
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log('Admin account seeded:', admin);
}

void main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

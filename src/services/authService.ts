import prisma from '../utils/prisma.js';
import { comparePassword, hashPassword, generateToken } from '../utils/authHelper.js';
import { LoginInput } from '../validators/authValidator.js';

interface LoginResult {
  token: string;
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

export async function loginUser(input: LoginInput): Promise<LoginResult | null> {
  // Auto-seed admin user if not present
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@vbworld.com' }
  });
  if (!adminUser) {
    const hashedPassword = await hashPassword('password123');
    await prisma.user.create({
      data: {
        email: 'admin@vbworld.com',
        password: hashedPassword,
        name: 'Administrator',
      },
    });
    console.log('[AuthService] Seeded default admin account: admin@vbworld.com / password123');
  }

  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePassword(input.password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

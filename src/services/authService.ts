import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function signup(email: string, pass: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(pass, 12);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

export async function login(email: string, pass: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(pass, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

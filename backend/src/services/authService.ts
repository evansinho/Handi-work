import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

/**
 * Authenticate user by verifying email and password, then returns a JWT token if successful.
 * @param email - The email address of the user.
 * @param password - The password provided by the user.
 * @returns - JWT token if credentials are valid.
 * @throws - Error if authentication fails.
 */
export const authenticateUser = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('User not found');

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  return token;
};

/**
 * Hashes a plaintext password.
 * @param password - The plaintext password to hash.
 * @returns - The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

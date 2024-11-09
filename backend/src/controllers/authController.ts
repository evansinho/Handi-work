import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Validation schema using Joi
const userSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(20).optional(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('CLIENT', 'FREELANCER', 'ADMIN').required(),
  verificationStatus: Joi.string()
    .valid('PENDING', 'VERIFIED', 'REJECTED')
    .required(),
  twoFactorEnabled: Joi.boolean().default(false),
});

// Registration controller
export const registerUser = async (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const {
    name,
    email,
    phoneNumber,
    password,
    role,
    verificationStatus,
    twoFactorEnabled,
  } = req.body;

  try {
    if (role === 'error') {
      throw new Error('Unexpected error occurred');
    }
    // Check if the email already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user in the database
    const newUser: User = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        passwordHash: hashedPassword,
        role,
        verificationStatus,
        twoFactorEnabled,
      },
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    // Send the response with the created user
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        verificationStatus: newUser.verificationStatus,
        twoFactorEnabled: newUser.twoFactorEnabled,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
};

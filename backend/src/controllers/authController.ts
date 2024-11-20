import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Validation schema using Joi
const userSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(20).optional(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('CLIENT', 'ARTISAN', 'ADMIN').required(),
  verificationStatus: Joi.string()
    .valid('PENDING', 'VERIFIED', 'REJECTED')
    .required(),
  twoFactorEnabled: Joi.boolean().default(false),
});

// Validation schema for login using Joi
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
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

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION,
      }
    );

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

// Helper function to validate UUID format
function isValidUUID(id: string) {
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidPattern.test(id);
}

// setup 2FA controller
export const setup2FA = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Validate userId format (check if it's a valid UUID)
    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // Generate a TOTP secret
    const secret = speakeasy.generateSecret({ length: 20 });
    // Store the secret in the database and enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: true, // Set 2FA enabled to true
      },
    });
    // Generate a QR code for Google Authenticator
    const otpauthUrl = secret.otpauth_url;
    if (!otpauthUrl) throw new Error('Failed to generate OTP URL');
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    res.json({ qrCode, message: '2FA setup successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error setting up 2FA', error });
  }
};

// Verify 2FA controller
export const verify2FA = async (req: Request, res: Response) => {
  const { userId, token } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA not set up for this user' });
    }
    // Verify the TOTP token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });
    if (!verified) {
      return res.status(400).json({ message: 'Invalid 2FA code' });
    }
    res.json({ message: '2FA code verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying 2FA code', error });
  }
};

// Login controller
export const loginUser = async (req: Request, res: Response) => {
  // Validate the request body
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if two-factor authentication is enabled
    // if (!user.twoFactorEnabled) {
    //   return res.json({
    //     message: 'Two-factor authentication required',
    //     twoFactorEnabled: true,
    //     userId: user.id,
    //   });
    // }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    // Respond with the token and user details
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

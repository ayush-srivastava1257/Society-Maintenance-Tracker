import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/authMiddleware';
import { emailService } from '../services/emailService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, apartmentNo, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'RESIDENT';

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        apartmentNo: apartmentNo || null,
        role: userRole,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role as 'RESIDENT' | 'ADMIN',
      name: user.name,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'RESIDENT' | 'ADMIN',
        apartmentNo: user.apartmentNo,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role as 'RESIDENT' | 'ADMIN',
      name: user.name,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'RESIDENT' | 'ADMIN',
        apartmentNo: user.apartmentNo,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email address is required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user) {
      emailService.sendEmailAsync({
        to: user.email,
        subject: '[SocietyOS] Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #E88D38;">SocietyOS Account Recovery</h2>
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>We received a password reset request for your SocietyOS account (${user.email}).</p>
            <p>If you requested this, please contact facility administration or log in using your demo credentials.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6b7280;">SocietyOS • Smarter maintenance. Stronger communities.</p>
          </div>
        `,
      });
    }

    res.status(200).json({
      message: 'If an account exists for this email, password reset instructions have been sent.',
    });
  } catch (error) {
    console.error('ForgotPassword error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        apartmentNo: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        ...user,
        role: user.role as 'RESIDENT' | 'ADMIN',
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

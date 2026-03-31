import bcrypt from 'bcrypt';
import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { prisma } from '../api/lib/prisma';
import { generateToken } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';

const authRouter = Router();

const emailSchema = z
  .string()
  .trim()
  .email('Invalid email format')
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be at most 128 characters long')
  .refine((value) => /[a-z]/.test(value), 'Password must contain a lowercase letter')
  .refine((value) => /[A-Z]/.test(value), 'Password must contain an uppercase letter')
  .refine((value) => /\d/.test(value), 'Password must contain a number');

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

function sendValidationError(res: Response, error: z.ZodError) {
  return res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request body',
      details: error.flatten(),
    },
  });
}

function serializeUser(user: {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  roleLabel: string | null;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    roleLabel: user.roleLabel,
  };
}

authRouter.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return sendValidationError(res, parsed.error);
  }

  const { email, password, name } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return res.status(409).json({
      error: {
        code: 'EMAIL_IN_USE',
        message: 'An account with this email already exists',
      },
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
      preferences: {
        create: {},
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      roleLabel: true,
    },
  });

  const token = generateToken(user.id);

  return res.status(201).json({
    token,
    user: serializeUser(user),
  });
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return sendValidationError(res, parsed.error);
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      roleLabel: true,
      passwordHash: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return res.status(401).json({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      },
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      },
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
    },
  });

  const token = generateToken(user.id);

  return res.json({
    token,
    user: serializeUser(user),
  });
});

authRouter.get('/me', requireAuth, async (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
});

export { authRouter };

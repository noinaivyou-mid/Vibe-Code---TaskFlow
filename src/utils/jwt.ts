import jwt, { type Algorithm, type JwtPayload } from 'jsonwebtoken';

const JWT_ALGORITHM: Algorithm = 'HS256';
const JWT_EXPIRES_IN = '7d';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;

  if (!secret || secret.length < 16) {
    throw new Error('JWT secret is missing or too weak. Set JWT_SECRET in the environment.');
  }

  return secret;
}

export interface TokenPayload extends JwtPayload {
  sub: string;
}

export function generateToken(userId: number | string) {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: JWT_ALGORITHM,
    expiresIn: JWT_EXPIRES_IN,
    subject: String(userId),
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret(), {
    algorithms: [JWT_ALGORITHM],
  }) as TokenPayload;
}

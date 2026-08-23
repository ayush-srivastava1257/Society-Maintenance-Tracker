import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'societyos_super_secret_jwt_key_2026';

export interface JwtPayload {
  id: string;
  email: string;
  role: 'RESIDENT' | 'ADMIN';
  name: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

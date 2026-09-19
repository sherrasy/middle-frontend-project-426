import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'secret-dev';
export const SALT_ROUNDS = 10;

export const generateToken = (user: {
  id: number;
  email: string;
  sessionVersion: number;
}) =>
  jwt.sign(
    { userId: user.id, email: user.email, sessionVersion: user.sessionVersion },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

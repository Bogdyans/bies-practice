import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
// jwt.ts
export async function verifyToken(token: string): Promise<{ id: number; username: string } | null> {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return payload as { id: number; username: string };
    } catch (error) {
      return null;
    }
  }
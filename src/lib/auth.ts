import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Build vaqtida modul import qilinishi mumkin, shuning uchun tekshiruv
// importda emas, faqat token imzalanayotganda bajariladi.
function requireSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is required. Set a long random value in the environment before starting the app."
    );
  }
  return secret;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  fullName: string;
  department: string | null;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, requireSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, requireSecret()) as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

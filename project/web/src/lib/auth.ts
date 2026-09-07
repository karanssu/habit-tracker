import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET is not set. Copy .env.example to .env and fill it in.");
}

export const COOKIE_NAME = "habit_token";

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, SECRET!, { expiresIn: "30d" });
}

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, SECRET!) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
}

/**
 * The trick that lets one backend serve both clients:
 * - the web app authenticates with an httpOnly cookie
 * - the mobile app authenticates with `Authorization: Bearer <token>`
 * Route handlers check both, so the same endpoint works for either.
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return verifyToken(authHeader.slice(7));
  }
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }
  return null;
}

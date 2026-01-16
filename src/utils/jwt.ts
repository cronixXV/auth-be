import jwt, { SignOptions, Secret } from "jsonwebtoken";
import ms from "ms";

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

if (!accessSecret || !refreshSecret) {
  throw new Error("JWT secrets are not defined in environment variables");
}

function getExpires(
  value: string | undefined,
  fallback: ms.StringValue
): ms.StringValue {
  if (!value) return fallback;
  return value as ms.StringValue;
}

const accessExpiresIn = getExpires(process.env.JWT_ACCESS_EXPIRES_IN, "15m");

const refreshExpiresIn = getExpires(process.env.JWT_REFRESH_EXPIRES_IN, "7d");

export interface IJwtPayload {
  userId: number;
  role: string;
  tokenVersion: number;
}

function signToken(
  payload: IJwtPayload,
  secret: Secret,
  options: SignOptions
): string {
  return jwt.sign(payload, secret, options);
}

export function signAccessToken(payload: IJwtPayload): string {
  return signToken(payload, accessSecret, {
    expiresIn: accessExpiresIn,
  });
}

export function signRefreshToken(payload: IJwtPayload): string {
  return signToken(payload, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });
}

export function verifyToken<T>(token: string, secret: Secret): T {
  return jwt.verify(token, secret) as T;
}

export function verifyAccessToken(token: string): IJwtPayload {
  return verifyToken<IJwtPayload>(token, accessSecret);
}

export function verifyRefreshToken(token: string): IJwtPayload {
  return verifyToken<IJwtPayload>(token, refreshSecret);
}

export function safeVerifyToken<T>(token: string, secret: Secret): T | null {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
}

export function safeVerifyAccessToken(token: string): IJwtPayload | null {
  return safeVerifyToken<IJwtPayload>(token, accessSecret);
}

export function safeVerifyRefreshToken(token: string): IJwtPayload | null {
  return safeVerifyToken<IJwtPayload>(token, refreshSecret);
}

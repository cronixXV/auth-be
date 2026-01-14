import jwt, { SignOptions, Secret } from "jsonwebtoken";
import ms from "ms";

const accessSecret: Secret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET as string;

const accessExpiresIn: ms.StringValue =
  (process.env.JWT_ACCESS_EXPIRES_IN as ms.StringValue) || "15m";

const refreshExpiresIn: ms.StringValue =
  (process.env.JWT_REFRESH_EXPIRES_IN as ms.StringValue) || "7d";

if (!accessSecret || !refreshSecret) {
  throw new Error("JWT secrets are not defined in environment variables");
}

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

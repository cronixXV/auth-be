import { User } from "../../models/user";
import { hashPassword, comparePassword } from "../../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { RegisterDto, LoginDto } from "./auth.schemas";

export class AuthService {
  static async register(dto: RegisterDto) {
    const existingUser = await User.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await User.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: "USER",
      tokenVersion: 0,
    });

    const payload = {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  static async login(dto: LoginDto) {
    const user = await User.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await comparePassword(dto.password, user.passwordHash);

    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const payload = {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export async function refreshTokens(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await User.findByPk(payload.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("Token version mismatch");
    }

    const newPayload = {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch {
    return null;
  }
}

export async function logout(refreshToken: string): Promise<void> {
  const payload = verifyRefreshToken(refreshToken);

  const user = await User.findByPk(payload.userId);
  if (!user) {
    return;
  }

  user.tokenVersion += 1;
  await user.save();
}

import { User } from "../../models/user";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
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

  // ✅ ДОБАВЛЯЕМ СЮДА
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

import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schemas";
import { AuthService } from "./auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const dto = registerSchema.parse(req.body);

      const { user, accessToken, refreshToken } = await AuthService.register(
        dto
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth/refresh",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(201).json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
          message: "Email already in use",
        });
      }

      if (error.name === "ZodError") {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }

      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const dto = loginSchema.parse(req.body);

      const { user, accessToken, refreshToken } = await AuthService.login(dto);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth/refresh",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      if (
        error.message === "INVALID_CREDENTIALS" ||
        error.name === "ZodError"
      ) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

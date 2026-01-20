import { Request, Response } from "express";
import { User } from "../../models/user";

export class UserController {
  static async profile(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const user = await User.findByPk(userId, {
        attributes: ["id", "email", "name", "role", "createdAt"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ user });
    } catch (error) {
      console.error("PROFILE_ERROR", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

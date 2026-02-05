import { type NextFunction, type Response } from "express";
import { auth } from "../../lib/auth.js";

export async function requireAuth(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = session.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

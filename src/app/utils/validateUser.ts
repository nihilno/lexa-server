import { type Response } from "express";

export async function validateUser(req: RequestWithUser, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return undefined;
  }

  return userId;
}

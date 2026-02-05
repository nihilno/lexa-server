import { type Request } from "express";
import type { auth } from "../../lib/auth.js";

declare global {
  type Item = {
    id?: string | undefined;
    name: string;
    quantity: number;
    price: number;
  };

  interface RequestWithUser extends Request {
    user?: typeof auth.$Infer.Session.user;
  }
}

export {};

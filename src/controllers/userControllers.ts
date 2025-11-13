import { NextFunction, Request, Response } from "express";
import { EditUserService } from "../services/userServices";

export async function EditUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id as string;

    const userData = { ...req.body, userId };

    await EditUserService(userData);

    res.status(200).json({ message: `Edit user successfully` });
  } catch (error) {
    next(error);
  }
}

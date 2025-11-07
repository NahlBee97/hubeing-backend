import { NextFunction, Request, Response } from "express";
import { LoginService, LogOutService, RegisterService } from "../services/authServices";

export async function LoginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = await LoginService(req.body);

    res
      .status(200)
      .json({ message: `Login successfully`, accessToken});
  } catch (error) {
    next(error);
  }
}

export async function LogOutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.body as string;

    if (accessToken) await LogOutService(accessToken);

    res
      .status(200)
      .json({ message: `Log out successfully` });
  } catch (error) {
    next(error);
  }
}

export async function RegisterController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newUser = await RegisterService(req.body);

    res.status(201).json({ message: `New user created successfully`, newUser });
  } catch (error) {
    next(error);
  }
}

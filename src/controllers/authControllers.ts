import { NextFunction, Request, Response } from "express";
import {
  LoginService,
  LogOutService,
  RegisterService,
} from "../services/authServices";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

export async function LoginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = await LoginService(req.body);

    res.status(200).json({ message: `Login successfully`, accessToken });
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

    res.status(200).json({ message: `Log out successfully` });
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

export async function authController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.body.accessToken as string;

  try {
    if (token) {
      verify(token, String(JWT_ACCESS_SECRET)) as JwtPayload;

      const tokenInDb = await prisma.tokens.findUnique({
        where: {
          token
        }
      })

      if (tokenInDb?.isValid === true) {
        res.status(200).json({ message: `User valid`, isLoggedIn: true });
      } else {
        throw new AppError("Token invalid", 401);
      }

    } else {
      res.status(200).json({ message: `Not Logged In`, isLoggedIn: false });
    }
  } catch (error) {
    await LogOutService(token);
    next(error);
  }
}

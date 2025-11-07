import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { FindUserByEmail } from "../helper/findUserByEmail";
import { ILogin, IRegister } from "../interfaces/authInterfaces";
import { AppError } from "../utils/appError";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config";
import { prisma } from "../lib/prisma";

export async function LoginService(userData: ILogin) {
  try {
    const { email, password } = userData;

    const user = await FindUserByEmail(email);

    if (!user) throw new AppError("User not found", 404);

    const checkPass = await bcrypt.compare(password, user.password as string);

    if (!checkPass) throw new AppError("Incorrect Password", 401);

    const accessPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      imageUrl: user.imageUrl,
    };

    const accessToken = jwt.sign(accessPayload, String(JWT_ACCESS_SECRET), {
      expiresIn: "1h",
    });
    if (!accessToken)
      throw new AppError("Failed to generate token", 500);

    await prisma.$transaction(async (tx: any) => {
      await tx.tokens.updateMany({
        where: { userId: user.id },
        data: { isValid: false },
      });

      await tx.tokens.create({
        data: {
          userId: user.id,
          token: accessToken,
          updatedAt: new Date(),
        },
      });
    });

    return accessToken;
  } catch (error) {
    throw error;
  }
}

export async function LogOutService(accessToken: string) {
  try {
    const authToken = await prisma.tokens.findUnique({
      where: { token: accessToken },
    });

    if (!authToken) return;

    if (authToken?.isValid === false) return;

    await prisma.tokens.update({
      where: { token: accessToken },
      data: { isValid: false },
    });
  } catch (error) {
    throw error;
  }
}

export async function RegisterService(userData: IRegister) {
  try {
    const { name, email, password } = userData;

    const existingUser = await FindUserByEmail(email);

    if (existingUser) throw new AppError("Email already registered", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) throw new AppError("Failed hashing password", 500);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
}

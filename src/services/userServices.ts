import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

interface IEditUser {
    userId: string,
    name: string,
    email: string
}

export async function EditUserService(userData: IEditUser) {
  try {
    const existingUser = await prisma.users.findUnique({
        where: { id: userData.userId}
    })

    if (!existingUser) throw new AppError("User not found", 404);

    await prisma.users.update({
        where: {id: userData.userId},
        data: {
            id: userData.userId || existingUser.id,
            name: userData.name || existingUser.name,
            email: userData.email || existingUser.email
        }
    })
  } catch (error) {
    throw error;
  }
}
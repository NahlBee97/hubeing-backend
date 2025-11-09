import { NextFunction, Request, Response } from "express";
import { CreateAppointmentService } from "../services/appointmentServices";

export async function CreateAppointmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { appointmentDate } = req.body;

    const utcDate = new Date(`${appointmentDate}T00:00:00Z`);

    const userId = req.user?.id as string;

    await CreateAppointmentService(utcDate, userId);

    res.status(201).json({ message: "Create new appointment successfully" });
  } catch (error) {
    next(error);
  }
}

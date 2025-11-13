import { NextFunction, Request, Response } from "express";
import { CreateAppointmentService, GetUserAppointmentByDateService, GetUserAppointmentsService } from "../services/appointmentServices";

export async function GetUserAppointmentByDateController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { date } = req.params;

    const utcDate = new Date(`${date}T00:00:00Z`);

    const userId = req.user?.id as string;

    const appointments = await GetUserAppointmentByDateService(utcDate, userId);

    res.status(200).json({ message: "Get appointments successfully", appointments });
  } catch (error) {
    next(error);
  }
}

export async function GetUserAppointmentsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id as string;
    const isPast = req.query.past as string;

    const appointments = await GetUserAppointmentsService(userId, isPast);

    res.status(200).json({ message: "Get appointments successfully", appointments });
  } catch (error) {
    next(error);
  }
}

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

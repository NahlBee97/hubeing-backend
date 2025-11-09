import { Router } from "express";
import { VerifyToken } from "../middlewares/authMiddlewares";
import { CreateAppointmentController } from "../controllers/appointmentControllers";

const router = Router();

router.post("/", VerifyToken, CreateAppointmentController);

export default router;

import { Router } from "express";
import { VerifyToken } from "../middlewares/authMiddlewares";
import { CreateAppointmentController, GetUserAppointmentByDateController } from "../controllers/appointmentControllers";

const router = Router();

router.get("/:date", VerifyToken, GetUserAppointmentByDateController);
router.post("/", VerifyToken, CreateAppointmentController);

export default router;

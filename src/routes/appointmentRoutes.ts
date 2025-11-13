import { Router } from "express";
import { VerifyToken } from "../middlewares/authMiddlewares";
import { CreateAppointmentController, GetUserAppointmentByDateController, GetUserAppointmentsController } from "../controllers/appointmentControllers";

const router = Router();

router.get("/:date", VerifyToken, GetUserAppointmentByDateController);
router.get("/user/:id", VerifyToken, GetUserAppointmentsController);
router.post("/", VerifyToken, CreateAppointmentController);

export default router;

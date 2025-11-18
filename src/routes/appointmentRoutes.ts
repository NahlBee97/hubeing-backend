import { Router } from "express";
import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";
import { CreateAppointmentController, GetAppointmentSummaryController, GetUserAppointmentByDateController, GetUserAppointmentsController } from "../controllers/appointmentControllers";

const router = Router();

router.get("/user/:id", VerifyToken, GetUserAppointmentsController);
router.get("/summary", GetAppointmentSummaryController);
router.get("/:date", VerifyToken, GetUserAppointmentByDateController);
router.post("/", VerifyToken, CreateAppointmentController);

export default router;

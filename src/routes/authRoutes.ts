import { Router } from "express";
import { LoginSchema, RegisterSchema } from "../schemas/authSchemas";
import { validateRequest } from "../middlewares/validationMiddleware";
import { authController, LoginController, LogOutController, RegisterController } from "../controllers/authControllers";

const router = Router();

router.post("/login", validateRequest(LoginSchema), LoginController);
router.post("/register", validateRequest(RegisterSchema), RegisterController);
router.post("/logout", LogOutController);
router.post("/check", authController);

export default router;

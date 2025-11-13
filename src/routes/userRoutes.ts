import { Router } from "express";
import { validateRequest } from "../middlewares/validationMiddleware";
import { ProfileSchema } from "../schemas/userSchemas";
import { VerifyToken } from "../middlewares/authMiddlewares";
import { EditUserController } from "../controllers/userControllers";

const router = Router();

router.post("/", VerifyToken, validateRequest(ProfileSchema), EditUserController);

export default router;

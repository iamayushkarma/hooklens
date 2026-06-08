import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  googleLogin,
} from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/google", googleLogin);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticateUser, getCurrentUser);

export default router;

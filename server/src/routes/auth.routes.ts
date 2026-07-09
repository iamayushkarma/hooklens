import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  googleLogin,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/google", googleLogin);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticateUser, getCurrentUser);
router.patch("/me", authenticateUser, updateProfile);
router.patch("/me/password", authenticateUser, changePassword);
router.delete("/me", authenticateUser, deleteAccount);

export default router;

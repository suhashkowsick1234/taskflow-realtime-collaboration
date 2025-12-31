import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerDto, loginDto } from "../dtos/auth.dto";

const router = Router();

router.post("/register", validate(registerDto), register);
router.post("/login", validate(loginDto), login);

// 🔐 Temporary protected route (for testing JWT)
router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user?.id
  });
});

export default router;

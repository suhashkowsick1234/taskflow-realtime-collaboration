import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getUsers } from "../controllers/user.controller";

const router = Router();

router.use(authenticate);
router.get("/", getUsers);

export default router;

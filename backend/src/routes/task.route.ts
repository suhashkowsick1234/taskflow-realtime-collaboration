import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { assignTask } from "../controllers/task.controller";
import {
  createTaskDto,
  updateTaskDto,
  assignTaskDto
} from "../dtos/task.dto";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(authenticate);

router.post("/", validate(createTaskDto), createTask);
router.get("/", getTasks);
router.put("/:id", validate(updateTaskDto), updateTask);
router.patch("/:id/assign", validate(assignTaskDto), assignTask);
router.delete("/:id", deleteTask);

export default router;

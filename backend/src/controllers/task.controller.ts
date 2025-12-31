import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import { getIO } from "../server";

/* ---------------- CREATE TASK ---------------- */
export const createTask = async (req: Request, res: Response) => {
  const task = await taskService.createTask({
    ...req.body,
    creatorId: req.user!.id,
  });

  // STEP 3: Emit event
  getIO().emit("task:created", task);

  res.status(201).json(task);
};

/* ---------------- GET TASKS ---------------- */
export const getTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getTasks();
  res.json(tasks);
};

/* ---------------- UPDATE TASK ---------------- */
export const updateTask = async (req: Request, res: Response) => {
  const task = await taskService.updateTask(req.params.id, req.body);

  // STEP 3: Emit event
  getIO().emit("task:updated", task);

  res.json(task);
};

/* ---------------- DELETE TASK ---------------- */
export const deleteTask = async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id);

  // STEP 3: Emit event
  getIO().emit("task:deleted", { id: req.params.id });

  res.status(204).send();
};

/* ---------------- ASSIGN TASK ---------------- */
export const assignTask = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const task = await taskService.assignTask(req.params.id, userId);

    // 🔴 Real-time event
    getIO().emit("task:assigned", task);

    res.json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


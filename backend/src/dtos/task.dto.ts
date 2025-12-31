import { z } from "zod";

export const createTaskDto = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(5),
  dueDate: z.string().datetime(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional()
});

export const updateTaskDto = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(5).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional()
});

export const assignTaskDto = z.object({
  userId: z.string().uuid("Invalid userId")
});

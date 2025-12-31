import { taskRepository } from "../repositories/task.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const taskService = {
  createTask(data: any) {
    return taskRepository.create(data);
  },

  getTasks() {
  return prisma.task.findMany({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
},

  updateTask(id: string, data: any) {
    return taskRepository.update(id, data);
  },

  deleteTask(id: string) {
  return prisma.$transaction([
    prisma.notification.deleteMany({
      where: { taskId: id },
    }),
    prisma.task.delete({
      where: { id },
    }),
  ]);
}
,
  assignTask(id: string, userId: string) {
  return prisma.task.update({
    where: { id },
    data: {
      assignedToId: userId,
      notifications: {
        create: {
          userId,
          message: "📌 A task has been assigned to you",
        },
      },
    },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}



};

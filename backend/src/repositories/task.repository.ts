import prisma from "../config/prisma";

export const taskRepository = {
  create: (data: any) => {
    return prisma.task.create({ data });
  },

  findAll: () => {
    return prisma.task.findMany({
      include: {
        creator: true,
        assignedTo: true
      }
    });
  },

  findById: (id: string) => {
    return prisma.task.findUnique({
      where: { id }
    });
  },

  update: async (id: string, data: any) => {
  const task = await prisma.task.findUnique({
    where: { id }
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return prisma.task.update({
    where: { id },
    data
  });
},


 delete: async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id }
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return prisma.task.delete({ where: { id } });
},

  assignTask: (taskId: string, userId: string) =>
  prisma.task.update({
    where: { id: taskId },
    data: { assignedToId: userId },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

};

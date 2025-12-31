import prisma from "../config/prisma";

export const userRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },
  
  findAll() {
  return prisma.user.findMany();
},
  
  create: (data: { name: string; email: string; password: string }) => {
    return prisma.user.create({
      data
    });
  }
};


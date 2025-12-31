import { Request, Response } from "express";
import { userRepository } from "../repositories/user.repository";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.findAll();

    res.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

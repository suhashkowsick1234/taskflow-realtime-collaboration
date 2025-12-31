import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { userRepository } from "../repositories/user.repository";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.register(name, email, password);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Authenticate user & get token
    const token = await authService.login(email, password);

    // Fetch user details for frontend
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

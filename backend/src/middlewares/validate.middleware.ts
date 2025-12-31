import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, ZodIssue } from "zod";

export const validate =
  (schema: ZodSchema, source: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(source === "body" ? req.body : req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((e: ZodIssue) => ({
            field: e.path.join("."),
            message: e.message
          }))
        });
      }

      return res.status(500).json({
        message: "Internal validation error"
      });
    }
  };

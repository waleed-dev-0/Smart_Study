import { Request, Response, NextFunction } from "express";

export const mockAuth = (req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: "662580a9d9e4a8b7c8e6f1a1",
    username: "test_account",
    email: "test@gmail.com",
  };
  next();
};

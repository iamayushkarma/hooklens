import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error";

interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  //The the full token has a formate is like this `Authorization: Bearer <token>`, so we split it on the basic of space and gets the value at index 1 which is our actual token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "Unauthorized request"));
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid token"));
  }
};

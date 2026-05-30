import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { verifyToken } from "../utils/jwt";

// interface AuthRequest extends Request {
//   user?: {
//     userId: string;
//   };
// }
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  //The the full token has a formate is like this `Authorization: Bearer <token>`, so we split it on the basic of space and gets the value at index 1 which is our actual token
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    throw new ApiError(401, "No token provided");

  const token = header?.split(" ")[1];

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid token"));
  }
};

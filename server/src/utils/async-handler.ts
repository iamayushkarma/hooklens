import { RequestHandler } from "express";

// Wrapper function for handling async Express controllers
// Automatically forwards errors to Express error middleware
export const asyncHandler = (
  requestHandler: RequestHandler,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error),
    );
  };
};

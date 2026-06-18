import { Response } from "express";
import { ApiResponse } from "./api-response";

export const ok = <T>(res: Response, data: T, message = "Success") => {
  return res.status(200).json(new ApiResponse(200, data, message));
};

export const created = <T>(res: Response, data: T, message = "Created") => {
  return res.status(201).json(new ApiResponse(201, data, message));
};

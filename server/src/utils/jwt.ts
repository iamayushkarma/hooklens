import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  userId: string;
}
const signToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
};
const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};

export { signToken, verifyToken };
export type { JwtPayload };

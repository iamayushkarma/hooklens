import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

const signToken = (userId: string) => {
  jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
};
const verifyToken = (token: string) => {
  jwt.verify(token, SECRET) as { userId: string };
};

export { signToken, verifyToken };

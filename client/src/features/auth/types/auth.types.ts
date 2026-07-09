interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  authProvider?: "local" | "google";
}

interface AuthResponse {
  statusCode: number;
  message: string;
  data: {
    token: string;
    user: User;
  };
}
export type { User, AuthResponse };

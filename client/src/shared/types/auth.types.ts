export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

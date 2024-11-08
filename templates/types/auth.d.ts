// TODO: Change this file according to your exact requirement.

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "student" | "guest";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// User
export interface User {
  _id: string;
  email: string;
  username?: string;
  name?: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
}

// Request login
export interface LoginRequest {
  email: string;
  password: string;
}

// Request register
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  name?: string;
}

// Request update profile
export interface UpdateProfileRequest {
  name?: string;
  username?: string;
}

// Request change password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Response auth (login/register)
export interface AuthResponse {
  _id: string;
  email: string;
  username?: string;
  name?: string;
  token: string;
  message?: string;
}

// Response update profile
export interface UpdateProfileResponse {
  success: boolean;
  data: User;
  message?: string;
}

// Context type untuk Auth
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
    name?: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

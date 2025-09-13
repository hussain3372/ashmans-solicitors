export interface AuthState {
  name: string;
  email: string;
  profilePicture: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface EmailI {
  email: string;
}

export interface PasswordsI {
  password: string;
  password_confirmation: string;
  email: string;
  token: string;
}

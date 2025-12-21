export interface AuthenticateRequest {
  username: string;
  password: string;
}

export interface AuthenticateResponse {
  userId: string;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmationPassword: string;
}

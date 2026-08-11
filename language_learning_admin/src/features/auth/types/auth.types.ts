export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
}

export interface AdminLoginResult {
  accessToken: string;
  user: AdminUser;
}

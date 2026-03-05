export type UserRole = "doctor" | "patient";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

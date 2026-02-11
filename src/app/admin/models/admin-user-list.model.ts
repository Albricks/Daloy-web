export interface AdminUserList {
  userId: string;
  fullName: string;
  email: string;
  createdAt: string; // ISO date
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

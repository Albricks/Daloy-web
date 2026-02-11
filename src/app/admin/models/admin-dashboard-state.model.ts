import { AdminUserList } from './admin-user-list.model';
import { AdminUserOverallProgress } from './admin-user-overall-progress.model';
import { AdminKpi } from './admin-kpi.model';

export interface AdminDashboardState {
  // Overview
  kpis: AdminKpi | null;

  // Learner list
  users: AdminUserList[];
  searchText: string;
  loadingUsers: boolean;

  // Selected learner (detail panel)
  selectedUserId: string | null;
  selectedUser?: AdminUserList | null;
  overallProgress: AdminUserOverallProgress[];

  // UI state
  loadingOverallProgress: boolean;
}

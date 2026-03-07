import { AdminUserList } from './admin-user-list.model';
import { AdminUserOverallProgress } from './admin-user-overall-progress.model';
import { AdminVideoProgressDto } from './admin-video-progress.model';
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
  videoProgress: AdminVideoProgressDto[]; // For video progress table

  // UI state
  loadingOverallProgress: boolean;
}

import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { SituationalCompleteGuard } from './component/content/situational/situational-complete.guard';

export const routes: Routes = [
  // ---------- PUBLIC ----------
  {
    path: 'login',
    loadComponent: () =>
      import('./component/user/user-login/user-login.component')
        .then(m => m.UserLoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./component/user/user-register/user-register.component')
        .then(m => m.UserRegisterComponent)
  },
  {
    path: 'reset-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/user/reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent),
  },

  // ---------- PROTECTED ----------
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/content/home/home.component')
        .then(m => m.HomeComponent),
  },
  {
    path: 'modules',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/core/module-list/module-list.component')
        .then(m => m.ModulesListComponent),
  },
  {
    path: 'videos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/core/video-list/video-list.component')
        .then(m => m.VideoListComponent),
  },
  {
    path: 'videos/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/core/video-watch/video-watch.component')
        .then(m => m.VideoWatchComponent),
  },
  {
    path: 'diary',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/core/diary/diary.component')
        .then(m => m.DiaryComponent),
  },
  {
    path: 'whats-new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/content/whatsnew/whatsnew.component')
        .then(m => m.WhatsNewComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/user/profile/profile.component')
        .then(m => m.ProfileComponent),
  },
  {
    path: 'profile-settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/user/user-settings/user-settings.component')
        .then(m => m.UserSettingsComponent),
  },

  // ---------- MODULE SUB-ROUTES ----------
  {
    path: 'modules/preview/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/core/module-preview/module-preview.component')
        .then(m => m.ModulePreviewComponent),
    data: { renderMode: 'csr' }
  },
  {
    path: 'modules/read/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/core/module-read/module-read.component')
        .then(m => m.ModuleReadComponent),
    data: { renderMode: 'csr' }
  },

  // ✅ NEW: Situational Activity (before knowledge check)
  {
    path: 'modules/situational/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./component/content/situational/situational-activity.component')
        .then(m => m.SituationalActivityComponent),
    data: { renderMode: 'csr' }
  },

  // 🔐 Knowledge Check (blocked until situational is completed)
  {
    path: 'modules/knowledge-check/:id',
    canActivate: [authGuard, SituationalCompleteGuard],
    loadComponent: () =>
      import('./component/content/knowledge-check/knowledge-check.component')
        .then(m => m.KnowledgeCheckComponent),
    data: { renderMode: 'csr' }
  },

  // ---------- DEFAULT ----------
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'modules/knowledge-check/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'modules/read/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'modules/preview/:id',
    renderMode: RenderMode.Client
  },

  // fallback
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];

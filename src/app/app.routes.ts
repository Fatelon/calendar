import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar.component'),
  },
  {
    path: '**',
    redirectTo: 'calendar',
  }
];

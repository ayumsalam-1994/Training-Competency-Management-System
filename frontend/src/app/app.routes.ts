import { Routes } from '@angular/router';
import { AddCourse } from './pages/add-course/add-course';

export const routes: Routes = [
  // Public Routes (No Navbar)
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },

  // Authenticated Routes (With Navbar)
  {
    path: '',
    loadComponent: () => import('./components/layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'competencies', loadComponent: () => import('./pages/competencies/competencies').then(m => m.CompetenciesPage) },
      { path: 'add-course', component: AddCourse },
      { path: 'create-coursepage/:courseId', loadComponent: () => import('./pages/create-coursepage/create-coursepage').then(m => m.CreateCoursepage) },
      { path: 'view-course', loadComponent: () => import('./pages/view-course/view-course').then(m => m.ViewCourse) }
    ]
  },

  { path: '**', redirectTo: 'dashboard' },
];

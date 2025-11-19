import { Routes } from '@angular/router';
import { AddCourse } from './pages/add-course/add-course';

export const routes: Routes = [
  { path: 'add-course', component: AddCourse },
  { path: 'create-coursepage/:courseId', loadComponent: () => import('./pages/create-coursepage/create-coursepage').then(m => m.CreateCoursepage) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.Register) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard) },
  { path: '**', redirectTo: 'dashboard' },
];

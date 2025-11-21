import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  user: User | null = null;
  testResult: string = '';
  private apiUrl = 'http://localhost:4000';

  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  testHealthCheck() {
    this.http.get(`${this.apiUrl}/health`).subscribe({
      next: (response) => {
        this.testResult = `Health Check SUCCESS: ${JSON.stringify(response, null, 2)}`;
      },
      error: (err) => {
        this.testResult = `Health Check ERROR: ${JSON.stringify(err.error || err.message, null, 2)}`;
      }
    });
  }

  testProfile() {
    const token = this.auth.getToken();
    if (!token) {
      this.testResult = 'Profile ERROR: No token found';
      return;
    }
    
    this.http.get(`${this.apiUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        this.testResult = `Profile SUCCESS: ${JSON.stringify(response, null, 2)}`;
      },
      error: (err) => {
        this.testResult = `Profile ERROR: ${JSON.stringify(err.error || err.message, null, 2)}`;
      }
    });
  }

  testLoginAPI() {
    const testCredentials = { email: 'test@example.com', password: 'password123' };
    this.http.post(`${this.apiUrl}/auth/login`, testCredentials).subscribe({
      next: (response) => {
        this.testResult = `Login API SUCCESS: ${JSON.stringify(response, null, 2)}`;
      },
      error: (err) => {
        this.testResult = `Login API ERROR: ${JSON.stringify(err.error || err.message, null, 2)}`;
      }
    });
  }

  testRegisterAPI() {
    const randomEmail = `test${Date.now()}@example.com`;
    const testUser = { email: randomEmail, password: 'password123' };
    this.http.post(`${this.apiUrl}/auth/register`, testUser).subscribe({
      next: (response) => {
        this.testResult = `Register API SUCCESS: ${JSON.stringify(response, null, 2)}`;
      },
      error: (err) => {
        this.testResult = `Register API ERROR: ${JSON.stringify(err.error || err.message, null, 2)}`;
      }
    });
  }
}

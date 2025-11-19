import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  user: User | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

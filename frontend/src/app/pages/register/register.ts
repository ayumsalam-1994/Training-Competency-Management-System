import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    this.error = null;
    this.auth.register(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.error = err?.error?.error || 'Registration failed',
    });
  }
}

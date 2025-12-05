import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth';

export interface Competency {
  id: number;
  name: string;
  description: string;
  level?: string;
  achieved?: boolean;
  achievedAt?: string;
}

export interface Certificate {
  id: number;
  competencyId: number;
  competencyName: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'expiring-soon';
}

@Injectable({
  providedIn: 'root',
})
export class CompetencyService {
  private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCompetencies(): Observable<Competency[]> {
    // Placeholder implementation - returns mock data until backend endpoints are ready
    const mockCompetencies: Competency[] = [
      {
        id: 1,
        name: 'Basic Safety Training',
        description: 'Fundamental workplace safety protocols and procedures',
        level: 'beginner',
        achieved: true,
        achievedAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'Advanced Technical Skills',
        description: 'Advanced programming and system administration',
        level: 'advanced',
        achieved: false
      },
      {
        id: 3,
        name: 'Leadership Fundamentals',
        description: 'Basic leadership principles and team management',
        level: 'intermediate',
        achieved: true,
        achievedAt: '2024-02-20'
      }
    ];
    
    return of(mockCompetencies);
    
    // When backend is ready, uncomment this:
    // return this.http.get<Competency[]>(`${this.apiUrl}/competencies`, {
    //   headers: this.getAuthHeaders()
    // });
  }

  getUserCertificates(): Observable<Certificate[]> {
    // Placeholder implementation - returns mock data
    const mockCertificates: Certificate[] = [
      {
        id: 1,
        competencyId: 1,
        competencyName: 'Basic Safety Training',
        issuedAt: '2024-01-15',
        expiresAt: '2025-01-15',
        status: 'active'
      },
      {
        id: 2,
        competencyId: 3,
        competencyName: 'Leadership Fundamentals',
        issuedAt: '2024-02-20',
        expiresAt: '2024-12-20',
        status: 'expiring-soon'
      }
    ];
    
    return of(mockCertificates);
    
    // When backend is ready, uncomment this:
    // return this.http.get<Certificate[]>(`${this.apiUrl}/certificates`, {
    //   headers: this.getAuthHeaders()
    // });
  }

  downloadCertificate(certificateId: number): Observable<Blob> {
    // Placeholder - in real implementation this would download PDF
    return this.http.get(`${this.apiUrl}/certificates/${certificateId}/download`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }
}
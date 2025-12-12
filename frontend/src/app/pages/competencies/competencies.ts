import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetencyService, Competency, Certificate } from '../../services/competency';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-competencies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './competencies.html',
  styleUrls: ['./competencies.css']
})
export class CompetenciesPage implements OnInit {
  competencies: Competency[] = [];
  certificates: Certificate[] = [];
  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private competencyService: CompetencyService,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = null;

    // Load competencies
    this.competencyService.getCompetencies().subscribe({
      next: (competencies) => {
        this.competencies = competencies;
        this.checkLoadingComplete();
      },
      error: (err) => {
        this.error = 'Failed to load competencies';
        this.loading = false;
        console.error('Error loading competencies:', err);
      }
    });

    // Load certificates
    this.competencyService.getUserCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
        this.checkLoadingComplete();
      },
      error: (err) => {
        this.error = 'Failed to load certificates';
        this.loading = false;
        console.error('Error loading certificates:', err);
      }
    });
  }

  private checkLoadingComplete() {
    if (this.competencies.length >= 0 && this.certificates.length >= 0) {
      this.loading = false;
    }
  }

  getCompetencyProgress(): { achieved: number; total: number; percentage: number } {
    const achieved = this.competencies.filter(c => c.achieved).length;
    const total = this.competencies.length;
    const percentage = total > 0 ? Math.round((achieved / total) * 100) : 0;
    
    return { achieved, total, percentage };
  }

  getCertificatesByStatus() {
    return {
      active: this.certificates.filter(c => c.status === 'active').length,
      expiringSoon: this.certificates.filter(c => c.status === 'expiring-soon').length,
      expired: this.certificates.filter(c => c.status === 'expired').length
    };
  }

  downloadCertificate(certificateId: number, competencyName: string) {
    this.competencyService.downloadCertificate(certificateId).subscribe({
      next: (blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${competencyName}_Certificate.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading certificate:', err);
        alert('Failed to download certificate. Please try again.');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'expiring-soon':
        return 'text-orange-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getLevelColor(level?: string): string {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
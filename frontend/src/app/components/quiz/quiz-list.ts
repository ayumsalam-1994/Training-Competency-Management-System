import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
    selector: 'app-quiz-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './quiz-list.html',
    styleUrls: ['./quiz-list.css']
})
export class QuizListComponent implements OnInit {
    quizzes: any[] = [];
    filteredQuizzes: any[] = [];
    userAttempts: { [key: number]: any[] } = {};
    loading = false;
    error: string | null = null;
    selectedDifficulty: string = 'all';
    difficulties = ['all', 'easy', 'medium', 'hard'];

    constructor(private quizService: QuizService) { }

    ngOnInit() {
        this.loadQuizzes();
    }

    loadQuizzes() {
        this.loading = true;
        this.error = null;
        this.quizService.getAllQuizzes().subscribe({
            next: (response: any) => {
                this.quizzes = response.data || [];
                this.filterQuizzes();
                this.loadUserAttempts();
            },
            error: (err) => {
                this.error = 'Failed to load quizzes';
                console.error('Error loading quizzes:', err);
                this.loading = false;
            }
        });
    }

    filterQuizzes() {
        if (this.selectedDifficulty === 'all') {
            this.filteredQuizzes = [...this.quizzes].sort((a, b) => a.title.localeCompare(b.title));
        } else {
            this.filteredQuizzes = this.quizzes
                .filter(q => q.difficulty === this.selectedDifficulty)
                .sort((a, b) => a.title.localeCompare(b.title));
        }
    }

    onDifficultyChange(difficulty: string) {
        this.selectedDifficulty = difficulty;
        this.filterQuizzes();
    }

    loadUserAttempts() {
        // Clear previous attempts
        this.userAttempts = {};

        // Load attempts for each quiz
        let loadedCount = 0;
        const totalQuizzes = this.quizzes.length;

        this.quizzes.forEach(quiz => {
            this.quizService.getUserAttempts(quiz.id).subscribe({
                next: (response: any) => {
                    this.userAttempts[quiz.id] = response.data?.attempts || [];
                    loadedCount++;
                    // Set loading to false when all attempts are loaded
                    if (loadedCount === totalQuizzes) {
                        this.loading = false;
                    }
                },
                error: (err) => {
                    console.warn(`Warning: Could not load attempts for quiz ${quiz.id}:`, err);
                    this.userAttempts[quiz.id] = [];
                    loadedCount++;
                    // Set loading to false when all attempts are loaded (even with errors)
                    if (loadedCount === totalQuizzes) {
                        this.loading = false;
                    }
                }
            });
        });

        // Fallback: if no quizzes, set loading to false immediately
        if (totalQuizzes === 0) {
            this.loading = false;
        }
    }

    getDifficultyColor(difficulty: string): string {
        const colors: { [key: string]: string } = {
            'easy': '#28a745',
            'medium': '#ffc107',
            'hard': '#dc3545'
        };
        return colors[difficulty] || '#6c757d';
    }

    getLatestAttempt(quizId: number): any {
        const attempts = this.userAttempts[quizId];
        return attempts && attempts.length > 0 ? attempts[0] : null;
    }

    getBestScore(quizId: number): number {
        const attempts = this.userAttempts[quizId];
        if (!attempts || attempts.length === 0) return 0;
        return Math.max(...attempts.map(a => a.percentage || 0));
    }

    getAttemptCount(quizId: number): number {
        const attempts = this.userAttempts[quizId];
        return attempts ? attempts.length : 0;
    }

    hasAttempted(quizId: number): boolean {
        return this.getAttemptCount(quizId) > 0;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}


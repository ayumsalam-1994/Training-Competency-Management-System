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
    loading = false;
    error: string | null = null;

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
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load quizzes';
                console.error('Error loading quizzes:', err);
                this.loading = false;
            }
        });
    }

    getDifficultyColor(difficulty: string): string {
        const colors: { [key: string]: string } = {
            'easy': '#28a745',
            'medium': '#ffc107',
            'hard': '#dc3545'
        };
        return colors[difficulty] || '#6c757d';
    }
}

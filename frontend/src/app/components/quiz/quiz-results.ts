import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
    selector: 'app-quiz-results',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './quiz-results.html',
    styleUrls: ['./quiz-results.css']
})
export class QuizResultsComponent implements OnInit {
    quizId: number = 0;
    attemptId: number = 0;
    results: any = null;
    loading = false;
    error: string | null = null;
    expandedQuestions: { [key: number]: boolean } = {};

    constructor(
        private quizService: QuizService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.quizId = parseInt(params['quizId']);
            this.attemptId = parseInt(params['attemptId']);
            this.loadResults();
        });
    }

    loadResults() {
        this.loading = true;
        this.error = null;
        this.quizService.getAttemptResults(this.quizId, this.attemptId).subscribe({
            next: (response: any) => {
                this.results = response.data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load results';
                console.error('Error loading results:', err);
                this.loading = false;
            }
        });
    }

    toggleQuestion(index: number) {
        this.expandedQuestions[index] = !this.expandedQuestions[index];
    }

    getScoreColor(): string {
        const percentage = this.results?.percentage || 0;
        if (percentage >= this.results?.passing_score) {
            return '#28a745';
        } else {
            return '#dc3545';
        }
    }

    retakeQuiz() {
        window.location.href = `/quiz/${this.quizId}`;
    }
}

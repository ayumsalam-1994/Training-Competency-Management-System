import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
    selector: 'app-quiz-attempt',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './quiz-attempt.html',
    styleUrls: ['./quiz-attempt.css']
})
export class QuizAttemptComponent implements OnInit {
    quizId: number = 0;
    attemptId: number = 0;
    quiz: any = null;
    questions: any[] = [];
    currentQuestionIndex = 0;
    userAnswers: { [key: number]: any } = {};
    loading = false;
    error: string | null = null;
    timeRemaining: number = 0;
    timerInterval: any;
    submitted = false;

    constructor(
        private quizService: QuizService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.quizId = parseInt(params['quizId']);
            this.startQuiz();
        });
    }

    startQuiz() {
        this.loading = true;
        this.error = null;
        this.quizService.startAttempt(this.quizId).subscribe({
            next: (response: any) => {
                this.attemptId = response.data.attempt_id;
                this.quiz = response.data.quiz;
                this.questions = response.data.questions || [];
                this.timeRemaining = (this.quiz.duration || 30) * 60; // Convert to seconds
                this.startTimer();
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to start quiz';
                console.error('Error starting quiz:', err);
                this.loading = false;
            }
        });
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.submitQuiz();
            }
        }, 1000);
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    selectAnswer(optionId: any) {
        const question = this.getCurrentQuestion();
        this.userAnswers[question.id] = optionId;
    }

    isAnswerSelected(optionId: any): boolean {
        const question = this.getCurrentQuestion();
        return this.userAnswers[question.id] === optionId;
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
    }

    submitQuiz() {
        if (this.submitted) return;

        clearInterval(this.timerInterval);
        this.loading = true;
        this.submitted = true;

        this.quizService.submitQuiz(this.quizId, this.attemptId).subscribe({
            next: (response: any) => {
                // Store results and navigate to results page
                sessionStorage.setItem(`quiz-results-${this.attemptId}`, JSON.stringify(response.data));
                window.location.href = `/quiz/${this.quizId}/attempt/${this.attemptId}/results`;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to submit quiz';
                console.error('Error submitting quiz:', err);
                this.submitted = false;
                this.loading = false;
            }
        });
    }

    formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    getProgressPercentage(): number {
        return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    }

    getAnsweredCount(): number {
        return Object.keys(this.userAnswers).length;
    }
}

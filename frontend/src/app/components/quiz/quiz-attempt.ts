import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    attemptId: string | number = 0;
    realAttemptId: number | null = null;
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
        private route: ActivatedRoute,
        private router: Router
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

        // If user answered at least one question, submit answers
        if (Object.keys(this.userAnswers).length > 0) {
            // Submit the first answer to convert temp ID to real ID
            const firstQuestionId = Object.keys(this.userAnswers)[0];
            const firstAnswerId = parseInt(firstQuestionId);

            this.quizService.submitAnswer(
                this.quizId,
                this.attemptId,
                firstAnswerId,
                this.userAnswers[firstAnswerId]
            ).subscribe({
                next: (response: any) => {
                    // Get the real attempt ID from first response
                    const realAttemptId = response.data?.attempt_id || this.attemptId;

                    // Now submit remaining answers with the real attempt ID
                    const remainingQuestionIds = Object.keys(this.userAnswers).slice(1);

                    if (remainingQuestionIds.length === 0) {
                        // Only one question answered, go straight to complete
                        this.completeQuiz(realAttemptId);
                    } else {
                        // Submit remaining answers
                        const submitRemainingAnswers = remainingQuestionIds.map((questionId) => {
                            const qId = parseInt(questionId);
                            return this.quizService.submitAnswer(
                                this.quizId,
                                realAttemptId,
                                qId,
                                this.userAnswers[qId]
                            ).toPromise();
                        });

                        Promise.all(submitRemainingAnswers)
                            .then(() => {
                                this.completeQuiz(realAttemptId);
                            })
                            .catch((err) => {
                                console.error('Error submitting remaining answers:', err);
                                this.error = 'Failed to submit all answers';
                                this.submitted = false;
                                this.loading = false;
                            });
                    }
                },
                error: (err) => {
                    console.error('Error submitting first answer:', err);
                    this.error = 'Failed to submit first answer: ' + (err.error?.error || err.message);
                    this.submitted = false;
                    this.loading = false;
                }
            });
        } else {
            // If no answers, don't count as attempt
            this.error = 'Please answer at least one question before submitting';
            this.submitted = false;
            this.loading = false;
        }
    }

    private completeQuiz(attemptId: string | number) {
        this.quizService.submitQuiz(this.quizId, attemptId).subscribe({
            next: (response: any) => {
                // Store results and navigate to results page
                sessionStorage.setItem(`quiz-results-${attemptId}`, JSON.stringify(response.data));
                this.router.navigate(['/quiz', this.quizId, 'attempt', attemptId, 'results']);
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

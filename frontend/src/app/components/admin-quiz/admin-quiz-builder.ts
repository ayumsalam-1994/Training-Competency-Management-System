import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
    selector: 'app-admin-quiz-builder',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './admin-quiz-builder.html',
    styleUrls: ['./admin-quiz-builder.css']
})
export class AdminQuizBuilderComponent implements OnInit {
    quizId: number | null = null;
    quiz: any = {
        title: '',
        description: '',
        duration: 30,
        passing_score: 60,
        difficulty: 'medium'
    };
    questions: any[] = [];
    loading = false;
    error: string | null = null;
    success: string | null = null;
    activeTab: 'quiz-info' | 'questions' = 'quiz-info';
    showQuestionForm = false;
    editingQuestionId: number | null = null;

    currentQuestion = {
        question_text: '',
        question_type: 'mcq',
        correct_answer: '',
        explanation: '',
        time_limit: null,
        options: [] as any[]
    };

    constructor(
        private quizService: QuizService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params['quizId']) {
                this.quizId = parseInt(params['quizId']);
                this.loadQuiz();
            }
        });
    }

    loadQuiz() {
        if (!this.quizId) return;
        this.loading = true;
        this.quizService.getQuizById(this.quizId).subscribe({
            next: (response: any) => {
                this.quiz = response.data;
                this.loadQuestions();
            },
            error: (err) => {
                this.error = 'Failed to load quiz';
                this.loading = false;
            }
        });
    }

    loadQuestions() {
        if (!this.quizId) return;
        this.quizService.getAdminQuestions(this.quizId).subscribe({
            next: (response: any) => {
                this.questions = response.data || [];
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load questions';
                this.loading = false;
            }
        });
    }

    saveQuiz() {
        this.loading = true;
        this.error = null;
        this.success = null;

        const action = this.quizId
            ? this.quizService.updateAdminQuiz(this.quizId, this.quiz)
            : this.quizService.createAdminQuiz(this.quiz);

        action.subscribe({
            next: (response: any) => {
                this.success = this.quizId ? 'Quiz updated successfully' : 'Quiz created successfully';
                if (!this.quizId) {
                    this.quizId = response.data.id;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to save quiz';
                this.loading = false;
            }
        });
    }

    openQuestionForm(question?: any) {
        if (question) {
            this.editingQuestionId = question.id;
            this.currentQuestion = { ...question };
            if (question.options) {
                this.currentQuestion.options = [...question.options];
            }
        } else {
            this.resetQuestionForm();
        }
        this.showQuestionForm = true;
    }

    resetQuestionForm() {
        this.editingQuestionId = null;
        this.currentQuestion = {
            question_text: '',
            question_type: 'mcq',
            correct_answer: '',
            explanation: '',
            time_limit: null,
            options: []
        };
    }

    closeQuestionForm() {
        this.showQuestionForm = false;
        this.resetQuestionForm();
    }

    addOption() {
        this.currentQuestion.options.push({ option_text: '', is_correct: false });
    }

    removeOption(index: number) {
        this.currentQuestion.options.splice(index, 1);
    }

    saveQuestion() {
        if (!this.quiz.id && !this.quizId) {
            this.error = 'Please save the quiz first';
            return;
        }

        const qId = this.quizId || this.quiz.id;

        if (!this.currentQuestion.question_text) {
            this.error = 'Question text is required';
            return;
        }

        if (this.currentQuestion.question_type === 'mcq' && this.currentQuestion.options.length < 2) {
            this.error = 'MCQ must have at least 2 options';
            return;
        }

        this.loading = true;
        this.error = null;

        if (this.editingQuestionId) {
            this.quizService.updateAdminQuestion(qId, this.editingQuestionId, this.currentQuestion).subscribe({
                next: (response: any) => {
                    this.success = 'Question updated successfully';
                    this.loadQuestions();
                    this.closeQuestionForm();
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Failed to update question';
                    this.loading = false;
                }
            });
        } else {
            this.quizService.createAdminQuestion(qId, this.currentQuestion).subscribe({
                next: (response: any) => {
                    this.success = 'Question created successfully';
                    this.loadQuestions();
                    this.closeQuestionForm();
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Failed to create question';
                    this.loading = false;
                }
            });
        }
    }

    deleteQuestion(questionId: number) {
        if (!this.quizId) return;
        if (!confirm('Are you sure you want to delete this question?')) return;

        this.loading = true;
        this.quizService.deleteAdminQuestion(this.quizId, questionId).subscribe({
            next: () => {
                this.success = 'Question deleted successfully';
                this.loadQuestions();
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to delete question';
                this.loading = false;
            }
        });
    }

    deleteQuiz() {
        if (!this.quizId) return;
        if (!confirm('Are you sure you want to delete this entire quiz? This action cannot be undone.')) return;

        this.loading = true;
        this.quizService.deleteAdminQuiz(this.quizId).subscribe({
            next: () => {
                window.location.href = '/admin/quizzes';
            },
            error: (err) => {
                this.error = 'Failed to delete quiz';
                this.loading = false;
            }
        });
    }

    getQuestionTypeLabel(type: string): string {
        const labels: { [key: string]: string } = {
            'mcq': 'Multiple Choice',
            'true_false': 'True/False',
            'short_answer': 'Short Answer'
        };
        return labels[type] || type;
    }
}

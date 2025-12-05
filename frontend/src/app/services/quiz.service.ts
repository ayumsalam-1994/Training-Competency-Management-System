import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private apiUrl = 'http://localhost:4000/quiz';
    private adminApiUrl = 'http://localhost:4000/admin/quiz';

    constructor(private http: HttpClient) { }

    // ===== USER ENDPOINTS (Public) =====

    // Get all quizzes (public)
    getAllQuizzes(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    // Get quiz details
    getQuizById(quizId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${quizId}`);
    }

    // Get quiz questions with options
    getQuizQuestions(quizId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${quizId}/questions`);
    }

    // Start a quiz attempt
    startAttempt(quizId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${quizId}/attempt/start`, {});
    }

    // Submit an answer
    submitAnswer(quizId: number, attemptId: number, questionId: number, userAnswer: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${quizId}/attempt/${attemptId}/answer`, {
            question_id: questionId,
            user_answer: userAnswer
        });
    }

    // Complete quiz and get results
    submitQuiz(quizId: number, attemptId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${quizId}/attempt/${attemptId}/submit`, {});
    }

    // Get attempt results
    getAttemptResults(quizId: number, attemptId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${quizId}/attempt/${attemptId}/results`);
    }

    // Get user's attempts
    getUserAttempts(quizId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${quizId}/my-attempts`);
    }

    // ===== ADMIN ENDPOINTS =====

    // Create a new quiz (admin)
    createAdminQuiz(quiz: any): Observable<any> {
        return this.http.post(`${this.adminApiUrl}`, quiz);
    }

    // Update a quiz (admin)
    updateAdminQuiz(quizId: number, quiz: any): Observable<any> {
        return this.http.put(`${this.adminApiUrl}/${quizId}`, quiz);
    }

    // Delete a quiz (admin)
    deleteAdminQuiz(quizId: number): Observable<any> {
        return this.http.delete(`${this.adminApiUrl}/${quizId}`);
    }

    // Get all questions for a quiz (admin - with editing info)
    getAdminQuestions(quizId: number): Observable<any> {
        return this.http.get(`${this.adminApiUrl}/${quizId}/questions`);
    }

    // Get a specific question (admin)
    getAdminQuestion(quizId: number, questionId: number): Observable<any> {
        return this.http.get(`${this.adminApiUrl}/${quizId}/questions/${questionId}`);
    }

    // Create a new question (admin)
    createAdminQuestion(quizId: number, question: any): Observable<any> {
        return this.http.post(`${this.adminApiUrl}/${quizId}/questions`, question);
    }

    // Update a question (admin)
    updateAdminQuestion(quizId: number, questionId: number, question: any): Observable<any> {
        return this.http.put(`${this.adminApiUrl}/${quizId}/questions/${questionId}`, question);
    }

    // Delete a question (admin)
    deleteAdminQuestion(quizId: number, questionId: number): Observable<any> {
        return this.http.delete(`${this.adminApiUrl}/${quizId}/questions/${questionId}`);
    }

    // Create a question option (admin)
    createAdminOption(quizId: number, questionId: number, option: any): Observable<any> {
        return this.http.post(`${this.adminApiUrl}/${quizId}/questions/${questionId}/options`, option);
    }

    // Update a question option (admin)
    updateAdminOption(quizId: number, questionId: number, optionId: number, option: any): Observable<any> {
        return this.http.put(`${this.adminApiUrl}/${quizId}/questions/${questionId}/options/${optionId}`, option);
    }

    // Delete a question option (admin)
    deleteAdminOption(quizId: number, questionId: number, optionId: number): Observable<any> {
        return this.http.delete(`${this.adminApiUrl}/${quizId}/questions/${questionId}/options/${optionId}`);
    }
}

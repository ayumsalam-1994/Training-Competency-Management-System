import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private apiUrl = 'http://localhost:4000/quiz';
    private adminApiUrl = 'http://localhost:4000/admin/quiz';

    constructor(private http: HttpClient) { }

    // Get authorization headers
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('auth_token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

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
        return this.http.post(`${this.apiUrl}/${quizId}/attempt/start`, {}, {
            headers: this.getAuthHeaders()
        });
    }

    // Submit an answer
    submitAnswer(quizId: number, attemptId: string | number, questionId: number, userAnswer: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${quizId}/attempt/${attemptId}/answer`, {
            question_id: questionId,
            user_answer: userAnswer
        }, {
            headers: this.getAuthHeaders()
        });
    }

    // Complete quiz and get results
    submitQuiz(quizId: number, attemptId: string | number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${quizId}/attempt/${attemptId}/submit`, {}, {
            headers: this.getAuthHeaders()
        });
    }

    // Get attempt results
    getAttemptResults(quizId: number, attemptId: string | number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${quizId}/attempt/${attemptId}/results`, {
            headers: this.getAuthHeaders()
        });
    }

    // Get user's attempts
    getUserAttempts(quizId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${quizId}/my-attempts`, {
            headers: this.getAuthHeaders()
        });
    }

    // ===== ADMIN ENDPOINTS =====

    // Create a new quiz (admin)
    createAdminQuiz(quiz: any): Observable<any> {
        return this.http.post(`${this.adminApiUrl}`, quiz, {
            headers: this.getAuthHeaders()
        });
    }

    // Update a quiz (admin)
    updateAdminQuiz(quizId: number, quiz: any): Observable<any> {
        return this.http.put(`${this.adminApiUrl}/${quizId}`, quiz, {
            headers: this.getAuthHeaders()
        });
    }

    // Delete a quiz (admin)
    deleteAdminQuiz(quizId: number): Observable<any> {
        return this.http.delete(`${this.adminApiUrl}/${quizId}`, {
            headers: this.getAuthHeaders()
        });
    }

    // Get all questions for a quiz (admin - with editing info)
    getAdminQuestions(quizId: number): Observable<any> {
        return this.http.get(`${this.adminApiUrl}/${quizId}/questions`, {
            headers: this.getAuthHeaders()
        });
    }

    // Get a specific question (admin)
    getAdminQuestion(quizId: number, questionId: number): Observable<any> {
        return this.http.get(`${this.adminApiUrl}/${quizId}/questions/${questionId}`, {
            headers: this.getAuthHeaders()
        });
    }

    // Create a new question (admin)
    createAdminQuestion(quizId: number, question: any): Observable<any> {
        return this.http.post(`${this.adminApiUrl}/${quizId}/questions`, question, {
            headers: this.getAuthHeaders()
        });
    }

    // Update a question (admin)
    updateAdminQuestion(quizId: number, questionId: number, question: any): Observable<any> {
        return this.http.put(`${this.adminApiUrl}/${quizId}/questions/${questionId}`, question, {
            headers: this.getAuthHeaders()
        });
    }

    // Delete a question (admin)
    deleteAdminQuestion(quizId: number, questionId: number): Observable<any> {
        return this.http.delete(`${this.adminApiUrl}/${quizId}/questions/${questionId}`, {
            headers: this.getAuthHeaders()
        });
    }

    // Create a question option (admin)
    createAdminOption(quizId: number, questionId: number, option: any): Observable<any> {
        return this.http.post(`${this.adminApiUrl}/${quizId}/questions/${questionId}/options`, option, {
            headers: this.getAuthHeaders()
        });
    }

    // Update a question option (admin)
    updateAdminOption(quizId: number, questionId: number, optionId: number, option: any): Observable<any> {
        return this.http.put(`${this.adminApiUrl}/${quizId}/questions/${questionId}/options/${optionId}`, option, {
            headers: this.getAuthHeaders()
        });
    }

    // Delete a question option (admin)
    deleteAdminOption(quizId: number, questionId: number, optionId: number): Observable<any> {
        return this.http.delete(`${this.adminApiUrl}/${quizId}/questions/${questionId}/options/${optionId}`, {
            headers: this.getAuthHeaders()
        });
    }
}

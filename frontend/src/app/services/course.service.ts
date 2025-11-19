import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private apiUrl = 'http://localhost:3000/api/courses'; // Adjust API URL as needed

    private courseDraft: any = null;

    constructor(private http: HttpClient) { }

    setCourseDraft(data: any) {
        this.courseDraft = data;
    }

    getCourseDraft() {
        return this.courseDraft;
    }

    clearCourseDraft() {
        this.courseDraft = null;
    }

    createCourse(course: Course): Observable<Course> {
        // Mocking the backend response for now since we are focusing on frontend
        const mockCourse = { ...course, id: Math.floor(Math.random() * 1000) };
        return of(mockCourse).pipe(delay(500));
        // return this.http.post<Course>(this.apiUrl, course);
    }
}

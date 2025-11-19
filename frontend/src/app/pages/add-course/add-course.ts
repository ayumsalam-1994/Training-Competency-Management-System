import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-add-course',
  imports: [ReactiveFormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse implements OnInit, OnDestroy {
  courseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      video: [null, Validators.required] // Handle file upload separately if needed
    });
  }

  ngOnInit() {
    const draft = this.courseService.getCourseDraft();
    if (draft) {
      this.courseForm.patchValue(draft);
    }
  }

  ngOnDestroy() {
    if (this.courseForm.dirty && !this.courseForm.valid) {
      this.courseService.setCourseDraft(this.courseForm.value);
    }
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const newCourse: Course = this.courseForm.value;
      // For now, we'll just log the value. 
      // In a real app, you'd handle file uploads and then call the service.
      console.log('Course Data:', newCourse);

      this.courseService.createCourse(newCourse).subscribe({
        next: (res) => {
          console.log('Course created successfully!', res);
          this.courseService.clearCourseDraft(); // Clear draft on success
          // Navigate to create-coursepage with the new course ID
          // Assuming res contains the created course with an ID
          // For now, using a placeholder ID if res.id is missing
          const courseId = res.id || 1;
          this.router.navigate(['/create-coursepage', courseId]);
        },
        error: (err) => {
          console.error('Error creating course:', err);
        }
      });
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-coursepage',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-coursepage.html',
  styleUrl: './create-coursepage.css',
})
export class CreateCoursepage {
  courseId: string | null = null;
  courseContentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.courseContentForm = this.fb.group({
      sections: this.fb.array([])
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    // Here you would typically fetch existing course content if editing
  }

  get sections() {
    return this.courseContentForm.get('sections') as FormArray;
  }

  addSection() {
    const sectionGroup = this.fb.group({
      title: ['', Validators.required],
      chapters: this.fb.array([])
    });
    this.sections.push(sectionGroup);
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
  }

  getChapters(sectionIndex: number) {
    return this.sections.at(sectionIndex).get('chapters') as FormArray;
  }

  addChapter(sectionIndex: number) {
    const chapterGroup = this.fb.group({
      title: ['', Validators.required],
      type: ['video', Validators.required], // 'video' or 'text'
      content: [''] // URL or text content
    });
    this.getChapters(sectionIndex).push(chapterGroup);
  }

  removeChapter(sectionIndex: number, chapterIndex: number) {
    this.getChapters(sectionIndex).removeAt(chapterIndex);
  }

  onSubmit() {
    if (this.courseContentForm.valid) {
      console.log('Course Content:', this.courseContentForm.value);
      // Call service to save course content
    }
  }
}

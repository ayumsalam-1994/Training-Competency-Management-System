import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CreateCoursepage } from './create-coursepage';

describe('CreateCoursepage', () => {
  let component: CreateCoursepage;
  let fixture: ComponentFixture<CreateCoursepage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCoursepage],
      providers: [
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateCoursepage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

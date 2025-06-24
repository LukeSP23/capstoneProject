import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupFormPage } from './signup-form.page';

describe('SignupFormPage', () => {
  let component: SignupFormPage;
  let fixture: ComponentFixture<SignupFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

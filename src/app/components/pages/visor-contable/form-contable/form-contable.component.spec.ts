import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContableComponent } from './form-contable.component';

describe('FormContableComponent', () => {
  let component: FormContableComponent;
  let fixture: ComponentFixture<FormContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

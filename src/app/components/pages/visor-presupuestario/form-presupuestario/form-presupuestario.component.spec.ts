import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPresupuestarioComponent } from './form-presupuestario.component';

describe('FormPresupuestarioComponent', () => {
  let component: FormPresupuestarioComponent;
  let fixture: ComponentFixture<FormPresupuestarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPresupuestarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPresupuestarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

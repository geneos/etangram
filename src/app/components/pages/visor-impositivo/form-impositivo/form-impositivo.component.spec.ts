import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormImpositivoComponent } from './form-impositivo.component';

describe('FormImpositivoComponent', () => {
  let component: FormImpositivoComponent;
  let fixture: ComponentFixture<FormImpositivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormImpositivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormImpositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

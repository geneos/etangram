import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCrdComponent } from './consulta-crd.component';

describe('ConsultaCrdComponent', () => {
  let component: ConsultaCrdComponent;
  let fixture: ComponentFixture<ConsultaCrdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaCrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

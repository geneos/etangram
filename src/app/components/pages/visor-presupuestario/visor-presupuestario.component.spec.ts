import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorPresupuestarioComponent } from './visor-presupuestario.component';

describe('VisorPresupuestarioComponent', () => {
  let component: VisorPresupuestarioComponent;
  let fixture: ComponentFixture<VisorPresupuestarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorPresupuestarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorPresupuestarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

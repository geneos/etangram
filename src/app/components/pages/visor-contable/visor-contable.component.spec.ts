import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorContableComponent } from './visor-contable.component';

describe('VisorContableComponent', () => {
  let component: VisorContableComponent;
  let fixture: ComponentFixture<VisorContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

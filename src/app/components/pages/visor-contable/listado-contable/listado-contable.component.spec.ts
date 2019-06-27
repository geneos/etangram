import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoContableComponent } from './listado-contable.component';

describe('ListadoContableComponent', () => {
  let component: ListadoContableComponent;
  let fixture: ComponentFixture<ListadoContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

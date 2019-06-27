import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComprobantesComponent } from './lista-comprobantes.component';

describe('ListaComprobantesComponent', () => {
  let component: ListaComprobantesComponent;
  let fixture: ComponentFixture<ListaComprobantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaComprobantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaComprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

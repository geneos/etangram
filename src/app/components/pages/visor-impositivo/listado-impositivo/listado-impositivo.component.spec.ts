import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoImpositivoComponent } from './listado-impositivo.component';

describe('ListadoImpositivoComponent', () => {
  let component: ListadoImpositivoComponent;
  let fixture: ComponentFixture<ListadoImpositivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoImpositivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoImpositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

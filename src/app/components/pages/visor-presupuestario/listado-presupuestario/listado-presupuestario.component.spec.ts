import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPresupuestarioComponent } from './listado-presupuestario.component';

describe('ListadoPresupuestarioComponent', () => {
  let component: ListadoPresupuestarioComponent;
  let fixture: ComponentFixture<ListadoPresupuestarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoPresupuestarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPresupuestarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

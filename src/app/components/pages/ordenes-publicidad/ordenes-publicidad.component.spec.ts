import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesPublicidadComponent } from './ordenes-publicidad.component';

describe('OrdenesPublicidadComponent', () => {
  let component: OrdenesPublicidadComponent;
  let fixture: ComponentFixture<OrdenesPublicidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesPublicidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesPublicidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleComprobanteComponent } from './detalle-comprobante.component';

describe('DetalleComprobanteComponent', () => {
  let component: DetalleComprobanteComponent;
  let fixture: ComponentFixture<DetalleComprobanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleComprobanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

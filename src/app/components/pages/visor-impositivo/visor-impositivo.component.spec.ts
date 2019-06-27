import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorImpositivoComponent } from './visor-impositivo.component';

describe('VisorImpositivoComponent', () => {
  let component: VisorImpositivoComponent;
  let fixture: ComponentFixture<VisorImpositivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorImpositivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorImpositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

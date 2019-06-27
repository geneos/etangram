import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfComponent } from './dialogo-conf.component';

describe('DialogoConfComponent', () => {
  let component: DialogoConfComponent;
  let fixture: ComponentFixture<DialogoConfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoConfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

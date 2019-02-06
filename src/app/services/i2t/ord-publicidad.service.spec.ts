import { TestBed } from '@angular/core/testing';

import { OrdPublicidadService } from './ord-publicidad.service';

describe('OrdPublicidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrdPublicidadService = TestBed.get(OrdPublicidadService);
    expect(service).toBeTruthy();
  });
});

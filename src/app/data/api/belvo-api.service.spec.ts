import { TestBed } from '@angular/core/testing';

import { BelvoApiService } from './belvo-api.service';

describe('BelvoApiService', () => {
  let service: BelvoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BelvoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

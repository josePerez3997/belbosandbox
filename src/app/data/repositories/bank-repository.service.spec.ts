import { TestBed } from '@angular/core/testing';

import { BankRepositoryService } from './bank-repository.service';

describe('BankRepositoryService', () => {
  let service: BankRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

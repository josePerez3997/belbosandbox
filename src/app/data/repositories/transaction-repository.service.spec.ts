import { TestBed } from '@angular/core/testing';

import { TransactionRepositoryService } from './transaction-repository.service';

describe('TransactionRepositoryService', () => {
  let service: TransactionRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

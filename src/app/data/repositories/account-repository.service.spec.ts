import { TestBed } from '@angular/core/testing';

import { AccountRepositoryService } from './account-repository.service';

describe('AccountRepositoryService', () => {
  let service: AccountRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

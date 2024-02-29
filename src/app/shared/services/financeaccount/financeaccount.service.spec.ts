import { TestBed } from '@angular/core/testing';

import { FinanceaccountService } from './financeaccount.service';

describe('FinanceaccountService', () => {
  let service: FinanceaccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinanceaccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

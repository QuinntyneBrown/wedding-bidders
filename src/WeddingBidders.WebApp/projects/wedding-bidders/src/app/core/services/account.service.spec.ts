import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { environment } from '../../../environments/environment';
import { Account, Billing } from '../models';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  const mockAccount: Account = {
    accountId: 'acc-123',
    name: 'Wedding Account',
    email: 'wedding@example.com'
  };

  const mockBilling: Billing = {
    billingId: 'bill-123',
    accountId: 'acc-123',
    amount: 500,
    status: 'paid'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountService]
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrentAccount', () => {
    it('should return the current account', () => {
      service.getCurrentAccount().subscribe(account => {
        expect(account).toEqual(mockAccount);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/account/current`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAccount);
    });
  });

  describe('getBilling', () => {
    it('should return the billing information', () => {
      service.getBilling().subscribe(billing => {
        expect(billing).toEqual(mockBilling);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/account/billing`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBilling);
    });
  });
});

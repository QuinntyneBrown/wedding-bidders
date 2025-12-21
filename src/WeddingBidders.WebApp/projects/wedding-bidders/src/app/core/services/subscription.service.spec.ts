import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubscriptionService, ChargeSubscriptionRequest, ChargeSubscriptionResponse } from './subscription.service';
import { environment } from '../../../environments/environment';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubscriptionService]
    });

    service = TestBed.inject(SubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('charge', () => {
    it('should successfully charge a subscription', () => {
      const chargeRequest: ChargeSubscriptionRequest = {
        token: 'tok_visa_123'
      };

      const chargeResponse: ChargeSubscriptionResponse = {
        success: true,
        message: 'Payment successful'
      };

      service.charge(chargeRequest).subscribe(response => {
        expect(response).toEqual(chargeResponse);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/subscription/charge`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(chargeRequest);
      req.flush(chargeResponse);
    });

    it('should handle failed charge', () => {
      const chargeRequest: ChargeSubscriptionRequest = {
        token: 'tok_declined'
      };

      const chargeResponse: ChargeSubscriptionResponse = {
        success: false,
        message: 'Card was declined'
      };

      service.charge(chargeRequest).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.message).toBe('Card was declined');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/subscription/charge`);
      expect(req.request.method).toBe('POST');
      req.flush(chargeResponse);
    });
  });
});

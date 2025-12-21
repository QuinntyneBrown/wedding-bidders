import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BidService } from './bid.service';
import { environment } from '../../../environments/environment';
import { Bid, CreateBidRequest } from '../models';

describe('BidService', () => {
  let service: BidService;
  let httpMock: HttpTestingController;

  const mockBid: Bid = {
    bidId: '123',
    weddingId: 'wedding-1',
    bidderId: 'bidder-1',
    price: 5000.00,
    description: 'Professional photography services'
  };

  const mockBids: Bid[] = [
    mockBid,
    {
      bidId: '456',
      weddingId: 'wedding-1',
      bidderId: 'bidder-2',
      price: 6000.00,
      description: 'Premium photography package'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BidService]
    });

    service = TestBed.inject(BidService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('createBid', () => {
    it('should create a bid', () => {
      const createRequest: CreateBidRequest = {
        weddingId: 'wedding-1',
        price: 5000.00,
        description: 'Professional photography services'
      };

      service.createBid(createRequest).subscribe(bid => {
        expect(bid).toEqual(mockBid);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bid/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockBid);
    });
  });

  describe('getBidsByWeddingId', () => {
    it('should return bids for a wedding', () => {
      service.getBidsByWeddingId('wedding-1').subscribe(bids => {
        expect(bids).toEqual(mockBids);
        expect(bids.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bid/getAllByWeddingId?id=wedding-1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBids);
    });

    it('should return empty array when no bids exist', () => {
      service.getBidsByWeddingId('wedding-empty').subscribe(bids => {
        expect(bids).toEqual([]);
        expect(bids.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bid/getAllByWeddingId?id=wedding-empty`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getBidsByBidderId', () => {
    it('should return bids for a bidder', () => {
      service.getBidsByBidderId('bidder-1').subscribe(bids => {
        expect(bids).toEqual([mockBid]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bid/getAllByCatererId?id=bidder-1`);
      expect(req.request.method).toBe('GET');
      req.flush([mockBid]);
    });
  });

  describe('getBidsByCurrentProfile', () => {
    it('should return bids for current profile', () => {
      service.getBidsByCurrentProfile().subscribe(bids => {
        expect(bids).toEqual(mockBids);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bid/getAllByCurrentProfile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBids);
    });
  });
});

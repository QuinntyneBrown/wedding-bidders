import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BidderService } from './bidder.service';
import { environment } from '../../../environments/environment';
import { Bidder, BidderTypeDto, RegisterBidderRequest, RegisterBidderResponse } from '../models';

describe('BidderService', () => {
  let service: BidderService;
  let httpMock: HttpTestingController;

  const mockBidder: Bidder = {
    bidderId: '123',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    companyName: 'Photo Pro',
    description: 'Professional photographer',
    bidderType: 1, // Photographer
    isApproved: true
  };

  const mockBidders: Bidder[] = [
    mockBidder,
    {
      bidderId: '456',
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane@example.com',
      companyName: 'Catering Co',
      description: 'Catering services',
      bidderType: 0, // Caterer
      isApproved: true
    }
  ];

  const mockBidderTypes: BidderTypeDto[] = [
    { value: 0, name: 'Caterer' },
    { value: 1, name: 'Photographer' },
    { value: 2, name: 'MakeUpArtist' },
    { value: 3, name: 'EventPlanner' },
    { value: 4, name: 'DiscJockey' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BidderService]
    });

    service = TestBed.inject(BidderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrentBidder', () => {
    it('should return current bidder', () => {
      service.getCurrentBidder().subscribe(bidder => {
        expect(bidder).toEqual(mockBidder);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bidder/current`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBidder);
    });
  });

  describe('getAllBidders', () => {
    it('should return all bidders', () => {
      service.getAllBidders().subscribe(bidders => {
        expect(bidders).toEqual(mockBidders);
        expect(bidders.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bidder/getAll`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBidders);
    });
  });

  describe('getBidderById', () => {
    it('should return bidder by id', () => {
      service.getBidderById('123').subscribe(bidder => {
        expect(bidder).toEqual(mockBidder);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bidder/getById?id=123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBidder);
    });
  });

  describe('getBidderByBidId', () => {
    it('should return bidder by bid id', () => {
      service.getBidderByBidId('bid-123').subscribe(bidder => {
        expect(bidder).toEqual(mockBidder);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bidder/GetByBidId?bidId=bid-123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBidder);
    });
  });

  describe('getBidderByProfileId', () => {
    it('should return bidder by profile id', () => {
      service.getBidderByProfileId('profile-123').subscribe(bidder => {
        expect(bidder).toEqual(mockBidder);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bidder/GetByProfileId?profileId=profile-123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBidder);
    });
  });

  describe('getBidderTypes', () => {
    it('should return all bidder types', () => {
      service.getBidderTypes().subscribe(types => {
        expect(types).toEqual(mockBidderTypes);
        expect(types.length).toBe(5);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bidder/gettypes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBidderTypes);
    });
  });

  describe('registerBidder', () => {
    it('should register a new bidder', () => {
      const registerRequest: RegisterBidderRequest = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        companyName: 'Photo Pro',
        description: 'Professional photographer',
        bidderType: 1
      };

      const registerResponse: RegisterBidderResponse = {
        success: true,
        message: 'Registration successful',
        bidderId: '123'
      };

      service.registerBidder(registerRequest).subscribe(response => {
        expect(response).toEqual(registerResponse);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bidder/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(registerResponse);
    });

    it('should handle registration failure', () => {
      const registerRequest: RegisterBidderRequest = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'existing@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        bidderType: 0
      };

      const registerResponse: RegisterBidderResponse = {
        success: false,
        message: 'Email already exists'
      };

      service.registerBidder(registerRequest).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.message).toBe('Email already exists');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bidder/add`);
      req.flush(registerResponse);
    });
  });
});

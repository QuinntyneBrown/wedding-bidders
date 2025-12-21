import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeddingService } from './wedding.service';
import { environment } from '../../../environments/environment';
import { Wedding, CreateWeddingRequest, UpdateWeddingRequest } from '../models';

describe('WeddingService', () => {
  let service: WeddingService;
  let httpMock: HttpTestingController;

  const mockWedding: Wedding = {
    weddingId: '123',
    numberOfGuests: 150,
    numberOfHours: 6,
    location: 'Toronto, ON',
    date: '2025-06-15T00:00:00Z',
    categories: [{ categoryId: '1', name: 'Photography' }]
  };

  const mockWeddings: Wedding[] = [
    mockWedding,
    {
      weddingId: '456',
      numberOfGuests: 100,
      numberOfHours: 4,
      location: 'Vancouver, BC',
      date: '2025-07-20T00:00:00Z',
      categories: []
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeddingService]
    });

    service = TestBed.inject(WeddingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllWeddings', () => {
    it('should return all weddings', () => {
      service.getAllWeddings().subscribe(weddings => {
        expect(weddings).toEqual(mockWeddings);
        expect(weddings.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/wedding/getAll`);
      expect(req.request.method).toBe('GET');
      req.flush(mockWeddings);
    });
  });

  describe('getWeddingById', () => {
    it('should return a wedding by id', () => {
      service.getWeddingById('123').subscribe(wedding => {
        expect(wedding).toEqual(mockWedding);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/wedding/getById?id=123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockWedding);
    });
  });

  describe('getWeddingsByCustomerId', () => {
    it('should return weddings by customer id', () => {
      service.getWeddingsByCustomerId('customer-123').subscribe(weddings => {
        expect(weddings).toEqual(mockWeddings);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/wedding/getAllByCustomerId?id=customer-123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockWeddings);
    });
  });

  describe('getWeddingsByCurrentProfile', () => {
    it('should return weddings for current profile', () => {
      service.getWeddingsByCurrentProfile().subscribe(weddings => {
        expect(weddings).toEqual(mockWeddings);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/wedding/getAllByCurrentProfile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockWeddings);
    });
  });

  describe('createWedding', () => {
    it('should create a wedding', () => {
      const createRequest: CreateWeddingRequest = {
        numberOfGuests: 150,
        numberOfHours: 6,
        location: 'Toronto, ON',
        date: '2025-06-15T00:00:00Z',
        categories: [{ name: 'Photography' }]
      };

      service.createWedding(createRequest).subscribe(wedding => {
        expect(wedding).toEqual(mockWedding);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/wedding/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockWedding);
    });
  });

  describe('updateWedding', () => {
    it('should update a wedding', () => {
      const updateRequest: UpdateWeddingRequest = {
        weddingId: '123',
        numberOfGuests: 200,
        numberOfHours: 8,
        location: 'Toronto, ON',
        date: '2025-06-15T00:00:00Z'
      };

      service.updateWedding(updateRequest).subscribe(wedding => {
        expect(wedding).toEqual(mockWedding);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/wedding/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockWedding);
    });
  });

  describe('deleteWedding', () => {
    it('should delete a wedding', () => {
      service.deleteWedding('123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/wedding/remove?id=123`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});

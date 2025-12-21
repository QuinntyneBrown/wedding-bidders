import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';
import { environment } from '../../../environments/environment';
import { Customer, RegisterCustomerRequest, RegisterCustomerResponse } from '../models';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  const mockCustomer: Customer = {
    customerId: '123',
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@example.com'
  };

  const mockCustomers: Customer[] = [
    mockCustomer,
    {
      customerId: '456',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrentCustomer', () => {
    it('should return current customer', () => {
      service.getCurrentCustomer().subscribe(customer => {
        expect(customer).toEqual(mockCustomer);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/customer/current`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCustomer);
    });
  });

  describe('getAllCustomers', () => {
    it('should return all customers', () => {
      service.getAllCustomers().subscribe(customers => {
        expect(customers).toEqual(mockCustomers);
        expect(customers.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/customer/getAll`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCustomers);
    });
  });

  describe('registerCustomer', () => {
    it('should register a new customer', () => {
      const registerRequest: RegisterCustomerRequest = {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      };

      const registerResponse: RegisterCustomerResponse = {
        success: true,
        message: 'Registration successful',
        customerId: '123'
      };

      service.registerCustomer(registerRequest).subscribe(response => {
        expect(response).toEqual(registerResponse);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/customer/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(registerResponse);
    });

    it('should handle registration failure', () => {
      const registerRequest: RegisterCustomerRequest = {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'existing@example.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      };

      const registerResponse: RegisterCustomerResponse = {
        success: false,
        message: 'Email already exists'
      };

      service.registerCustomer(registerRequest).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.message).toBe('Email already exists');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/customer/add`);
      req.flush(registerResponse);
    });
  });
});

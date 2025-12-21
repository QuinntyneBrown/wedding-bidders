export interface Customer {
  customerId: string;
  firstname: string;
  lastname: string;
  email: string;
  profileId?: string;
}

export interface RegisterCustomerRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterCustomerResponse {
  success: boolean;
  message: string;
  customerId?: string;
}

export interface Wedding {
  weddingId: string;
  numberOfGuests: number;
  numberOfHours: number;
  location: string;
  date: string;
  customerId?: string;
  categories: Category[];
}

export interface Category {
  categoryId: string;
  name: string;
}

export interface CreateWeddingRequest {
  numberOfGuests: number;
  numberOfHours: number;
  location: string;
  date: string;
  categories: { name: string }[];
}

export interface UpdateWeddingRequest {
  weddingId: string;
  numberOfGuests: number;
  numberOfHours: number;
  location: string;
}

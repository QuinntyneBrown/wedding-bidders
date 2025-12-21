export interface Bid {
  bidId: string;
  weddingId?: string;
  bidderId?: string;
  price: number;
  description: string;
}

export interface CreateBidRequest {
  weddingId: string;
  price: number;
  description: string;
}

export enum BidderType {
  Caterer = 0,
  Photographer = 1,
  MakeUpArtist = 2,
  EventPlanner = 3,
  DiscJockey = 4
}

export interface Bidder {
  bidderId: string;
  firstname: string;
  lastname: string;
  email: string;
  companyName?: string;
  description?: string;
  profileId?: string;
  bidderType: BidderType;
  isApproved: boolean;
}

export interface BidderTypeDto {
  name: string;
  value: number;
}

export interface RegisterBidderRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName?: string;
  description?: string;
  bidderType: BidderType;
}

export interface RegisterBidderResponse {
  success: boolean;
  message: string;
  bidderId?: string;
}

export enum ProfileType {
  Customer = 0,
  Caterer = 1,
  Photographer = 2,
  MakeUpArtist = 3,
  EventPlanner = 4,
  Internal = 5,
  DiscJockey = 6
}

export interface Profile {
  profileId: string;
  userId: string;
  firstname: string;
  lastname: string;
  name?: string;
  avatarDigitalAssetId?: string;
  phoneNumber?: string;
  profileType: ProfileType;
  isPersonalized: boolean;
  isApproved: boolean;
  accountEmail?: string;
}

export interface CreateProfileRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  invitationToken: string;
  firstname: string;
  lastname: string;
  avatarDigitalAssetId?: string;
}

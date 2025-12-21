export interface Profile {
  profileId: string;
  userId: string;
  firstname: string;
  lastname: string;
  avatarDigitalAssetId?: string;
  phoneNumber?: string;
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

export interface Message {
  messageId: string;
  conversationId?: string;
  toProfileId?: string;
  fromProfileId?: string;
  subject?: string;
  content: string;
  isRead: boolean;
  createdDate: string;
}

export interface Conversation {
  conversationId: string;
  messages: Message[];
  profiles: ProfileSummary[];
}

export interface ProfileSummary {
  profileId: string;
  firstname: string;
  lastname: string;
}

export interface SendMessageRequest {
  otherProfileId: string;
  content: string;
}

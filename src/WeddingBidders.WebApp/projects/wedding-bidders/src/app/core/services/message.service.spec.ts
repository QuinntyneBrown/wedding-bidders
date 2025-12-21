import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from './message.service';
import { environment } from '../../../environments/environment';
import { Message, Conversation, SendMessageRequest } from '../models';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  const mockMessage: Message = {
    messageId: 'msg-123',
    content: 'Hello, how are you?',
    senderId: 'profile-1',
    receiverId: 'profile-2',
    createdAt: new Date().toISOString()
  };

  const mockMessages: Message[] = [
    mockMessage,
    {
      messageId: 'msg-456',
      content: 'I am fine, thanks!',
      senderId: 'profile-2',
      receiverId: 'profile-1',
      createdAt: new Date().toISOString()
    }
  ];

  const mockConversations: Conversation[] = [
    {
      conversationId: 'conv-123',
      otherProfileId: 'profile-2',
      otherProfileName: 'Jane Doe',
      lastMessage: 'I am fine, thanks!',
      unreadCount: 1
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService]
    });

    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getMessagesByOtherProfileId', () => {
    it('should return messages for a given profile', () => {
      const otherProfileId = 'profile-2';

      service.getMessagesByOtherProfileId(otherProfileId).subscribe(messages => {
        expect(messages).toEqual(mockMessages);
        expect(messages.length).toBe(2);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/message/getByOtherProfileId?otherProfileId=${otherProfileId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockMessages);
    });
  });

  describe('sendMessage', () => {
    it('should send a message', () => {
      const sendRequest: SendMessageRequest = {
        content: 'Hello, world!',
        receiverId: 'profile-2'
      };

      const sentMessage: Message = {
        messageId: 'msg-789',
        content: sendRequest.content,
        senderId: 'profile-1',
        receiverId: sendRequest.receiverId,
        createdAt: new Date().toISOString()
      };

      service.sendMessage(sendRequest).subscribe(message => {
        expect(message).toEqual(sentMessage);
        expect(message.content).toBe(sendRequest.content);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/message/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(sendRequest);
      req.flush(sentMessage);
    });
  });

  describe('getAllConversations', () => {
    it('should return all conversations', () => {
      service.getAllConversations().subscribe(conversations => {
        expect(conversations).toEqual(mockConversations);
        expect(conversations.length).toBe(1);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/conversation/getAll`);
      expect(req.request.method).toBe('GET');
      req.flush(mockConversations);
    });
  });
});

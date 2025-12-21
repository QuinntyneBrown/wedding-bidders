import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, Conversation, SendMessageRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly messageUrl = `${environment.apiUrl}/message`;
  private readonly conversationUrl = `${environment.apiUrl}/conversation`;

  constructor(private http: HttpClient) {}

  getMessagesByOtherProfileId(otherProfileId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.messageUrl}/getByOtherProfileId`, { params: { otherProfileId } });
  }

  sendMessage(request: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.messageUrl}/add`, request);
  }

  getAllConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.conversationUrl}/getAll`);
  }
}

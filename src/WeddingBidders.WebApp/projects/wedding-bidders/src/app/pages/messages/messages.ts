import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileService, MessageService } from '../../core/services';
import { Profile, Message, SendMessageRequest } from '../../core/models';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  templateUrl: './messages.html',
  styleUrls: ['./messages.scss']
})
export class Messages implements OnInit {
  contacts: Profile[] = [];
  messages: Message[] = [];
  selectedContact: Profile | null = null;
  newMessage = '';
  isLoadingContacts = true;
  isLoadingMessages = false;
  isSending = false;
  errorMessage = '';

  constructor(
    private profileService: ProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoadingContacts = true;
    this.profileService.getOthers().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.isLoadingContacts = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load contacts';
        this.isLoadingContacts = false;
      }
    });
  }

  selectContact(contact: Profile): void {
    this.selectedContact = contact;
    this.loadMessages(contact.profileId);
  }

  loadMessages(otherProfileId: string): void {
    this.isLoadingMessages = true;
    this.messageService.getMessagesByOtherProfileId(otherProfileId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoadingMessages = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load messages';
        this.isLoadingMessages = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.selectedContact || !this.newMessage.trim()) return;

    this.isSending = true;
    const request: SendMessageRequest = {
      otherProfileId: this.selectedContact.profileId,
      content: this.newMessage.trim()
    };

    this.messageService.sendMessage(request).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.isSending = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to send message';
        this.isSending = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getContactName(contact: Profile): string {
    return `${contact.firstname} ${contact.lastname}`;
  }
}

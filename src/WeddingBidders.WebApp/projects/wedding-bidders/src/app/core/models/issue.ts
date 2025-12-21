export enum IssueStatus {
  New = 0,
  Open = 1,
  Resolved = 2
}

export interface Issue {
  issueId: string;
  subject: string;
  content: string;
  issueStatus: IssueStatus;
  reportedById: string;
  createdDate: string;
}

export interface CreateIssueRequest {
  subject: string;
  content: string;
}

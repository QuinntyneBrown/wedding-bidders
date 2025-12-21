import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IssueService } from './issue.service';
import { environment } from '../../../environments/environment';
import { Issue, CreateIssueRequest } from '../models';

describe('IssueService', () => {
  let service: IssueService;
  let httpMock: HttpTestingController;

  const mockIssue: Issue = {
    issueId: 'issue-123',
    title: 'Test Issue',
    description: 'This is a test issue',
    status: 'open',
    createdAt: new Date().toISOString()
  };

  const mockIssues: Issue[] = [
    mockIssue,
    {
      issueId: 'issue-456',
      title: 'Another Issue',
      description: 'Another test issue',
      status: 'closed',
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IssueService]
    });

    service = TestBed.inject(IssueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllIssues', () => {
    it('should return all issues', () => {
      service.getAllIssues().subscribe(issues => {
        expect(issues).toEqual(mockIssues);
        expect(issues.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/issue/getAll`);
      expect(req.request.method).toBe('GET');
      req.flush(mockIssues);
    });
  });

  describe('createIssue', () => {
    it('should create a new issue', () => {
      const createRequest: CreateIssueRequest = {
        title: 'New Issue',
        description: 'A new issue description'
      };

      const createdIssue: Issue = {
        issueId: 'issue-789',
        title: createRequest.title,
        description: createRequest.description,
        status: 'open',
        createdAt: new Date().toISOString()
      };

      service.createIssue(createRequest).subscribe(issue => {
        expect(issue).toEqual(createdIssue);
        expect(issue.title).toBe(createRequest.title);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/issue/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(createdIssue);
    });
  });
});

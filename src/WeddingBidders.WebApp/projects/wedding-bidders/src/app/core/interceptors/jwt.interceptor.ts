import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService, ACCESS_TOKEN_KEY } from '../services/local-storage.service';
import { NavigationService } from '../services/navigation.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private navigationService: NavigationService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.localStorageService.remove(ACCESS_TOKEN_KEY);
          this.navigationService.redirectToLogin();
        }
        return throwError(() => error);
      })
    );
  }
}

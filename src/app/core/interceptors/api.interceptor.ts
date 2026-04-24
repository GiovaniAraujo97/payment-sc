import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add authorization header
    const authToken = this.getAuthToken();
    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    // Log request
    console.log('HTTP Request:', req.method, req.url);

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('HTTP Response:', event.status, event.url);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error.status, error.message);
        return throwError(() => error);
      })
    );
  }

  private getAuthToken(): string | null {
    // You can implement token retrieval logic here
    // For now, returning null
    return null;
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Route, Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this._auth.getToken()

    if(token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Bearer <JWT_Token>
        }
      })

      return next.handle(request).pipe(
        catchError((error: any) => {
          if(error instanceof HttpErrorResponse) {
            if(error.status === 401) {
              // Error warning message
              this._router.navigate(['login'])
            }
          }
          return throwError(() => Error("Some error occurs"))
        })
      )
    }
    return next.handle(request);
  }
}

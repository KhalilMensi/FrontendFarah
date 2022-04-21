import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { LoggedInUser } from '../models/loggedInUser';
import { LoginService } from '../services/login/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
      }
    })
    
    /*let currentUser: LoggedInUser;
    this.loginService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
    if(currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }*/
    return next.handle(request);
  }
}

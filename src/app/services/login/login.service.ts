import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { LoggedInUser } from 'src/app/models/loggedInUser';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = 'https://localhost:44389/api/Login';
  private currentUserSource = new ReplaySubject<LoggedInUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http : HttpClient) { }

  login(model: User){
    return this.http.post(this.baseUrl, model).pipe(
      map((response : LoggedInUser) => {
        const loggedInUser = response;
        if(loggedInUser) {
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          this.currentUserSource.next(loggedInUser);
        }
      })
    );
  }

  setCurrentUser(loggetInUser : LoggedInUser){
    this.currentUserSource.next(loggetInUser);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}

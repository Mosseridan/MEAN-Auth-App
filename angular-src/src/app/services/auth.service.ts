import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-type','application/json');
    return this.http.post('users/register', user, {headers: headers}).map((res) => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-type','application/json');
    return this.http.post('users/authenticate', user, {headers: headers}).map((res) => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-type', 'application/json');
    return this.http.get('users/profile', {headers: headers}).map((res) => res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    this.authToken = localStorage.getItem('authToken');
  }

  loggedIn(){
    return tokenNotExpired('authToken');
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}

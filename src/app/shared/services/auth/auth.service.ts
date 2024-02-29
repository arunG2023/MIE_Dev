// Service to check whether the user is authenticated

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userPayLoad : any;

  public getUserDetails = new BehaviorSubject(null);
  public getUserDetails$ = this.getUserDetails.asObservable();

  constructor(private router: Router) {
   
   }

  // Method to check whether user is logged in 
  isLoggedIn(){
    const token = localStorage.getItem('token')
    if(token && token !== '') {
      return true
    }
    return false;
  }

  // Storing the access token once user is logged in
  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue)
    this.decodeToken();
  }

  getToken() {
    const token = localStorage.getItem('token')
    return token
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token')
    const userDetails = jwtHelper.decodeToken(token)
    console.log('userDetails - ', userDetails)
    this.getUserDetails.next(userDetails)
    return userDetails
  }

  // Deleting the access token once user is logged out
  logOut(){
    localStorage.clear();    
    this.router.navigate([''])
  }
}

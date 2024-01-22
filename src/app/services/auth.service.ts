// Service to check whether the user is authenticated

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userPayLoad : any;

  constructor(private router: Router) {
   
   }

  // Method to check whether user is logged in 
  isLoggedIn(){
    return (localStorage.getItem('token'))? true : false;
  }

  // Storing the access token once user is logged in
  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue)
    this.decodeToken();
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token')
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token)
  }

  // Deleting the access token once user is logged out
  logOut(){
    localStorage.clear();
    
    this.router.navigate([''])
  }
}

import { Injectable } from '@angular/core';
import {  CanActivate, Router,  } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  canActivate():boolean{
    if(this.auth.isLoggedIn()){
      return true;
    }else{
      this.router.navigate([''])
      return false;
    }
   
  }

  constructor(private auth : AuthService, private router: Router){
    
  }
  
}

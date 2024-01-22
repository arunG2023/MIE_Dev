
// Google Single Sign On Imports
declare var google:any;
// declare var window:any;
import {CredentialResponse,PromptMomentNotification} from 'google-one-tap'

import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: FormGroup;

  isInvalidCredentials: boolean = false;
  isFormError : boolean = false;

  constructor(private userService: UserServiceService,
              private authService: AuthService, 
              private router: Router,
              private _ngZone:NgZone) { 
    this.login = new FormGroup({
      emailId : new FormControl('', [Validators.required,Validators.email]),
      password : new FormControl('', [Validators.required,Validators.minLength(8)])
    })
  }

  loginUser(){
    
  
    if(this.login.valid){

      const loginRequestBody = {
        "emailId": this.login.value.emailId,
        "password": this.login.value.password
      }
   
      this.userService.loginUser(loginRequestBody).subscribe(
        res => {
          console.log(res)
          if(res.token){
            this.isInvalidCredentials = false
            this.authService.storeToken(res.token);
            this.router.navigate(['dashboard'])
          }
        },
        err => {
          if(err.error && typeof(err.error) == 'string'){
            alert(err.error)
            this.isInvalidCredentials = true;
          }
          else{
            alert("Unexpected Error Happened")
          }
          }
        
        );

    
    
    }
    else{
      this.isFormError = true
    }
  }

  ngOnInit(): void {
    
   
    this.googleSignOn();
  }

  // Implementation of google single sign on

  private googleClientId : string = environment.googleClientId;
  googleSignOn(){
    {
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", width: "100%"}
        );
        google.accounts.id.prompt((notification: PromptMomentNotification)=> {});
      };
  }

  // Method to call handle google single sign on with backend 
  async handleCredentialResponse (response: CredentialResponse){
    
    await this.userService.loginWithGoogle(response.credential).subscribe(
   
      (x:any) => {
      // localStorage.setItem("token", x.token);
      this.isInvalidCredentials = false;
      this.authService.storeToken(x.token);
      this._ngZone.run(() => {
         this.router.navigate(['dashboard']);
      })},
      (error:any) => {
        if(error.error && typeof(error.error) == 'string'){
          alert(error.error)
          this.isInvalidCredentials = true;
        }
        else{
          alert("Unexpected Error Happened")
        }
        }
        );
      }

}

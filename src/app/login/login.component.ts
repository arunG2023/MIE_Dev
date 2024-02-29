
// Google Single Sign On Imports
declare var google:any;
// declare var window:any;
import {CredentialResponse,PromptMomentNotification} from 'google-one-tap'

import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';
import { UserUtility } from '../shared/services/user-utility/user-utility.service';
import { environment } from 'src/environments/environment';
import { Config } from '../shared/config/common-config';
import { SnackBarService } from '../shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: FormGroup;

  isInvalidCredentials: boolean = false;
  isFormError : boolean = false;

  public loadingIndicator = false

  constructor(private userService: UserUtility,
              private authService: AuthService, 
              private router: Router,
              private _ngZone:NgZone,
              private _snackBarService : SnackBarService) { }

  public ngOnInit(): void {   
    this.login = new FormGroup({
      emailId : new FormControl('', [Validators.required,Validators.email]),
      password : new FormControl('', [Validators.required,Validators.minLength(8)])
    })
    // this.googleSignOn();
  }

 public loginUser(){
    this.loadingIndicator = true
    
      if(this.login.valid){

      const loginRequestBody = {
        "emailId": this.login.value.emailId,
        "password": this.login.value.password
      }
   
      this.userService.loginUser(loginRequestBody).subscribe(
        res => {
          this.loadingIndicator = false
          if(res.token){
            this.isInvalidCredentials = false
            this.authService.storeToken(res.token);
            this.router.navigate(['dashboard'])
            this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.LOGIN_SUCCESS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
          }
        },
        err => {
          this.loadingIndicator = false
          if(err.error && typeof(err.error) == 'string'){
            // alert(err.error)
            this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.INVALID_CREDENTIAL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
            this.isInvalidCredentials = true;
          }
          else{
            // alert("Unexpected Error Happened")
            this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          }
          }
        
        );

    
    
    }
    else{
      this.loadingIndicator = false
      this.isFormError = true
    }
  }

  

  // Implementation of google single sign on

  private googleClientId : string = environment.googleClientId;
  private googleSignOn(){
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
        this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.LOGIN_SUCCESS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
         this.router.navigate(['dashboard']);
      })},
      (error:any) => {
        if(error.error && typeof(error.error) == 'string'){
          // alert(error.error)
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.INVALID_CREDENTIAL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          this.isInvalidCredentials = true;
        }
        else{
          // alert("Unexpected Error Happened")
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        }
        }
        );
      }

}

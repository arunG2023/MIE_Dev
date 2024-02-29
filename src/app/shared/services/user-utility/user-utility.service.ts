import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenariniApiUrl } from '../../config/menarini-api-url-config';


@Injectable({
    providedIn: 'root'
  })

export class UserUtility
{
    constructor(private _http : HttpClient) { }

    //login part
    
     // Creating a New User
  createUser(data:any)
  {
    return this._http.post(MenariniApiUrl.registerNewApi,data);
  }

  // Login User
  loginUser(data:any):Observable<any>
  {
    return this._http.post(MenariniApiUrl.loginApi,data)
  }

  // Login User for google single singON
  loginWithGoogle(credentials: string)
    {
    const header = new HttpHeaders().set('Content-type','application/json');
    return this._http.post(MenariniApiUrl.loginwithGoogleApi, JSON.stringify(credentials), { headers: header });
    }
}
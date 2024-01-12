import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import { environment } from 'environments/environment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private baseApiUrl : string = environment.basiApiUrl

  constructor(private http: HttpClient) { }

  // Creating a New User
  createUser(data:any): Observable<any>{
    return this.http.post(this.baseApiUrl+"/LoginAndRegister/RegisterNew",data);
  }

  // Login User
  loginUser(data:any): Observable<any>{
    return this.http.post(this.baseApiUrl+"/LoginAndRegister/Login",data)
  }

  // Login User for google single singON
  loginWithGoogle(credentials: string): Observable<any>{
    const header = new HttpHeaders().set('Content-type','application/json');
    return this.http.post(this.baseApiUrl+"/LoginAndRegister/LoginwithGoogle", JSON.stringify(credentials), { headers: header });
    }

  
}

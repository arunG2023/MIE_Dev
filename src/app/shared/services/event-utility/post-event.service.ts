import { HttpClient } from "@angular/common/http";
import { MenariniApiUrl } from "../../config/menarini-api-url-config";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })

export class PostEventService {
    constructor(
        private _http: HttpClient
      ) { }

    public getPostEventHcpFollowUp()
    {
        return this._http.get(MenariniApiUrl.getPostEventHcpFollowUp);
    }

    public postPostEventHcpFollowUp(payload:any):Observable<any>{
    return this._http.post(MenariniApiUrl.postPostEventHcpFollowUp, payload);
    }
    
}
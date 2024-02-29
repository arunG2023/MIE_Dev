import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenariniApiUrl } from '../../config/menarini-api-url-config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FinanceaccountService {
  private dataSource: BehaviorSubject<string> = new BehaviorSubject<string>('Initial Value');
  data: Observable<string> = this.dataSource.asObservable();
 
  // private honarariumdataSource: BehaviorSubject<string> = new BehaviorSubject<string>('Initial Value');
  // honarariumdata: Observable<string> = this.honarariumdataSource.asObservable();
 
  constructor(private _http: HttpClient) { }
 
  sendData(data: string) {
    this.dataSource.next(data);
  }


  // sendhorrarium(honarariumdata){
  //   this.honarariumdataSource.next(honarariumdata);
  // }

  public updatefinanceaccount(data:any):Observable<any>
  {
      return this._http.put(MenariniApiUrl.UpdateFinanceAccountPanelSheetApi,data);
  }
  
  public UpdateFinanceAccountExpenseSheet(data:any):Observable<any>
  {
      return this._http.put(MenariniApiUrl.UpdateFinanceAccountExpenseSheet,data);
  }
}

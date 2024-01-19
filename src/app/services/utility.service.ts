import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  private baseAPIUrl : string = environment.basiApiUrl;

  constructor(private http : HttpClient) { }

  previousEvents : any;

  getPreviousEventsFast(){
    this.http.get(this.baseAPIUrl+'/Class1/GetEventData').subscribe(
      res => {
        this.previousEvents = res;
      }
    )
  }

   // Get Previous Event Details
   getPreviousEvents(){
    return this.previousEvents;
  }

  // TO get event types
  getEventTypes(): Observable<any>{
    return this.http.get(this.baseAPIUrl+"/MasterSheets/GetEventData")
  }

  // Get Roles
  getRoles(): Observable<any>{
    return this.http.get(this.baseAPIUrl+'/MasterSheets/GetRoleData')
  }

  // Get employee details from Employee Master
  getEmployees(): Observable<any>{
    return this.http.get(this.baseAPIUrl+'/LoginAndRegister/GetSheetData')
  }

  // Add New Employees to User Role Master Sheet
  addEmployees(postData:any): Observable<any>{
    return this.http.post(this.baseAPIUrl+'/UserRoleMaster/AddData', postData)
  }

  // Get Added employees from UserRole Master sheet
  getAddedEmployees(): Observable<any>{
    return this.http.get(this.baseAPIUrl+'/UserRoleMaster/GetEventData')
  }

  // Get HCP roles from HCP Role Master
  getHcpRoles(): Observable<any>{
    return this.http.get(this.baseAPIUrl+'/MasterSheets/GetHCPRoleData')
  }
  
  // Update employees in HCP Role Master
  updateEmployees(putData:any): Observable<any>{
    return this.http.put(this.baseAPIUrl+'/UserRoleMaster/UpdateData',putData)
  } 

  // Delete Employees from HCP Role Master
  deleteEmployees(deleteData : any){
    return this.http.delete(this.baseAPIUrl+`/UserRoleMaster/DeleteData/${deleteData.Email}`)
    // console.log(this.baseAPIUrl+`/UserRoleMaster/DeleteData/${deleteData.Email}`)
  }

  // Get Brand Names
  getBrandNames(){
    return this.http.get(this.baseAPIUrl+'/MasterSheets/GetBrandNameData')
  }

  // Get Approved Speakers
  getApprovedSpeakers(){
    return this.http.get(this.baseAPIUrl+'/Test/GetApprovedSpeakersData');
  }

  // Get Approved Trainer
  getApprovedTrainers(){
    return this.http.get(this.baseAPIUrl+"/MasterSheets/GetApprovedTrainersData");
  }

  // Get All States
  getAllStates(){
    return this.http.get(this.baseAPIUrl+'/MasterSheets/GetStateNameData')
  }

  // Get All City
  getAllCities(){
    return this.http.get(this.baseAPIUrl+'/MasterSheets/GetCityNameData')
  }

  // Get Vendor Details
  getVendorDetails(){
    return this.http.get(this.baseAPIUrl+'/MasterSheets/VendorMasterSheetData')
  }

  // POST event 1 reques form First set of data
  postEvent1Data1(data:any){
    return this.http.post(this.baseAPIUrl+'/Class1/AddData',data)
  }

  // Get Remuneration Value
  getFmv(speaciality,tier){
    return this.http.get(`http://localhost:5098/api/Test/GetfmvColumnValue?specialty=${speaciality}&columnTitle=${tier}`)
  }

  // POST brandNames
  postBrandNames(brands){
    return this.http.post(this.baseAPIUrl+"/EventRequestBrandsList/AddDataList",brands)
  }

  // Getting Employees From HCP Master
  getEmployeesFromHCPMaster(){
    return this.http.get(this.baseAPIUrl+"/MasterSheets/HcpMaster");
  }
}

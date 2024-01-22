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
    this.http.get(this.baseAPIUrl+'/GetRequestSheets/GetEventRequestWebData').subscribe(
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
    return this.http.get(this.baseAPIUrl+"/GetMasterSheets/GetEventData")
  }

  // Get Roles
  getRoles(): Observable<any>{
    return this.http.get(this.baseAPIUrl+'/GetMasterSheets/GetRoleData')
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
    return this.http.get(this.baseAPIUrl+'/GetMasterSheets/GetHCPRoleData')
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
    return this.http.get(this.baseAPIUrl+'/GetMasterSheets/GetBrandNameData')
  }

  // Get Approved Speakers
  getApprovedSpeakers(){
    return this.http.get(this.baseAPIUrl+'/GetMasterSheets/GetApprovedSpeakersData');
  }

  // Get Approved Trainer
  getApprovedTrainers(){
    return this.http.get(this.baseAPIUrl+"/GetMasterSheets/GetApprovedTrainersData");
  }

  // Get All States
  getAllStates(){
    return this.http.get(this.baseAPIUrl+'/GetMasterSheets/GetStateNameData')
  }

  // Get All City
  getAllCities(){
    return this.http.get(this.baseAPIUrl+'/GetMasterSheets/GetCityNameData')
  }

  // Get Vendor Details
  getVendorDetails(){
    return this.http.get(this.baseAPIUrl+'/GetMasterSheets/VendorMasterSheetData')
  }

  

  // Get Remuneration Value
  getFmv(speaciality,tier){
    return this.http.get(this.baseAPIUrl+`/FMV/GetfmvColumnValue?specialty=${speaciality}&columnTitle=${tier}`)
  }

  // POST brandNames


  // Getting Employees From HCP Master
  getEmployeesFromHCPMaster(){
    return this.http.get(this.baseAPIUrl+"/GetMasterSheets/HcpMaster");
  }

  // Post class1 consolidated data
  postClass1PreEventRequest(data:any){
    return this.http.post(this.baseAPIUrl+"/PostRequestSheets/AllObjModelsData", data)
  }

  // Get Slide Kit Details from Slide Kit master
  getSlideKitDetails(){
    return this.http.get(this.baseAPIUrl+'/MasterSheets/SlideKitMaster')
  }


  // Methods for Honararium Payment Request:
   // adding honorarium data
   addHonorariumPayment(data:any)
   {
       return this.http.post(this.baseAPIUrl+"/PostReqestSheets/AddHonorariumData",data);
   }

   // honorarium details full list
   honorariumDetails()
   {
       return this.http.get(this.baseAPIUrl+"/GetRequestSheets/GetHCPRoleDetailsData");
   }

  //  Post Event Settlement
  getInviteesData()
  {
    return this.http.get(this.baseAPIUrl+"/GetRequestSheets/GetInviteesData");
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenariniApiUrl } from '../../config/menarini-api-url-config';


@Injectable({
    providedIn: 'root'
  })

  export class UtilityService {

  constructor(private _http : HttpClient) { }

  


    // get previous events for pre event check
    previousEvents : any;
    getPreviousEventsFast()
    {
        this._http.get(MenariniApiUrl.getpreviousEventDataApi).subscribe( res=>
            {
                this.previousEvents = res;
            })
    }

     // Get Previous Event Details
   getPreviousEvents(){
    return this.previousEvents;
 }

 // getting previous events from process sheet
 previousEventsFromProcess : any;
 getpreviousEventsFromProcess()
 {
  this._http.get(MenariniApiUrl.getEventList).subscribe( res=>
    {
      //console.log('from service',res)
      this.previousEventsFromProcess = res;
    })
  }

    getprocessPreviousEvents()
    {
      return this.previousEventsFromProcess;
    }
 





  getPrevEvents():Observable<any>{
    return this._http.get(MenariniApiUrl.getpreviousEventDataApi);
  }

    // get event types from event master 
    getEventTypes()
    {
        return this._http.get<any[]>(MenariniApiUrl.getMasterEventTypesData).pipe(
          map(data => {
            // Split comma-separated Roles into an array
            return data.map(event => ({
              EventTypeId:event.EventTypeId,
              EventType:event.EventType,
              Roles: event.Roles?.split(',')
            }));
          })
        );
    }

    // get roles 
    getRoles()
    {
        return this._http.get(MenariniApiUrl.getRoleDataApi);
    }

    // Get employee details from Employee Master
    getEmployees()
    {
        return this._http.get(MenariniApiUrl.getEmployeeDetailsApi);
    }

    // Add New Employees to User Role Master Sheet
     addEmployees(postData:any)
     {
     return this._http.post(MenariniApiUrl.addEmployeesApi,postData);
     }

     // Get Added employees from UserRole Master sheet
     getAddedEmployees()
     {
        return this._http.get(MenariniApiUrl.getEventDatafromUserRoleApi);
     }

     // Get HCP roles from HCP Role Master
    getHcpRoles(): Observable<any>
    {
        return this._http.get(MenariniApiUrl.getHCPRoleDataApi);
    }

    // Update employees in HCP Role Master
    updateEmployees(putData:any)
    {
    return this._http.put(MenariniApiUrl.updateEmployeeDataApi,putData);
    } 

    // Delete Employees from HCP Role Master
    deleteEmployees(deleteData : any)
    {
    return this._http.delete(MenariniApiUrl.deleteEmployeeDataApi);
    }

    // Get Brand Names
    getBrandNames()
    {
    return this._http.get(MenariniApiUrl.getBrandNameDataApi);
    }


    // Get All States
    getAllStates()
    {
        return this._http.get(MenariniApiUrl.getStateNameDataApi);
    }

    // Get All City
    getAllCities()
    {
        return this._http.get(MenariniApiUrl.getCityNameDataApi);
    }

    // Get Vendor Details
    getVendorDetails()
    {
        return this._http.get(MenariniApiUrl.vendorMasterSheetDataApi)
    }

    // POST event 1 reques form First set of data
    postClass1PreEventRequest(data:any):Observable<any>
    {
        return this._http.post(MenariniApiUrl.classIAddDataApi,data)
    }

    stallfabPreEventRequest(data:any):Observable<any>{
      return this._http.post(MenariniApiUrl.stallfabricAddDataApi,data)
    }

    // POST brandNames
    postBrandNames(brands)
    {
        return this._http.post(MenariniApiUrl.addDataListApi,brands)
    }

    // Getting Employees From HCP Master
    getEmployeesFromHCPMaster()
    {
        return this._http.get(MenariniApiUrl.hcpMasterApi);
    }

    // honorarium detail by id 
    honorariumDetailsById()
    {
        return this._http.get(MenariniApiUrl.honorariumDetailsByIdApi);
    }

    // honorarium details full list
    honorariumDetails()
    {
        return this._http.get(MenariniApiUrl.honorariumDetailsApi);
    }

    // adding honorarium data 
    addHonorariumPayment(data:any):Observable<any>
    {
        return this._http.post(MenariniApiUrl.honorariumRequestAddDataApi,data);
    }

    //Get Approved trainer Data
    getApprovedTrainers()
    {
        return this._http.get(MenariniApiUrl.getApprovedTrainers);
    }

     //Get Approved speaker Data
    getApprovedSpeakers()
    {
        return this._http.get(MenariniApiUrl.getapprovedspeaker);
      }

    // Get Slide Kit Details from Slide Kit master
    getSlideKitDetails()
    {
    return this._http.get(MenariniApiUrl.getSlideKitDetails);
  }

  //get invitees data for post event settlement
  getInviteesData()
  {
    return this._http.get(MenariniApiUrl.getInviteesData);
  }

  //get expensed data for post event settlement
  getExpensesData()
  {
    return this._http.get(MenariniApiUrl.getExpenseData);
  }

  //file uploading
  fileUpload(formData:any):Observable<any>
  {
     return this._http.post(MenariniApiUrl.fileuploading, formData)
  }

   // Get All Expense Type
   getExpenseType(): Observable<any>
   {
    return this._http.get(MenariniApiUrl.getexpenseType);
    }

    //  Post Event Settlement
  postEventInviteess : any ;
  getInviteesFast(){
    return this._http.get(MenariniApiUrl.getInviteesFast)
  }

   //get expense data for post event settlement
   getPostEventExpense(){
    return  this._http.get(MenariniApiUrl.getPostEventExpense);
   }


  //  Panel Selection Final Amount
  getPanelSelectionFinalAmount(eventId: any){
    return this._http.get(MenariniApiUrl.getPanelSelectionFinalAmount+`${eventId}`);
  }


  // Invitee Selection Final Amount
  getTotalInviteesFinalAmount(eventId : any){
    return this._http.get(MenariniApiUrl.getInviteesFinalAmount+`${eventId}`)
  }
 
  // Expense Final
  getTotalExpenseFinalAmount(eventId){
    return this._http.get( MenariniApiUrl.getTotalExpenseFinalAmount+`${eventId}`)
  }
 
  // Event Settlement Post
  postEventSettlementDetails(data:any): Observable<any>{
    return this._http.post(MenariniApiUrl.postEventSettlement,data)
  }

  // get event list 
  getEventListFromProcess():Observable<any>
  {
    return this._http.get(MenariniApiUrl.getEventList)
  }


  
  // get event list 
  getEventSettlementData()
  {
    return this._http.get(MenariniApiUrl.getEventSettlementDataApi)
  }
  // get event list 
  getHonorariumPaymentData()
  {
    return this._http.get(MenariniApiUrl.getHonorariumPaymentDataApi)
  }

//   getInviteesData()
//   {
//     return this.postEventInviteess;
//   }

  // added by karthick
  getFMV(speciality, tier)
  {
    return this._http.get(MenariniApiUrl.fmvCalculation + `specialty=${speciality}&columnTitle=${tier}`)
  }


  // get FCPA details
  getFCPA(misCode : string): Observable<any>{
    return this._http.get(MenariniApiUrl.getFCPA + `misCode=${misCode}`);
  }


     //Get Approved speaker Data
    getApprovedSpeakersForAutocomplete(): Observable<any[]>
    {
        return this._http.get<any[]>(MenariniApiUrl.getapprovedspeaker);
    }
     //Get Approved trainer Data
    getApprovedTrainersForAutocomplete(): Observable<any[]>
    {
        return this._http.get<any[]>(MenariniApiUrl.getApprovedTrainers);
    }
     //Get Approved trainer Data
    getApprovedVendorsForAutocomplete(): Observable<any[]>
    {
        return this._http.get<any[]>(MenariniApiUrl.vendorMasterSheetDataApi);
    }

     //Get Approved trainer Data
    getMedicalUtilityTypes()
    {
        return this._http.get(MenariniApiUrl.getMedicalUtilityTypesDataApi);
    }    

    // Webinar API
    postWebinarPreEventForm(data : any): Observable<any>{
      return this._http.post(MenariniApiUrl.postWebinarPreEvent,data);
    }

    // post hcp consultant API
    postHcpConsultant(data:any):Observable<any>{

      return this._http.post(MenariniApiUrl.postHcpConsultantApi,data);
    }
    // Webinar API
    postMedicalUtilityPreEventRequest(data : any): Observable<any>{
      return this._http.post(MenariniApiUrl.postMedicalUtilityPreEventApi,data);
    }    
    // Webinar API
    getRowDataUsingMISCode(misCode : string){
      return this._http.get(MenariniApiUrl.getRowDataUsingMISCodeApi+`misCode=${misCode}`);
    } 
    // Webinar API
    getRowDataUsingMISCodeandType(misCode : string,type:string): Observable<any>{
      let data={};
      data['misCode']=misCode;
      data['type']=type;
      console.log(data);
      return this._http.post(MenariniApiUrl.getRowDataUsingMISCodeandTypeApi,data);
    }     
    // New Invitee API
    postAddNewInviteesRequest(data : any): Observable<any>{
      return this._http.post(MenariniApiUrl.postAddNewInviteesApi,data);
    }    
    // Delete Invitee API
    deleteInvitees(RowInvId : string){
      return this._http.delete(MenariniApiUrl.deleteInviteesApi+`${RowInvId}`);
    }


    // Finance Treasury

    private dataSource: BehaviorSubject<string> = new BehaviorSubject<string>('Initial Value');
    data: Observable<any> = this.dataSource.asObservable();

    private expenseDataSource: BehaviorSubject<string> = new BehaviorSubject<string>('Initial Value');
    expenseData: Observable<any> = this.expenseDataSource.asObservable();

    private advanceDataSource: BehaviorSubject<string> = new BehaviorSubject<string>('Initial Value');
    advanceData: Observable<any> = this.advanceDataSource.asObservable();

    sendData(data: string) {
      this.dataSource.next(data);
    }

    sendExpenseData(data: any){
      this.expenseDataSource.next(data);
    }

    sendAdvanceData(data: any){
      this.advanceDataSource.next(data);
    }
 
    putFinanceTreasuryHonorarium(data:any): Observable<any>{
      return this._http.put(MenariniApiUrl.putFinaceTreasuryHonorariumRequest, data);
    }

    putFinanceTreasuryEventSettlement(data:any): Observable<any>{
      return this._http.put(MenariniApiUrl.putFinaceTreasurySettlementReuest, data);
    }

    getVendorFiles(vendorId: string): Observable<any>{
      return this._http.get(MenariniApiUrl.getVendorFiles+`vendorId=${vendorId}`);
    }

    putVendorDetails(data: any): Observable<any>{
      return this._http.put(MenariniApiUrl.putVendorDetails,data);
    }

    getPostEventAttendancePdf(eventId: string): Observable<any>{
      return this._http.get(MenariniApiUrl.getPostEventAttendancePdf+`EventID=${eventId}`)
    }


    // download attendence sheet
    downloadAttendenceByEventId(eventId:string): Observable<any>{
      return this._http.get(MenariniApiUrl.downloadAttendence+`${eventId}`);
    }

    // other deviation files 
    otherDeviationTypes(){
      return this._http.get(MenariniApiUrl.otherDeviation)
    }
    
    // employee search
    employeeSearch(){
      return this._http.get(MenariniApiUrl.employeeSearch);
    }
}
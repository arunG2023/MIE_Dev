import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { data, event } from 'jquery';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';

@Component({
  selector: 'app-class1-honorarium-request',
  templateUrl: './class1-honorarium-request.component.html',
  styleUrls: ['./class1-honorarium-request.component.css']
})
export class Class1HonorariumRequestComponent implements OnInit{
  // Spinner
  loadingIndicator : boolean = false;

  stepper: any;
  honorarium: FormGroup;


  // for pagination purpose
  currentpage = 1;
  page : number = 1;
  count : number = 0;
  tableSize : number = 10;
  tableSized : any = [5,10,15,20];


  show2DaysUpload: boolean = false;
  showuploadifGSTyes: boolean = false;
  pageSizeOptions: number[];

  showEventSelect : boolean = false;

  showNoData: boolean = false;



  private _userDetails: any;

  constructor(private utilityService: UtilityService,
              private dialog : MatDialog,
              private activatedRoute : ActivatedRoute,
              private _snackBarService : SnackBarService,
              private _router : Router,
              private _authService: AuthService) {}
 
  ngOnInit(): void {
    this._authService.getUserDetails$.subscribe(value => this._userDetails = value)

    this.honorarium = new FormGroup({
      //isAfter2Days:new FormControl('',[Validators.required]),
      twoDaysDeviation: new FormControl('', [Validators.required]),
      uploadSpeakerAgreement: new FormControl('', [Validators.required]),
      uploadPhotos: new FormControl(''),
      uploadAttendecnce: new FormControl(''),
      uploadFinalHonorariumDetails: new FormControl(''),
      uploadDetails: new FormControl(''),
      isItIncludingGST: new FormControl(''),
      isInviteeslessthan5: new FormControl(''),
      UploadDetails1: new FormControl(''),
      EventId: new FormControl('')
    })

    this.activatedRoute.queryParams.subscribe(params => {
      if(params.eventId && params.eventType){
        this.loadingIndicator = true;
        this.utilityService.getEventListFromProcess().subscribe(
          res => {
            
            this.eventListafter2days.push(res.
              find(eve => eve['EventId/EventRequestId'] == params.eventId));
            this.utilityService.honorariumDetails().subscribe(honoDetails => {
              this.honorarDetails = honoDetails;
              this.show2DaysUpload = this.isAfterTwoDays(this.eventListafter2days[0].EventDate)
              this.filterHonor(params.eventId);
              this.loadingIndicator = false;
           
          })
        }
        )
        
      }

      else{
        this.loadingIndicator = true;
        this.showEventSelect = true;

        this.utilityService.getEventListFromProcess().subscribe(res=>
          {
            this.After2WorkingDays(res);
            this.utilityService.honorariumDetails().subscribe(honoDetails => {
              this.loadingIndicator = false;
              this.honorarDetails = honoDetails;  
            })
          })
        // this.showingDetails;
        this.showUpload();
        this.honorarium.valueChanges.subscribe(changes=>
          {
            if(changes.EventId){
              this.honortableDetails = [];
              this.selectedEvent = changes.EventId;
              this.filterHonor(changes.EventId);
              
            }
          })

         
    
        // this.After2WorkingDays(this.utilityService.getPreviousEvents());
      }
    })

    

     // Getting allowed file types
     this._allowedTypes = Config.FILE.ALLOWED;

     // Generating Allowed types for HTML
     this._allowedTypes.forEach(type => {
       this.allowedTypesForHTML += '.' + type + ', '
     })
  }

  showUpload() {
    this.honorarium.valueChanges.subscribe(chanegs => {
    this.showuploadifGSTyes = (chanegs.isItIncludingGST == 'Yes') ? true : false;

    })
  }
  eventListafter2days: any[] = [];
  eventIds: any[] = [];
  private After2WorkingDays(eventList: any) {
    console.log(eventList)
    if (Boolean(eventList)) {
      eventList.forEach(event => {

        if(event.EventType == 'Class I'){
          if(event['Initiator Email'] == this._userDetails.email){
            if(event['Event Request Status'] == 'Approved' ||  event['Event Request Status'] == 'Advance Approved' && (event['Event Request Status'].indexOf('Waiting') > -1 || (event['Event Request Status'].indexOf('Rejected')))){ 
              if(Boolean(event.EventDate)){
                // if(this.isAfterTwoDays(event.EventDate)){
                  this.eventListafter2days.push(event);
                  this.eventIds.push(event['EventId/EventRequestId']);
                  this.show2DaysUpload = this.isAfterTwoDays(event.EventDate);;
                // }
              }
  
            }
          }
         
          
       
        }
      })

    }
    if(this.eventListafter2days.length == 0){
      this.showNoData = true;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

  }

  private isAfterTwoDays(date:string){
    let today: any = new Date();
    let eventDate: any = new Date(date);
    const twodays = 5 * 24 * 60 * 60 * 1000;
    if (today.getTime() - eventDate.getTime() > twodays){
      return true;
    }
    else{
      return false;
    }

  }

  //declearing the variable for honorarium details
  honorarDetails: any;
  honortableDetails:any[] = [];
  eventTypeForId : any[] = [];

  private showingDetails() {

    this.utilityService.honorariumDetails().subscribe(honoDetails => {
      this.honorarDetails = honoDetails;
      // this.filterHonor();
      
     
    })
  }

  gstRadio : any[] = [];
  disableGST : any[] = [];

  selectedEvent : any;

  showHonarariumContent : Boolean = false;

  filterHonor(eventId:any){
    // console.log(eventId);
   

   if(Boolean(this.honorarDetails))
   {
    
    this.honorarDetails.forEach(data =>{
    
      if(data['EventId/EventRequestId'] == eventId){
        this.honortableDetails.push(data);
      }
    })
    console.log('jnujncouc',this.honortableDetails)
   }
  
   if(this.honortableDetails.length > 0){
    this.showHonarariumContent = true;
   }
   else{
    this.showHonarariumContent = false;
    this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
   }


    for(let i=0;i<this.honortableDetails.length;i++){
      this.gstRadio.push(i)
      this.disableGST.push(true);
    }


    // return this.honortableDetails;
   

  }

  

  idShown : any[] = [];
  checkGST(option : any, name : string, id : string){
    // if(this.idShown.indexOf(id) == -1){
    //   this.idShown.push(id);
    // }
   
    if(option == 'Yes')
    {
      this.disableGST[id] = false;
    
    }
    else
    {
      this.disableGST[id] = true;

    }

    // if(value == "Yes"){
    //   console.log(index)
    // }
  }

 
  openhonorariumUpdateModal(honorarium : any){
    const dialogRef =  this.dialog.open(ModalComponent,{
      width: '600px',
      data : {
        forHonararium : true,
        honarariumData : honorarium
      }
    });
  }

  onTableChange(changetableevent:any)
  {
    this.page = changetableevent;
    this.honortableDetails;

  }
  onTableSizeChange(changetablesizeevent:any):void
  {
    this.tableSize = changetablesizeevent.target.value;
    this.page = 1;
    this.honortableDetails;
  }

  // File Handling:
  private _allowedTypes: string[];
  allowedTypesForHTML: string;

  twoDaysDeviationFile: string;
  photosFiles: string[] = [];
  attendenceSheetFile: string = '';
  honorariumInvoiceFiles: string[] = [];
  speakerAggrementFiles: string[] = [];

  otherFiles: string[] = [];


  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    if (event.target.files.length > 0){
      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE){
        const extension = file.name.split('.')[1];

        const reader = new FileReader();

       

        if (this._allowedTypes.indexOf(extension) > -1){
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;

            if(type == 'deviation'){
              if(control == 'twoDaysDeviation'){
                this.twoDaysDeviationFile = base64String.split(',')[1];
              }
            }
            else if(type == 'other'){
              if(control == 'uploadPhotos'){
                this.photosFiles.push(base64String.split(',')[1]);
              }
              if(control == 'uploadAttendecnce'){
                this.attendenceSheetFile = (base64String.split(',')[1]);
              }

              if(control == 'honarariumInvoice'){
                this.honorariumInvoiceFiles.push(base64String.split(',')[1]);
              }
              if(control == 'speakerAggrement'){
                this.speakerAggrementFiles.push(base64String.split(',')[1]);
              }
            }
            
          }

          // console.log(this.photosFile)
        }
        else{
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_TYPE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          this._resetControl(control);
        }

      }
      else{
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_SIZE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        this._resetControl(control);
      }
    }
  }

  private _resetControl(control: string){
    switch(control){
      case 'twoDaysDeviation':
        this.honorarium.controls.twoDaysDeviation.reset();
        break;
      
      case 'uploadPhotos':
        this.honorarium.controls.uploadPhotos.reset();
        break;

      case 'uploadAttendecnce'  :
        this.honorarium.controls.uploadAttendecnce.reset();
    }
  } 

  onSubmit(){
    let formValidity = 0;
    let enableGSTLength = 0;

    this.disableGST.forEach(val => {
      if(!val){
        enableGSTLength++;
      }
    })


    // console.log(enableGSTLength)
// !Boolean(this.honorarium.value.uploadAttendecnce)  ||
    if((this.show2DaysUpload && !Boolean(this.honorarium.value.twoDaysDeviation)) ||  this.photosFiles.length == 0 || this.honorariumInvoiceFiles.length == 0 || this.speakerAggrementFiles.length !== enableGSTLength){
      formValidity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    
    

    if(formValidity == 0){
      this.loadingIndicator = true;
      if(this.honortableDetails.length > 0){
        let honorariumData :any[] =[] ;
        this.otherFiles = this.photosFiles.concat(this.honorariumInvoiceFiles).concat(this.speakerAggrementFiles).concat(this.attendenceSheetFile);

  
        // New Api
        const reqPanel = [];
  
      // console.log(this.honortableDetails)
      this.honortableDetails.forEach(honor=>
        {
          let data={
          HcpName : honor.HCPName || " ",
          // EventId : honor['EventId/EventRequestId'],
          // EventType : (this.eventTypeForId.length > 0)?this.eventTypeForId.find(event =>event.eventId == honor['EventId/EventRequestId']).eventType: ' ',
          HcpRole : (Boolean(honor.HcpRole))?honor.HcpRole+'':" ",
          MisCode :(Boolean(honor.MISCode))?honor.MISCode+'':" ",
          GOorNGO : (Boolean(honor['HCP Type']))?honor['HCP Type']:" ",
          IsInclidingGst : this.honorarium.value.isItIncludingGST || "No",
          AgreementAmount : (Boolean(honor.AgreementAmount))?honor.AgreementAmount+'':"No",
          // HonorariumSubmitted : "Yes"
          }
  
        
         
         honorariumData.push(data);
  
        });
  
        // For API Change
         
      
  
        const currentEventDetails = this.eventListafter2days.find(eve => eve['EventId/EventRequestId'] == this.honortableDetails[0]['EventId/EventRequestId']);
  
        let roleDetails = this._authService.decodeToken();
        
        const reqHonor =  {
          EventId: currentEventDetails['EventId/EventRequestId'],
          EventType : currentEventDetails.EventType || ' ',
          EventTopic: currentEventDetails['Event Topic'] || ' ',
          HonarariumSubmitted: "Yes" || ' ',
          EventDate: currentEventDetails.EventDate || ' ',
          City : currentEventDetails.City || ' ',
          State : currentEventDetails.State || ' ',
          StartTime : currentEventDetails.StartTime || ' ',
          EndTime: currentEventDetails.EndTime || ' ',
          VenueName: currentEventDetails.VenueName || ' ',
          TotalTravelAndAccomodationSpend : currentEventDetails['Total Travel & Accommodation Amount']+'' || '0' ,
          TotalHonorariumSpend: currentEventDetails['Total Honorarium Amount']+'' || '0',
          TotalSpend: currentEventDetails['Total Budget']+'' || '0',
          TotalLocalConveyance : currentEventDetails['Total Local Conveyance']+'' || '0',
          Brands: currentEventDetails.Brands || " ",
          Invitees : currentEventDetails.Invitees || " ",
          Panelists: currentEventDetails.Panelists || " ",
          SlideKits : currentEventDetails.SlideKits ||  " ",
          Expenses: currentEventDetails['Expenses']+"" || " ",
          TotalTravelSpend: currentEventDetails['Total Travel Amount']+'' || '0',
          TotalAccomodationSpend: currentEventDetails['Total Accomodation Amount']+'' || '0',
          TotalExpenses: currentEventDetails['Total Expense']+"" || "0",
          InitiatorName: roleDetails['unique_name'] || ' ',
          InitiatorEmail: roleDetails.email || ' ',
          RbMorBM: roleDetails['RBM_BM'] || ' ',
          Compliance: roleDetails['ComplianceHead'] || "sabri.s@vsaasglobal.com",
          FinanceAccounts: roleDetails.FinanceAccounts || ' ',
          FinanceTreasury: roleDetails.FinanceTreasury || ' ',
          IsDeviationUpload: (this.show2DaysUpload)? 'Yes' : 'No',
          MedicalAffairsEmail: roleDetails.MedicalAffairsHead,
          ReportingManagerEmail: roleDetails.reportingmanager,
          FirstLevelEmail: roleDetails.firstLevelManager,
          ComplianceEmail: roleDetails.ComplianceHead,
          FinanceAccountsEmail: roleDetails.FinanceAccounts,
          SalesCoordinatorEmail: roleDetails.SalesCoordinator,
          MarketingHeadEmail: roleDetails.SalesHead,
          SalesHeadEmail: roleDetails.MedicalAffairsHead,
          Role: roleDetails.role,
          Files: this.otherFiles,
          DeviationFiles: [
            (Boolean(this.twoDaysDeviationFile)? this.twoDaysDeviationFile : ' ')
          ]
  
        };
  
  
  
        // console.log(reqHonor)
  
        const newApiPayLoad = {
          RequestHonorariumList : reqHonor,
          HcpRoles : honorariumData,
        };
  
      
        console.log('Api', newApiPayLoad)
  
  
     
      this.utilityService.addHonorariumPayment(newApiPayLoad).subscribe( res=>
        {
          //console.log(changes);
          if(res.message == 'Data added successfully.'){
            this.loadingIndicator = false;
            // alert('Honararium Submitted Successfully')
            this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_HONARARIUM, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
            this.showHonarariumContent = false;
            this._router.navigate(['view-event-list'])
          }
        
        },
        err => {
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        })
  
      }
    }
   

    
  }
  


}



import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';


@Component({
  selector: 'app-webinar-event-request',
  templateUrl: './webinar-event-request.component.html',
  styleUrls: ['./webinar-event-request.component.css']
})
export class WebinarEventRequestComponent implements OnInit {

 
    eventInitiation1 : FormGroup;
    eventInitiation2 : FormGroup;
    eventInitiation3 : FormGroup;
    eventInitiation4 : FormGroup;
      eventInitiation4Sub : FormGroup;
      eventInitiatio4Honararium : FormGroup;
      eventInitiation4Speaker : FormGroup;
      eventInitiation4Other : FormGroup;
      eventInitiation4Trainer : FormGroup;
      panalselectionstandard:FormGroup;
      eventInitiation4Travel : FormGroup;
      eventInitiation4Accomodation : FormGroup;
  
    inviteeSelectionForm : FormGroup;
    expenseSelectionForm : FormGroup;
    eventInitiation5 : FormGroup;
    eventInitiation6 : FormGroup;
    eventInitiation7 : FormGroup;
  
    // Data From sheet:
    previousEvent : any;
    eventDetails : any;
    hcpRoles : any
    vendorDetails : any;
    
   
  
    // Upload Deviationn
    show30DaysUploaDeviation: boolean = false
    show7DaysUploadDeviation: boolean = false
  
  
    // For Stepper Validation
    isLinear: boolean = false;
    orientation : string ;
    pageLoaded : boolean = false
  
    constructor(private utilityService : UtilityService, 
                private auth : AuthService, 
                private router : Router,
                private dialog : MatDialog) {
      this.isMobileMenu();
      // Get Previous Events:
      // utilityService.getPreviousEvents().subscribe(
      //   res => {
      //     // this.previousEvent = res;
      //     console.log(res);
      //     this.filterEventsWithIn30Days(res);
      //   },
      //   err => {
      //     alert("Previous Event not got")
      //   }
      // )
       this.filterEventsWithIn30Days(utilityService.getPreviousEvents());
  
      // Getting event types
      utilityService.getEventTypes().subscribe(
        res => {
          this.eventDetails = res;
        },
        err => {
          alert('Unexpected error Happened')
        }
      )
  
      // Getting HCP Roles
      utilityService.getHcpRoles().subscribe(
        res => {
          this.hcpRoles = res;
          console.log(this.hcpRoles)
        },
        err =>{
          alert("Unexpected Error Happened")
        }
  
      )
  
      // Getting BrandNames
      utilityService.getBrandNames().subscribe(
        res => {
          this.brandNames = res;
          this.filterBrandDetailsForClass1();
        },
        err => {
          alert("Unexpected Error Happened")
        }
      )
  
      // Getting Approved Speakers
      utilityService.getApprovedSpeakers().subscribe(
        res => {
          // console.log(res)
          this.approvedSpeakers = res;
          // console.log(this.approvedSpeakers.length);
          // console.log('ApprSe',this.approvedSpeakers)
        }
      )
  
      // Get Approved Trainers
      utilityService.getApprovedTrainers().subscribe(
        res => this.approvedTrainers = res
      )
  
      // Get All States
      utilityService.getAllStates().subscribe(
        res => {
          this.allStates = res;
        }
      )
  
      // Get All Cities
      utilityService.getAllCities().subscribe(
        res => this.allCity = res
      )
  
      // Get Vendor Details
      utilityService.getVendorDetails().subscribe(
        res => this.vendorDetails = res
      )
  
      // Get Invitees From HCP Master 
      utilityService.getEmployeesFromHCPMaster().subscribe(
        res => {
          this.inviteesFromHCPMaster = res;
          console.log('Before SPlice',this.inviteesFromHCPMaster.length);
          this.inviteesFromHCPMaster.splice(1000,);
          console.log('After SPlice',this.inviteesFromHCPMaster.length);
          console.log(this.inviteesFromHCPMaster)
          
        }
        
      )
  
      // Get Slidekit Details
      utilityService.getSlideKitDetails().subscribe(
        res => {
          if(Boolean(res)) this.slideKitDetails = res;
        }
      )
      
      this.eventInitiation1 = new FormGroup({
        withIn30DaysDeviation : new FormControl(''),
        eventDate : new FormControl('',Validators.required),
        next7DaysDeviation : new FormControl('')
      })
  
      this.eventInitiation2 = new FormGroup({
        // eventType : new FormControl('EVT1',[Validators.required]),
        eventTopic : new FormControl('', [Validators.required]),
        // eventDate : new FormControl('',[Validators.required]),
        startTime : new FormControl('',[Validators.required]),
        endTime : new FormControl('',endTimeValidator),
        // venueName : new FormControl('', [Validators.required]),
        // state : new FormControl('',[Validators.required]),
        // city : new FormControl('', [Validators.required])

        // For Webinar
        meetingType : new FormControl('',Validators.required),
        vendorName : new FormControl(''),
        vendorFileUpload : new FormControl('')
        
      })
  
      this.eventInitiation3 = new FormGroup({
        brandName : new FormControl('',[Validators.required]),
        // percentageAllocation : new FormControl('',[Validators.required]),
        // projectId : new FormControl('', [Validators.required]),
        // eventCode : new FormControl('',[Validators.required])
      })
  
      this.eventInitiation4 = new FormGroup({
        hcpRole : new FormControl('',[Validators.required]),
        // New Columns
       
      })
  
      this.eventInitiation4Sub = new FormGroup({
        uploadFCPA : new FormControl(''),
        fcpaDate : new FormControl('',Validators.required),
        isAdvanceRequired : new FormControl('',Validators.required),
        isTravelRequired : new FormControl('No',Validators.required),
        isLocalConveyance : new FormControl('No',Validators.required),
        isHonararium : new FormControl('No',Validators.required),
        isAccomRequired : new FormControl('No',Validators.required),
        localConveyanceAmount : new FormControl(0,Validators.required),
      })
  
      this.eventInitiatio4Honararium = new FormGroup({
        presentationDuration : new FormControl(0,[Validators.required]),
        panelSessionPreparation : new FormControl(0,[Validators.required]),
        qaSession : new FormControl(0,[Validators.required]),
        honorariumAmount : new FormControl(0,),
        briefingDuration : new FormControl(0,[Validators.required]),
        panelDiscussionDuration : new FormControl(0,[Validators.required]),
  
        // isHonararium : new FormControl('No',[Validators.required]),
        currency : new FormControl('',Validators.required),
        taxSelection : new FormControl('',Validators.required),
        uploadNOC : new FormControl('',),
        rationale : new FormControl(0,),
        bankAccountNumber : new FormControl('',),
        benificiaryName : new FormControl('',Validators.required),
       
      })
  
      this.eventInitiation4Speaker = new FormGroup({
        speakerName : new FormControl('',[Validators.required]),
        speakerMisCode : new FormControl('', MISValidator),
      })
  
      this.eventInitiation4Other = new FormGroup({
        otherName : new FormControl('',Validators.required),
        otherMisCode : new FormControl('',MISValidator),
      })
  
      this.eventInitiation4Trainer = new FormGroup({
        trainerName : new FormControl('',Validators.required),
        trainerMisCode : new FormControl('',Validators.required)
      })
  
      this.eventInitiation4Travel = new FormGroup({
        travelType : new FormControl(''),
        travelAmount : new FormControl(0),
        travelBTC : new FormControl('')
      })
  
      this.eventInitiation4Accomodation = new FormGroup({
        accomBTC : new FormControl(''),
        accomAmount : new FormControl(0)
      })
  
      this.panalselectionstandard = new FormGroup({
        uploadFCPA: new FormControl('',[Validators.required]),
        isHonararium:new FormControl('',[Validators.required]),
        honorariumAmount:new FormControl('',),
        uploadNOC : new FormControl('',),
        rationale : new FormControl('',),
        isTravelRequired:new FormControl('',[Validators.required]),
        travelAmount : new FormControl(''),
      
        travelType : new FormControl(''),
        travelamount:new FormControl('',[Validators.required]),
        isBTCBTE:new FormControl('',[Validators.required]),
        isAccomRequired: new FormControl('',[Validators.required]),
        accomAmount:new FormControl('',[Validators.required]),
        
        isBTCBTE1:new FormControl('',[Validators.required]),
        localConveyance:new FormControl('',[Validators.required]),
        localAmount:new FormControl('',[Validators.required]),
        timecalculationhonorariumifYes:new FormControl('',Validators.required),
        presentationDuration:new FormControl('',[Validators.required]),
        panelSessionPreparation:new FormControl('',[Validators.required]),
        qaSession:new FormControl('',[Validators.required]),
        briefingDuration:new FormControl('',[Validators.required]),
        panelDiscussionDuration:new FormControl('',[Validators.required]),
        localConveyanceinvitees:new FormControl('',[Validators.required]),
        localInviteeAmount:new FormControl('',[Validators.required]),
        localBTCBTE:new FormControl('',[Validators.required]),
        InviteeName:new FormControl('',[Validators.required]),
        InviteeEmail:new FormControl('',[Validators.required]),
        BTCTotalAmount:new FormControl('',[Validators.required]),
        BTETotalAmount:new FormControl('',[Validators.required]),
        BudgetAmount:new FormControl('',[Validators.required])
      })
  
      this.inviteeSelectionForm = new FormGroup({
        inviteesFrom : new FormControl('',Validators.required),
        inviteeName : new FormControl('',Validators.required),
        inviteeMisCode : new FormControl(''),
        isInviteeLocalConveyance : new FormControl('No',Validators.required),
        inviteeLocalConveyanceAmount : new FormControl(0),
        inviteeBTC : new FormControl('') 
      })
  
      this.expenseSelectionForm = new FormGroup({
        expenseType : new FormControl('',Validators.required),
        expenseAmount : new FormControl('',Validators.required),
        isExcludingTax : new FormControl('',Validators.required),
        isExpenseBtc : new FormControl('',Validators.required),
        uploadExpenseDeviation : new FormControl('')
      })
  
  
    }
  
    ngOnInit(): void {
  
     
      this.event1FormPrepopulate();
      this.event2FormPrepopulate();
      this.event3FormPrepopulate();
      this.event4FormPrepopulate();
      this.event4FormSpeakerPrepopulate();
      this.event4FormTrainerPrepopulate();
      this.event4FormOtherPrepopulate();
      this.eventInitiatio4HonarariumPrepopulate();
      
      // this.slideKitPrePopulate();
      this.event4FormSubPrepopulate();
      this.inviteeSelectionFormPrePopulate();
      this.expenseSelectionFormPrePopulate();
      // this.amountPrePopulate();
      // this.event5FormPrepopulate();
      // this.event6FormPrepopulate();
      // this.event7FormPrepopulate();
      
    }
  
    // Event Initiation Form1 COntrol
    static upload1: any ;
    static withIn30Days : boolean;
   
  
    event1FormPrepopulate(){
      this.eventInitiation1.valueChanges.subscribe(changes => {
        if(changes.eventDate){
          // console.log(changes.eventDate)
          let today : any = new Date();
          let eventDate = new Date(changes.eventDate);
  
          let Difference_In_Time = eventDate.getTime() - today.getTime();
  
          let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  
          this.eventDate = changes.eventDate
  
          if(Difference_In_Days <= 7){
            this.show7DaysUploadDeviation = true;
          }
          else this.show7DaysUploadDeviation = false
  
        }
        if(this.eventInitiation1.valid){
          this.isStep1Valid = true;
        }
        else this.isStep1Valid = false;
      })
  
     
     
      
      
    }
  
    // Filter Events within 30 days
    eventsWithin30Days: any[] =[] ;
    filterEventsWithIn30Days(eventList:any){
      if(Boolean(eventList) && eventList.length > 0){
        eventList.forEach(event => {
          let today : any = new Date();
          // console.log(event.EventDate)
          if(event.EventDate){
            let eventDate : any = new Date(event.EventDate);
            if(eventDate > today){
             
              let Difference_In_Time = eventDate.getTime() - today.getTime();
     
              // To calculate the no. of days between two dates
              let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
    
              if(Difference_In_Days <= 30){
                this.eventsWithin30Days.push(event)
              }
            }
            // console.log(new Date(event.EventDate))
    
            // console.log(event.EventDate)
          }
         
        })
      }
  
      // this.pageLoaded = true
      if(this.eventsWithin30Days.length > 0){
        this.show30DaysUploaDeviation = true;
      }
      console.log(this.eventsWithin30Days)
      
  
    }
  
    // Event Initiation Form2 Control
    static startTime : any;
  
    allStates : any;
    allCity : any;
    filteredCity : any;
  
    // New Values
    eventType : string = 'EVTWEB'
    eventDate : string ;

    showVendorFields : boolean = false;
  
    event2FormPrepopulate(){
      this.eventInitiation2.valueChanges.subscribe(changes => {
        if(changes.startTime){
          // console.log(changes.startTime)
          WebinarEventRequestComponent.startTime = changes.startTime;
        }
        // if(changes.state){
        //   this.filteredCity = this._filterCity(changes.state)
        // }
        
        if(changes.meetingType == 'Vendor'){
          this.showVendorFields = true;
        }
        else{
          this.showVendorFields = false;
        }
        this.isStep2Valid = (this.eventInitiation2.valid)? true : false;
      })
  
    }
  
    private _filterCity(stateId){
      return this.allCity.filter(city => city.StateId === stateId)
  
    }
  
    
  
    
  
  
    // Event Initiation Form3 Control
  
    // Adding value to Brand Tables
    showBrandTable : boolean = false;
    brandTableDetails : any[] = [];
  
    brandNames : any;
  
    // New Values:
    percentageAllocation: number = 0;
    projectId : string = '';
    eventCode : string = this.eventType;
  
    totalPercent : number = 0;
  
    
    filterBrandDetailsForClass1(){
      this.brandNames = this.brandNames.filter(brand => {
          const name = brand.Name.split("_")
          return name[1] == 'Class I';
        // return brand.Name.toLowerCase().includes('classi');
      })
      // console.log(this.brandNames)
      
    }
    addToBrandTable(){
      // console.log(this.eventInitiation3.valid)
      if(this.eventInitiation3.valid){
        // console.log(this.eventInitiation3.value)
        // this.brandTableDetails.push(this.eventInitiation3.value);
        // this.showBrandTable = true;
        // 
        this.totalPercent = this.totalPercent + this.percentageAllocation;
        // console.log(this.totalPercent)
        if(this.totalPercent <= 100){
          const brand = {
            BrandName : this.brandNames.find(brand => brand.BrandId == this.eventInitiation3.value.brandName).BrandName,
            PercentAllocation : this.percentageAllocation+"",
            ProjectId : this.projectId
          }
          
          // console.log(this.totalPercent)
          this.brandTableDetails.push(brand);
          this.isStep3Valid = (this.brandTableDetails.length > 0)? true : false;
          this.showBrandTable = true;
          this.eventInitiation3.reset();
          this.percentageAllocation = 0;
          this.projectId = '';
          this.eventCode = this.eventType;
        }
        else{
          this.totalPercent = this.totalPercent - this.percentageAllocation;
          alert("Percentage Allocation Should be less than 100")
        }
      }
      else alert("Select Brand")
    }
  
    event3FormPrepopulate(){
      this.eventInitiation3.valueChanges.subscribe(changes => {
        if(changes.brandName){
          console.log(changes.brandName)
          // console.log(this.getBrandWithId(changes.brandName))
          const selectedBrand = this._getBrandWithId(changes.brandName);
          this.projectId = selectedBrand.ProjectId;
          this.percentageAllocation = selectedBrand['%Allocation'] * 100;
        }
  
      })
    }
  
    private _getBrandWithId(brandId){
      return this.brandNames.find(brand => brand.BrandId == brandId)
    }
  
    openBrandUpdateModal(brand:any){
      const dialogRef =  this.dialog.open(ModalComponent,{
        width: '600px',
        data : brand
      });
  
      dialogRef.afterClosed().subscribe(
        res => { 
          // console.log(this.brandTableDetails)
          let updatedPercent:number = 0;
          this.brandTableDetails.forEach(brand => {
            updatedPercent += parseInt(brand.PercentageAllocation)
          })
          // console.log(updatedPercent)
          if(updatedPercent >= 100){
            alert("Percentage Allocation Should be less than or equal to 100");
          }
  
        }
      )
    }
  
    deleteBrand(brand, id){
      // delete this.brandTableDetails[id];
      this.brandTableDetails.splice(id,1); 
      this.totalPercent -= +brand.PercentAllocation; 
      
      this.isStep3Valid = (this.brandTableDetails.length > 0)? true : false;
  
      this.slideKitDropDownOptions = [];
      this.slideKitBrandMatch();
    }
  
    sendBrandDetails(){
      console.log(this.brandTableDetails)
      // this.utilityService.postBrandNames(this.brandTableDetails).subscribe(
      //   res => {
      //     console.log(res)
      //   },
      //   err => {
      //     alert("Brands not added")
      //   }
      // )
    }
  
  
  
    // Event Initiation Form4 Control
    
    approvedSpeakers : any;
    filteredspeakers : any;
  
    showOtherHCPRoleTextBox : boolean = false;
    showSpeakerForm : boolean = false;
    showTrainerForm : boolean = false;
    showOthersForm : boolean = false;
  
   
  
    event4FormPrepopulate(){
      
      this.eventInitiation4.valueChanges.subscribe(changes => {
        // console.log(changes)
        if(changes.hcpRole == "H6" ){
          this.showOthersForm = true;
          this.showOtherHCPRoleTextBox = true;
        }
        
        else{
          this.showOthersForm = false;
          this.showOtherHCPRoleTextBox = false;
        }
  
        if(changes.hcpRole !== "H1" && changes.hcpRole !== "H2"){
          this.showOthersForm = true;
  
        }
        else{
          this.showOthersForm = false;
        }
  
        if(changes.hcpRole == 'H1'){
          this.showSpeakerForm = true;
        }
        else{
          this.showSpeakerForm = false;
        }
  
        if(changes.hcpRole == 'H2'){
          this.showTrainerForm = true;
          this.trainerMisCode = '';
          this.hideTrainerMisCode = true;
          this.trainerCode = '';
          this.trainerSpeciality = '';
          this.trainerTier = '';
          this.trainerGoNonGo = '';
  
        }
        else { this.showTrainerForm = false;}
  
      
  
        // if(changes.goNonGo == "GO"){
        //   this.showUploadNOC = true;
        //   this.showRationale = true;
        // }
        // else{
        //   this.showUploadNOC = false;
        //   this.showRationale = false;
        // }
  
        
      })
    }
  
    speakerName: string = '';
    speakerCode : string = '';
    speakerSpeciality : string = '';
    speakerTier : string = '';
    speakerGoNonGo : string = '';
    hcpRoleWritten : string = '';
    speakerMisCode : string = '';
  
    filteredSpeakerLength : number = 0;
    speakersWithSameName : any;
  
    filteredSpeakerByName : any
  
    hideSpeakerMisCode : boolean = true;
    showRationale :boolean = true;
  
    event4FormSpeakerPrepopulate(){
      console.log(this.approvedSpeakers)
      this.eventInitiation4Speaker.valueChanges.subscribe(
        changes => {
          if(changes.speakerName !== ''){
           
            this.filteredspeakers = this._filter(changes.speakerName);
            // console.log(this.filteredspeakers.length)
  
            
            
           if(Boolean(this.filteredspeakers)){
            if(this.filteredspeakers.length == 1){
              
              this.hideSpeakerMisCode = true;
  
                this.speakerName  = this.filteredspeakers[0].SpeakerName;
                this.speakerCode = this.filteredspeakers[0].SpeakerCode;
                this.speakerSpeciality = this.filteredspeakers[0].Speciality;
                this.speakerGoNonGo = (this.filteredspeakers[0].isNonGO == "yes")? 'Non GO' : 'GO';
                this.speakerTier = this.filteredspeakers[0].TierType;  
                this.speakerMisCode = this.filteredspeakers[0].MISCode;
            }
            else{
              this.hideSpeakerMisCode = false;
              this.filteredSpeakerByName = this._getFilteredSpeakerByName(changes.speakerName);
              console.log(this.filteredSpeakerByName)
              this.speakerName  = '';
              this.speakerCode = '';
              this.speakerSpeciality = '';
              this.speakerGoNonGo = '';
              this.speakerTier = '';  
              this.speakerMisCode = '';
            }
           }
    
            
          }
  
          if(changes.speakerMisCode){
            // console.log(this._getFilteredSpeaker(changes.speakerMisCode))
            if(!this.hideSpeakerMisCode){
              const filteredSpeaker = this._getFilteredSpeaker(changes.speakerMisCode);
              this.speakerName  = filteredSpeaker.SpeakerName;
              this.speakerCode = filteredSpeaker.SpeakerCode;
              this.speakerSpeciality = filteredSpeaker.Speciality;
              this.speakerGoNonGo = (filteredSpeaker.isNonGO == "yes")? 'Non GO' : 'GO';
              this.speakerTier = filteredSpeaker.TierType; 
              this.speakerMisCode = changes.speakerMisCode;
  
            }
             
          if(this.speakerGoNonGo == 'GO'){
            this.showRationale = true;
          }
          else this.showRationale = false;
  
            // this.filteredspeakers = this._getFilteredSpeaker(changes.speakerMisCode);
  
          }
        }
      )
    }
  
    private _filter(value: string): string[] {
      // console.log(this.employeeDetails)
      if(Boolean(value)){
        return this.approvedSpeakers.filter(emp => {
          if(Boolean(emp.SpeakerName)){
            if(emp.SpeakerName.toLowerCase().includes(value.toLowerCase())){
              return emp;
            }
          }
          
        });
      }
    }
  
    private _getFilteredSpeaker(misCode : string){
      if(Boolean(misCode)){
        return this.approvedSpeakers.find(speaker => {
          if(Boolean(speaker.MISCode)){
            if(speaker.MISCode == misCode){
              return speaker;
            }
          }
        })
      }
    }
  
    private _getFilteredSpeakerByName(name : string){
      if(Boolean(name)){
        let speakers : any[] = [];
  
        this.approvedSpeakers.forEach(speaker => {
          if(Boolean(speaker.SpeakerName)){
            if(speaker.SpeakerName.toLowerCase() == name.toLowerCase()){
              speakers.push(speaker);
            }
          }
        })
  
        return speakers;
      }
    }
  
    
  
    otherSpeciality : string = '';
    otherTier : string = '';
    otherGoNonGo : string = '';
    otherMisCode :string = '';
  
    hideOtherMisCode : boolean = true;
  
    filteredOthers : any;
    filteredOthersByName : any;
  
    event4FormOtherPrepopulate(){
      this.eventInitiation4Other.valueChanges.subscribe(
        changes => {
          if(changes.otherName){
            // console.log(this.filterHCPMasterInvitees(changes.otherName))
            this.filteredOthers = this.filterHCPMasterInvitees(changes.otherName);
  
            if(Boolean(this.filteredOthers)){
              if(this.filteredOthers.length == 1){
                this.hideOtherMisCode = true;
    
                this.otherSpeciality = this.filteredOthers[0].Speciality
                this.otherGoNonGo = this.filteredOthers[0]['GO/Non-GO'];
                this.otherMisCode = this.filteredOthers[0].MISCode
              }
              else{
                this.hideOtherMisCode = false;
                this.filteredOthersByName = this.getHCPMasterInviteeWithName(changes.otherName);
                this.otherSpeciality = ''
                this.otherGoNonGo = ''
                this.otherMisCode = ''
              }
            }
  
            if(changes.otherMisCode){
              if(!this.hideOtherMisCode){
                console.log(this._getFilteredOther(changes.otherMisCode))
                const filteredOther = this._getFilteredOther(changes.otherMisCode);
                if(Boolean(filteredOther)){
                  this.otherSpeciality = filteredOther['Speciality']
                  this.otherGoNonGo = filteredOther['GO/Non-GO'];
                  this.otherMisCode = changes.otherMisCode
                }
  
              }
            }
  
          }
          if(this.otherGoNonGo == 'GO'){
            this.showRationale = true;
          }
          else this.showRationale = false;
  
  
          // console.log(this.eventInitiation4Other.controls.otherName.touched)
        }
      )
    }
  
    private _getFilteredOther(misCode : string){
      if(Boolean(misCode)){
        return this.inviteesFromHCPMaster.find(invitee => 
          {
            if(invitee['MISCode']){
              if(invitee.MISCode == misCode) return invitee
            }
          })
      }
    }
  
    
  
  
  
  
  
    trainerCode : string = '';
    trainerSpeciality : string = '';
    trainerTier : string = '';
    trainerGoNonGo : string = '';
    trainerMisCode : string = '';
  
    hideTrainerMisCode : boolean = true;
  
    // Data From Sheet
    approvedTrainers : any;
  
    filteredTrainerOption : any;
    filteredTrainerOptionByName : any;
    filteredTrainerMisCodeOption : any;
    event4FormTrainerPrepopulate(){
      this.eventInitiation4Trainer.valueChanges.subscribe(
        changes => {
         
          if(changes.trainerName !==''){
            this.filteredTrainerOption = this._filterTrainer(changes.trainerName)
  
           if(Boolean(this.filteredTrainerOption)){
            if(this.filteredTrainerOption.length == 1){
              this.hideTrainerMisCode = true
  
              this.trainerCode = this.filteredTrainerOption[0].TrainerCode;
              this.trainerSpeciality = this.filteredTrainerOption[0].Speciality;
              this.trainerTier = this.filteredTrainerOption[0].TierType;
              this.trainerGoNonGo = (this.filteredTrainerOption[0].Is_NONGO == "yes")?'Non Go':'Go';
              this.trainerMisCode = this.filteredTrainerOption[0].MISCode;
            }
            else{
              this.hideTrainerMisCode = false;
              this.filteredTrainerOptionByName = this._getFilteredTrainer(changes.trainerName);
              console.log(this.filteredTrainerOptionByName)
              this.trainerCode = '';
              this.trainerSpeciality = '';
              this.trainerTier = '';
              this.trainerGoNonGo = '';
              this.trainerMisCode = '';
            }
           }
          }
          if(changes.trainerMisCode){
            if(!this.hideTrainerMisCode){
              const filteredTrainer = this._filterTrainerByMisCode(changes.trainerMisCode);
          
              this.trainerCode = filteredTrainer.TrainerCode;
              this.trainerSpeciality = filteredTrainer.Speciality;
              this.trainerTier = filteredTrainer.TierType;
              this.trainerGoNonGo = (filteredTrainer.Is_NONGO == "yes")?'Non Go':'Go';
              this.trainerMisCode = changes.trainerMisCode;
            }
            
  
          }
  
          if(this.trainerGoNonGo == 'Go'){
            this.showRationale = true;
          }
          else this.showRationale = false;
        }
      )
    }
  
    private _filterTrainer(name:string){
      if(Boolean(name)){
        return this.approvedTrainers.filter(trainer => trainer.TrainerName.toLowerCase().includes(name.toLowerCase()))
      }
    }
  
    private _filterTrainerByMisCode(misCode : string){
      if(Boolean(misCode)){
        return this.approvedTrainers.find(trainer => trainer.MISCode == misCode)
      }
    }
  
    private _getFilteredTrainer(name:string){
     if(Boolean(name)){
      let filteredTrainerByName : any[] = [];
      this.approvedTrainers.forEach(trainer => {
          if(trainer.TrainerName.toLowerCase() === name.toLowerCase()){
            filteredTrainerByName.push(trainer);
          }
      })
      return filteredTrainerByName;
     }
    }
  
    showTravelForm : boolean = false;
    showAccomForm : boolean = false;
    showLocalConveyance : boolean = false;
  
    event4FormSubPrepopulate(){
      this.eventInitiation4Sub.valueChanges.subscribe(
        changes => {
          if(changes.isHonararium == "Yes"){
            this.isHonararium = true;
          }
          else{
            this.isHonararium = false;
          }
          if(changes.isTravelRequired == "Yes"){
            this.showTravelForm = true;
          }
          else{
            this.showTravelForm = false;
          }
  
          if(changes.isAccomRequired == "Yes"){
            this.showAccomForm = true;
          }
          else{
            this.showAccomForm = false;
          }
  
          if(changes.isLocalConveyance == "Yes"){
            this.showLocalConveyance = true;
          }
          else{
            this.showLocalConveyance = false;
          }
        }
      )
    }
  
    isHonarariumYes:boolean=true
    isTravelYes : boolean = true
    isAccomYes:boolean=true
    isLocalYes:boolean=true
    timecalculationhonorariumifYes:boolean=true
    invitesslocalyes:boolean=true
  
    event4FormPanelSelectionPrepopuate(){
  
    }
  
    
  
  
  
    hcpTableDetails : any[] = [];
  
    addHCPTable(){
      let hcpValidity : number = 0;
  
      let hcpname : string = '';
        let hcpMisCode : string = '';
        let hcpgoNonGo : string = '';
        if(this.showSpeakerForm && this.speakerName !== ''){
          hcpname = this.speakerName;
          hcpMisCode = this.speakerMisCode;
          hcpgoNonGo =  this.speakerGoNonGo;
        }
        if(this.showTrainerForm && this.eventInitiation4Trainer.controls.trainerName.value !== ''){
          hcpname = this.eventInitiation4Trainer.controls.trainerName.value;
          hcpMisCode = this.trainerMisCode;
          hcpgoNonGo = this.trainerGoNonGo;
        }
        if(this.showOthersForm && this.eventInitiation4Other.controls.otherName.value !==''){
          hcpname = this.eventInitiation4Other.controls.otherName.value;
          hcpMisCode = this.otherMisCode;
          hcpgoNonGo = this.otherGoNonGo;
        }
  
        if(this.eventInitiation4Sub.invalid){
          if(this.eventInitiation4Sub.controls.fcpaDate.invalid){
            alert("FCPA Date is missing");
            hcpValidity++;
          }
          if(this.eventInitiation4Sub.controls.isAdvanceRequired.invalid){
            alert("Is advance required is missing");
            hcpValidity++;
          }
        }
  
        // console.log("HonarVal",this.eventInitiatio4Honararium.valid)
        if(this.isHonararium && !this.eventInitiatio4Honararium.valid){
          alert("Honararium Details are missing")
          hcpValidity++;
   
  
          
        }
  
        // console.log('HCP',Boolean(hcpname))
      // if(!this.eventInitiation4.valid){
      //   alert("Select HCP Role")
      //   hcpValidity++;
      // }
  
      if(!Boolean(hcpname) && !Boolean(hcpgoNonGo) && !Boolean(hcpMisCode)){
        alert("HCP Role Details are missing")
        hcpValidity++;
      }
  
      if(this.eventInitiation4Sub.value.isHonararium == "Yes" && this.eventInitiatio4Honararium.value.honorariumAmount == 0){
        alert("Honararium amount is missing")
        hcpValidity++;
      }
  
      let honarariumDuration = this.eventInitiatio4Honararium.value;
      // console.log("honar",honarariumDuration)
      if(this.eventInitiation4Sub.value.isHonararium == "Yes" && !this.eventInitiatio4Honararium.valid && (
        honarariumDuration.presentationDuration == 0
        || honarariumDuration.panelSessionPreparation == 0 || honarariumDuration.qaSession == 0 
        || honarariumDuration.briefingDuration == 0 || honarariumDuration.panelDiscussionDuration == 0
      )){
          alert("Honararium Details are missing");
          hcpValidity++;
        }
  
      if(this.isHonararium && this.showRationale && this.eventInitiatio4Honararium.value.rationale == 0){
        alert("Rationale Amount is missing");
        hcpValidity++;
      }
  
      if(this.eventInitiation4Sub.value.isTravelRequired == "Yes" && (this.eventInitiation4Travel.value.travelAmount == 0 
      || !Boolean(this.eventInitiation4Travel.value.travelType) || !Boolean(this.eventInitiation4Travel.value.travelBTC))){
        alert("Travel Deatails are missing")
        hcpValidity++;
      }
      
      if(this.eventInitiation4Sub.value.isLocalConveyance == "Yes" && this.eventInitiation4Sub.value.localConveyanceAmount == 0){
        alert("Local Conveyance Amount is missing");
        hcpValidity++;
      }
  
      if(this.eventInitiation4Sub.value.isAccomRequired == "Yes" && (this.eventInitiation4Accomodation.value.accomAmount == 0 || !Boolean(this.eventInitiation4Accomodation.value.accomBTC))){
        alert("Accomodation Details are missing");
        hcpValidity++;
      }
  
      if(this.showOtherHCPRoleTextBox && !Boolean(this.hcpRoleWritten)){
        alert("HCP Role is Missing");
        hcpValidity++;
      }
  
      if(hcpValidity == 0){
        
        const HcpData  = {
          // For API
          EventIdorEventRequestId : " ",
          SpeakerCode : (Boolean(this.speakerCode))? this.speakerCode : " ",
          TrainerCode : (Boolean(this.trainerCode))? this.trainerCode : " ",
          Speciality : (Boolean(this.speakerSpeciality))? this.speakerSpeciality : this.trainerSpeciality,
          Tier : (Boolean(this.speakerTier))? this.speakerTier : this.trainerTier,
          Rationale : (this.isHonararium && this.showRationale)? this.eventInitiatio4Honararium.value.rationale+'' : 0+'',
          PresentationDuration : honarariumDuration.presentationDuration+'' ,
          PanelSessionPreperationDuration :  honarariumDuration.panelSessionPreparation+'',
          PanelDisscussionDuration : honarariumDuration.panelDiscussionDuration+'',
          QaSessionDuration : honarariumDuration.qaSession+'',
          BriefingSession : honarariumDuration.briefingDuration+'',
          TotalSessionHours : (Boolean(this.totalHours))? this.totalHours+'' : 0+'',
  
          // For Amount
          isTravelBTC : this.eventInitiation4Travel.value.travelBTC,
          isAccomBTC : this.eventInitiation4Accomodation.value.accomBTC,
  
  
          // For Table
          HcpRole : (!this.showOtherHCPRoleTextBox)? this.hcpRoles.find(role => { if(this.eventInitiation4.value.hcpRole == role.HCPRoleID) return role }).HCPRole : this.hcpRoleWritten,
          HcpName : hcpname,
          MisCode : hcpMisCode+'',
          GOorNGO : hcpgoNonGo,
          HonorariumRequired : this.eventInitiation4Sub.value.isHonararium,
          HonarariumAmount : this.eventInitiatio4Honararium.value.honorariumAmount+'',
          Travel : this.eventInitiation4Travel.value.travelAmount+'',
          LocalConveyance : this.eventInitiation4Sub.value.localConveyanceAmount+'',
          Accomdation : this.eventInitiation4Accomodation.value.accomAmount+'',
          FinalAmount : (parseInt(this.eventInitiatio4Honararium.value.honorariumAmount)+ parseInt(this.eventInitiation4Travel.value.travelAmount)+
                      parseInt( this.eventInitiation4Sub.value.localConveyanceAmount)+parseInt(this.eventInitiation4Accomodation.value.accomAmount))+''
        }
  
        if(this.showOthersForm){
          HcpData.Speciality = this.otherSpeciality;
          HcpData.Tier = " ";
  
        }
  
        this.BTCTotalAmount += parseInt(HcpData.HonarariumAmount)
  
        // console.log(HcpData)
        if(HcpData.isTravelBTC == 'BTC'){
          this.BTCTotalAmount += parseInt(HcpData.Travel);
        }
        else{
          this.BTETotalAmount += parseInt(HcpData.Travel)
        }
  
        if(HcpData.isAccomBTC == 'BTC'){
          this.BTCTotalAmount += parseInt(HcpData.Accomdation);
        }
        else{
          this.BTETotalAmount += parseInt(HcpData.Accomdation)
        }
  
        this.hcpTableDetails.push(HcpData);
  
        for(let i=0;i< this.hcpTableDetails.length;i++){
          this.slideKitTableInput.push('slideBrand'+i);
          this.slideKitTableRadio.push('radio'+i)
        }
  
        
  
        this.isStep4Valid = (this.hcpTableDetails.length > 0)? true : false;
  
        hcpname = '';
        hcpgoNonGo = '';
        hcpMisCode = '';
        hcpValidity = 0;
  
        this.speakerCode = '';
        this.trainerCode = '';
        this.speakerMisCode = '';
        this.speakerGoNonGo = '';
        this.speakerName = '';
        this.speakerTier = '';
        this.speakerSpeciality = '';
        this.hideSpeakerMisCode = true;
        this.eventInitiation4.reset();
        this.eventInitiation4Speaker.reset();
        this.eventInitiation4Trainer.reset();
        this.eventInitiation4Other.reset();
        this.eventInitiation4Travel.reset();
        this.eventInitiation4Travel.controls.travelAmount.setValue(0);
        this.eventInitiation4Accomodation.reset();
        this.eventInitiation4Accomodation.controls.accomAmount.setValue(0);
        this.eventInitiation4Sub.controls.isTravelRequired.setValue('No');
        this.eventInitiation4Sub.controls.isAccomRequired.setValue('No');
        this.eventInitiation4Sub.controls.isHonararium.setValue('No');
        this.eventInitiation4Sub.controls.isLocalConveyance.setValue('No');
        this.eventInitiation4Sub.controls.localConveyanceAmount.setValue(0);
        this.eventInitiation4Sub.controls.fcpaDate.setValue('');
  
        this.otherGoNonGo = '';
        this.otherSpeciality = '';
        this.otherMisCode = '';
        this.otherTier = '';
        this.hcpRoleWritten = '';
  
        
        this.eventInitiatio4Honararium.reset();
        this.eventInitiatio4Honararium.controls.presentationDuration.setValue(0);
        this.eventInitiatio4Honararium.controls.panelSessionPreparation.setValue(0);
        this.eventInitiatio4Honararium.controls.qaSession.setValue(0);
        this.eventInitiatio4Honararium.controls.honorariumAmount.setValue(0);
        this.eventInitiatio4Honararium.controls.briefingDuration.setValue(0);
        // this.eventInitiatio4Honararium.controls.isHonararium.setValue('');
        this.eventInitiatio4Honararium.controls.panelDiscussionDuration.setValue(0);
        this.eventInitiatio4Honararium.controls.rationale.setValue(0);
        this.totalHours = 0;
  
        this.benificiaryName = '';
        this.bankAccountNumber = '';
        this.panCardNumber = '';
        this.nameAsPan = '';
        this.ifscCode = '';
  
  
        
      }
    }
  
    openHCPTableUpdateModal(hcpData:any){
      const dialogRef =  this.dialog.open(ModalComponent,{
        width: '800px',
        data : hcpData
      });
    }
  
    deletHcp(id){
      this.hcpTableDetails.splice(id,1); 
      this.isStep4Valid = (this.hcpTableDetails.length > 0)? true : false;
  
      for(let i=0;i< this.hcpTableDetails.length;i++){
        this.slideKitTableInput.push('slideBrand'+i);
        this.slideKitTableRadio.push('radio'+i)
      }
  
    }
  
    // Event Initiation Form5 Control
    totalHours : any;
    remuneration : any;
    remunerationToCalculate : any;
    event5FormPrepopulate(){
      this.eventInitiation5.valueChanges.subscribe(
        changes => {
          // console.log(changes);
          
          this.totalHours = ((changes.presentationDuration + changes.panelDiscussionDuration + 
                            changes.panelSessionPreparation + changes.qaSession + changes.briefingDuration)/60).toFixed(2);
          if(this.totalHours >= 8){
            alert("Max of 8 hours only")
          }
          this.remuneration = (this.remunerationToCalculate * this.totalHours);
  
        }
      )
    }
  
    getRemuneration(speciality,tier){
      this.utilityService.getFmv(speciality,tier).subscribe(
        res => {
          console.log(res)
          this.remunerationToCalculate = res;
        },
        err => {
          alert("Unexpected Error Happened")
        }
      )
    }
  
  
    // Event Initiation Form6 Control
    showUploadNOC : boolean = false;
    
    showOtherCurrencyTextBox : boolean = false;
  
    // vendorDetails : any ;
    filteredAccounts : any;
  
    isHonararium : boolean = false;
    isVendorPresent : boolean = false;
    // Additional Values:
    currency : string = '';
    otherCurrency : string = ''
    taxSelect : string = '';
    benificiaryName : string = ''
    bankAccountNumber : string = ''
    nameAsPan : string = ''
    panCardNumber : string = ''
    ifscCode : string = ''
    emailId : string = ''
    uploadPAN : any = '';
    uploadCheque : any = '';
  
    eventInitiatio4HonarariumPrepopulate(){
      this.eventInitiatio4Honararium.valueChanges.subscribe(
        changes => {
  
          this.totalHours = ((changes.presentationDuration + changes.panelDiscussionDuration + 
                    changes.panelSessionPreparation + changes.qaSession + changes.briefingDuration)/60).toFixed(2);
          if(this.totalHours >= 8){
          alert("Max of 8 hours only")
          }
          console.log(changes)
          if(changes.currency == 'other'){
            this.showOtherCurrencyTextBox = true;
          }
          else{
            this.showOtherCurrencyTextBox = false
          }
          // console.log(changes.benificiaryName)
          if(changes.benificiaryName){
            
            // console.log(this._filterBankAccounts(changes.bankAccountNumber))
            this.filteredAccounts = this._filterBankAccounts(changes.benificiaryName);
            // console.log(this.filteredAccounts)
            if(this.eventInitiatio4Honararium.controls.bankAccountNumber.valid){
              // console.log(this._getSelectedBankDetails(changes.bankAccountNumber))
              const filteredVendor = this._getSelectedBankDetails(changes.benificiaryName);
              console.log(filteredVendor)
              if(filteredVendor){
                this.isVendorPresent = true;
                this.bankAccountNumber = filteredVendor.BankAccountNumber;
                this.benificiaryName = filteredVendor.BeneficiaryName;
                this.nameAsPan = filteredVendor.PanCardName;
                this.panCardNumber = filteredVendor.PanNumber;
                this.ifscCode = filteredVendor.IfscCode
              }
            }
          }
  
          
        }
      )
    }
    private _getSelectedBankDetails(acctNumber : any){
      return this.vendorDetails.find(ven => {
        if(ven.BeneficiaryName){
          // console.log(typeof ven.BankAccountNumber);
          // console.log(typeof acctNumber)
          return ven.BeneficiaryName == acctNumber
        }
      })
    }
  
    private _filterBankAccounts(value: string): string[] {
      // console.log(this.employeeDetails)
      const filterValue = value.toLowerCase();
      
      return this.vendorDetails.filter(ven =>{
        
        if(ven.BeneficiaryName){
          const benName = ven.BeneficiaryName.toLowerCase();
          
          return benName.includes(filterValue);
        }
        
      })
    }
  
  
    // SideKit Selection:
    slideKitDetails : any;
    slideKitDropDown : any;
    slideKitDropDownOptions : any[] =[];
  
    slideKitTableInput : any[] = [];
    slideKitTableRadio : any[] = [];
  
    slideKitTableDetails : any[] = [];
  
    slideKitType : any ;
    idShown : any[] = [];
    misCode : any;
    // showSlideKitUploadFile : boolean = false
  
    slideKitRadioOption(option : any, name : string, id : string,misCode:string){
      // console.log(misCode);
      this.misCode = misCode;
      // console.log(name)
      // console.log(document.getElementById(id[id.length-1]))
      // if(name)
      
        if(this.idShown.indexOf(id) == -1){
          this.idShown.push(id);
        }
        // else{
        //   this.idShown.push(id)
        // }
  
        if(this.idShown.length == this.hcpTableDetails.length){
          this.isStep5Valid = true;
        }else this.isStep5Valid = false;
      
      
      console.log(this.idShown)
      if(option == 'SlideKit From Company'){
        
      
        this.slideKitType = option;
        // document.getElementById(id).style.visibility = "visible";
        document.getElementById(id).style.display = 'block';
        document.getElementById(misCode+id).style.display = 'none'
        // console.log(document.getElementById(misCode+id))
        // this.showSlideKitUploadFile = false;  
      }
      else{
        const slideKitDetail = {
          EventId: " ",
          Mis: this.misCode,
          SlideKitType: option,
          SlideKitDocument: " "
      }
  
        if(this.slideKitTableDetails.length > 0){
          if(!this.slideKitTableDetails.find(ele => ele.Mis == this.misCode)){
            this.slideKitTableDetails.push(slideKitDetail)
          }
        }
        else{
          this.slideKitTableDetails.push(slideKitDetail);
        }
        
      
        
        // document.getElementById(id).style.visibility = "hidden";
        document.getElementById(id).style.display = 'none';
        document.getElementById(misCode+id).style.display = 'block'
        // this.showSlideKitUploadFile = true;
      }
      
    }
  
    slideKitPrePopulate(a:any){
      
  
        // console.log(id)
        // console.log('Mis',data)
        const slideKitDetail = {
          EventId: " ",
          Mis: this.misCode,
          SlideKitType: this.slideKitType,
          SlideKitDocument: a
      }
        // this.slideKitDropDown = a;
        
  
        if(this.slideKitTableDetails.length > 0){
          if(!this.slideKitTableDetails.find(ele => ele.Mis == this.misCode)){
            this.slideKitTableDetails.push(slideKitDetail);
            // console.log('aa')
          }
        }
        else{
          this.slideKitTableDetails.push(slideKitDetail);
        }
        // console.log(this.slideKitTableDetails);
  
      
     
    //  this.isStep5Valid = (Boolean(this.slideKitDropDown))? true : false;
      // if(Boolean(this.brandTableDetails) && this.brandTableDetails.length > 0){
      //   console.log(this.brandTableDetails)
  
  
      // }
    }
  
    printSlideKitDetails(){
      console.log(this.slideKitTableDetails)
    }
  
    slideKitBrandMatch(){
      let activeSlideKits : any[] = [];
      if(Boolean(this.slideKitDetails) && this.slideKitDetails.length > 0){
        this.slideKitDetails.forEach(slideKit => {
          if(slideKit.IsActive == 'Yes'){
              activeSlideKits.push(slideKit)
          }
        })
      }
      console.log(activeSlideKits)
      activeSlideKits.forEach(slideKit =>{
        this.brandTableDetails.forEach(brand => {
          if(slideKit.BrandName == brand.BrandName){
            this.slideKitDropDownOptions.push(slideKit)
          }
        })
      })
  
      console.log(this.slideKitDropDownOptions)
    }
  
  
    hideUploadFile : boolean = false;
    
  
  
    // Invitee Control
    showInviteeLocalConveyance : boolean = false;
  
    inviteesFromHCPMaster : any ;
  
    filteredHCPMasterInvitees : any;
    filteredInviteeLength : number = 0;
  
    filteredInviteeMisCode : string ;
    hideInviteeMisCode : boolean = true;
    filteredInviteeMisCodeSelect : any[] = [];
  
    inviteeSelectionFormPrePopulate(){
      this.inviteeSelectionForm.valueChanges.subscribe(
        changes => {
          if(changes.isInviteeLocalConveyance == 'Yes'){
            this.showInviteeLocalConveyance = true;
          }
          else{
            this.showInviteeLocalConveyance = false;
          }
          if(changes.inviteesFrom){
            this.filteredHCPMasterInvitees = null;
            this.filteredInviteeMisCode = '';
            // console.log(this.inviteesFromHCPMaster)
          }
          // console.log(this.inviteeSelectionForm.controls.inviteesFrom)
          if(changes.inviteeName != ''){
            
            if(this.inviteeSelectionForm.controls.inviteesFrom.touched && changes.inviteesFrom == 'hcpMaster'){
              // console.log(this.filterHCPMasterInvitees(changes.inviteeName))
              this.filteredHCPMasterInvitees = this.filterHCPMasterInvitees(changes.inviteeName);
              // console.log(this.getHCPMasterInviteeWithName(changes.inviteeName));
              const filteredInvitee = this.getHCPMasterInviteeWithName(changes.inviteeName);
  
              if(filteredInvitee && filteredInvitee.length == 1){
                this.hideInviteeMisCode = true;
                this.filteredInviteeMisCode = filteredInvitee[0].MISCode;
              }
              else{
                this.hideInviteeMisCode = false
                this.filteredInviteeMisCodeSelect = filteredInvitee
              }
             
              
  
            }
            else{
              
              // alert("Select Invitees From")
            }
  
            if(changes.inviteeMisCode != ''){
              if(Boolean(changes.misCode)){
                this.filteredInviteeMisCode = this.getFilteredInvitee(changes.inviteeMisCode).MISCode;
              }
             
            }
           
          }
  
  
        }
      )
    }
  
    filterHCPMasterInvitees(name : string){
      console.log("nam",Boolean(name))
      if(Boolean(name)){
        return this.inviteesFromHCPMaster.filter(invitee =>{
          if(invitee['HCPName']){
            return invitee['HCPName'].toLowerCase().includes(name.toLowerCase())
          }
        });
      }
      // return this.inviteesFromHCPMaster.find(invitee => invitee['HCP Name'].includes(name))
    }
    
    getFilteredInvitee(misCode:string){
      console.log('mis',Boolean(misCode))
      if(Boolean(misCode)){
        return this.inviteesFromHCPMaster.find(invitee => invitee['MISCode'] == misCode);
      }
     
    }
  
    getHCPMasterInviteeWithName(name : string){
      if(Boolean(name)){
        const invitees : any[] = [];
      
        this.inviteesFromHCPMaster.forEach(invitee => {
          if(invitee['HCPName']){
            if(invitee['HCPName'].toLowerCase() === name.toLowerCase()) invitees.push(invitee)
          }
        }
      )
      return invitees;
      }
    }
  
    inviteeTableDetails : any[] = [];
    addToInviteeTable(){
      // console.log(this.inviteeSelectionForm.value)
      let inviteeValidity : number = 0;
  
      if(!this.inviteeSelectionForm.valid){
        alert("Please Fill all the details")
        inviteeValidity++;
      }
      // console.log(Boolean(this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount))
      if(this.showInviteeLocalConveyance && (this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount == 0 || !Boolean(this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount))){
        alert("Enter Local Conveyance Amount");
        inviteeValidity++;
      }
      if(this.showInviteeLocalConveyance && !Boolean(this.inviteeSelectionForm.value.inviteeBTC)){
        alert("Select BTC/BTE");
        inviteeValidity++;
      }
  
      if(!this.hideInviteeMisCode && !Boolean(this.inviteeSelectionForm.value.inviteeMisCode)){
        alert("Invitee MIS Code is missing");
        inviteeValidity++;
      }
      
      if(inviteeValidity == 0){
        if(this.inviteeSelectionForm.value.inviteeBTC == 'BTC'){
          this.BTCTotalAmount += this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount;
        }
        else{
          this.BTETotalAmount += this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount;
        }
        
        const inviteeData = {
          EventIdOrEventRequestId : ' ',
          MisCode : this.filteredInviteeMisCode+'',
          InviteeName : this.inviteeSelectionForm.value.inviteeName,
          LocalConveyance :  this.inviteeSelectionForm.value.isInviteeLocalConveyance,
          BtcorBte : (Boolean(this.inviteeSelectionForm.value.inviteeBTC))? this.inviteeSelectionForm.value.inviteeBTC : ' ',
          LcAmount : (this.showInviteeLocalConveyance)?this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount+'':0+'',
        }
        this.inviteeTableDetails.push(inviteeData);
        this.isStep6Valid = (this.inviteeTableDetails.length > 0)? true : false;
        // console.log(this.inviteeSelectionForm.controls)
        this.inviteeSelectionForm.reset();
        this.inviteeSelectionForm.controls.isInviteeLocalConveyance.setValue('No')
        
        // console.log(this.inviteeSelectionForm.controls)
        this.hideInviteeMisCode = true;
        this.filteredInviteeMisCode = '';
        this.filteredHCPMasterInvitees = null;
        inviteeValidity = 0;
      }
    }
  
    openInviteeUpdateModal(invitee : any){
      const dialogRef =  this.dialog.open(ModalComponent,{
        width: '600px',
        data : invitee
      });
    }
  
    deleteInvitee(id:number){
      this.inviteeTableDetails.splice(id,1);  
      this.isStep6Valid = (this.inviteeTableDetails.length > 0)? true : false;
    }
  
  
    // Expesne Form PrePopulate
  
    showExpenseDeviation : boolean = false;
  
    expenseTableDetails : any = [];
  
    expenseSelectionFormPrePopulate(){
      
      this.expenseSelectionForm.valueChanges.subscribe(
        changes => {
          if(changes.expenseType == 'foodAndBeverages'){
            if(changes.expenseAmount/this.inviteeTableDetails.length > 1500){
              this.showExpenseDeviation = true;
            }
            else{
              this.showExpenseDeviation = false;
            }
          }
          
        }
      )
    }
  
    addToExpenseTable(){
      if(this.expenseSelectionForm.valid){
        if(this.expenseSelectionForm.value.isExpenseBtc == 'BTC'){
          this.BTCTotalAmount += this.expenseSelectionForm.value.expenseAmount;
        }
        else{
          this.BTETotalAmount += this.expenseSelectionForm.value.expenseAmount;
        }
  
        this.BudgetAmount = this.BTCTotalAmount + this.BTETotalAmount;
  
        const expense = {
          // For API
          EventId : " ",
          BtcAmount : this.BTCTotalAmount+'',
          BteAmount : this.BTETotalAmount+'',
          BudgetAmount : this.BudgetAmount+'',
  
          // For Table
          Expense : this.expenseSelectionForm.value.expenseType,
          Amount : this.expenseSelectionForm.value.expenseAmount+'',
          AmountExcludingTax : this.expenseSelectionForm.value.isExcludingTax,
          BtcorBte : this.expenseSelectionForm.value.isExpenseBtc
        }
        this.expenseTableDetails.push(expense);
        this.isStep7Valid = (this.expenseTableDetails.length > 0)? true : false;
        this.expenseSelectionForm.reset();
        // console.log(this.expenseTableDetails);
      }
      else{
        alert("Please Fill all the fields")
      }
    }
  
    openExpenseUpdateModal(expense:any){
      const dialogRef =  this.dialog.open(ModalComponent,{
        width: '600px',
        data : expense
      });
  
    }
  
    deleteExpense(id:any){
      this.expenseTableDetails.splice(id,1); 
      this.isStep7Valid = (this.expenseTableDetails.length > 0)? true : false;
    }
  
    BTCTotalAmount : number = 0;
    BTETotalAmount : number = 0;
    BudgetAmount : number = 0; 
  
    private amountPrePopulate(){
     
      
      // this.eventInitiation4Travel.valueChanges.subscribe(changes =>{
      //   console.log(changes)
      //   if(changes.travelType == 'BTC'){
      //     // if(changes.travelAmount > 0 ){
      //     //   this.BTETotalAmount -= changes.travelAmount
      //     // }
         
      //     this.BTCTotalAmount = this.BTCTotalAmount + changes.travelAmount;
      //     console.log(this.BTCTotalAmount)
      //   }
      //   else{
      //     // if(changes.travelAmount > 0){
      //     //   this.BTCTotalAmount -= changes.travelAmount
      //     // }
      //     this.BTETotalAmount += parseInt(changes.travelAmount);
      //     console.log(this.BTETotalAmount);
      //   }
      // })
  
    }
  
    // Submitting Form
    submitForm(){
      if(!this.isStep1Valid){
        alert("Pre Event Check is missing");
      }
  
      if(!this.isStep2Valid){
        alert("Event Details are missing")
      }
  
      if(!this.isStep3Valid){
        alert('Brand Details are Missing');
      }
  
      if(!this.isStep4Valid){
        alert('Panel Selection is missing');
      }
  
      if(!this.isStep5Valid){
        alert("SlideKit selection is missing");
      }
  
      if(!this.isStep6Valid){
        alert("Invitee Selection is missing");
      }
  
      if(!this.isStep7Valid){
        alert("Expense Selection is missing");
      }
  
      
      if(this.isStep1Valid && this.isStep2Valid && this.isStep3Valid && this.isStep4Valid && this.isStep5Valid && this.isStep6Valid && this.isStep7Valid){
        let class1EventData = {
          EventTopic : this.eventInitiation2.value.eventTopic,
          EventType : this.eventDetails.find(event => event.EventTypeId == this.eventCode ).EventType,
          EventDate : new Date(this.eventInitiation1.value.eventDate),
          StartTime : this.eventInitiation2.value.startTime,
          EndTime : this.eventInitiation2.value.endTime,
          VenueName : " ",
          State :  " ",
          City : " ",
          BrandName : " ",
          PercentAllocation : " ",
          ProjectId: " ",
          HcpRole : " ",
          IsAdvanceRequired: this.eventInitiation4Sub.value.isAdvanceRequired,
          EventOpen30days: (this.show30DaysUploaDeviation)? 'Yes' : 'No',
          EventWithin7days : (this.show7DaysUploadDeviation)? 'Yes' : 'No'
        }
        const class1 = {
          Class1 : class1EventData,
          // ExpenseDetails : this.expenseTableDetails
          RequestBrandsList : this.brandTableDetails,
          EventRequestHcpRole : this.hcpTableDetails,
          EventRequestInvitees : this.inviteeTableDetails,
          EventRequestExpenseSheet : this.expenseTableDetails,
          EventRequestHCPSlideKits : this.slideKitTableDetails
        }
    
        console.log(class1)
        this.utilityService.postClass1PreEventRequest(class1).subscribe(res => {
          console.log(res)
          if(res){
            alert("Event is submitted Succesfully");
            
          }
        },
        err => console.log(err))
      }
      // console.log(this.brandTableDetails)
    }
  
  
    // Step Controls:
    isStep1Valid : boolean = false;
    isStep2Valid : boolean = false;
    isStep3Valid : boolean = false;
    isStep4Valid : boolean = false;
    isStep5Valid : boolean = false;
    isStep6Valid : boolean = false;
    isStep7Valid : boolean = false;
    isFormValid : boolean = true;
  
    @HostListener('window:resize',['$event'])
      onResize(event:Event){
        this.isMobileMenu();
      }
    isMobileMenu() {
      
      if ($(window).width() <= 598) {
          // return false;
          console.log("yes")
          this.orientation ="vertical"
          // return 'vertical'
      }
      else{
        console.log("No")
        this.orientation = "horizontal"
        // return 'horizontal'
      }
  };
  
    // File Upload Check
    selectedFile : File | null;
    onFileSelected(event:any){
      this.selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append('testFile', this.selectedFile);
      console.log(formData.get('testFile'))
  
      const dataToSend = {
        File : this.eventInitiation1.value.withIn30DaysDeviation,
      }
  
      console.log(dataToSend)
      this.utilityService.fileUpload(dataToSend).subscribe(
        res => {
          console.log(res);
        }
      )
     
    }
  
  
  
    stepControl1 = new FormGroup({
      step1 : new FormControl('',Step1Validator)
    })
    
  
    //Min Date
    today:string = new Date().toISOString().split('T')[0];
  }


  function endTimeValidator(control : AbstractControl): ValidationErrors | null{
  
    console.log(WebinarEventRequestComponent.startTime)
    if(WebinarEventRequestComponent.startTime < control.value){
      // console.log("Yes")
      return null;
    }
    else{
      return {customError : true}
    }
   
  }
  
  function MISValidator(control : AbstractControl): ValidationErrors | null{
    // console.log(control.value)
    if(control.value && control.value.startsWith('MS')){
      // console.log("No")
      return null
    }
    else{
      // console.log("Yes")
      return {customError : true}
    }
  }
  
  function Step1Validator(control : AbstractControl): ValidationErrors | null{
    // console.log(Class1EventRequestComponent.upload1)
    // console.log(Class1EventRequestComponent.withIn30Days)
    if(WebinarEventRequestComponent.withIn30Days){
      if(WebinarEventRequestComponent.upload1){
        return null;
      }
      else{
        return {customError : true};
      }
    }
    else{
      return null;
    }
   
  }
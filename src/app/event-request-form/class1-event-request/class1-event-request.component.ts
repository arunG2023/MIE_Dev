import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';

@Component({
  selector: 'app-class1-event-request',
  templateUrl: './class1-event-request.component.html',
  styleUrls: ['./class1-event-request.component.css']
})

export class Class1EventRequestComponent implements OnInit {
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
      res => this.inviteesFromHCPMaster = res
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
      venueName : new FormControl('', [Validators.required]),
      state : new FormControl('',[Validators.required]),
      city : new FormControl('', [Validators.required])
      
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

    /*
    this.eventInitiation5 = new FormGroup({
      presentationDuration : new FormControl(0,[Validators.required]),
      panelSessionPreparation : new FormControl(0,[Validators.required]),
      qaSession : new FormControl(0,[Validators.required]),
      briefingDuration : new FormControl(0,[Validators.required]),
      panelDiscussionDuration : new FormControl(0,[Validators.required]),
      // totalHours : new FormControl('',[Validators.required])
    })

    this.eventInitiation6 = new FormGroup({
      isHonararium : new FormControl('No',[Validators.required]),
      uploadNOC : new FormControl('',),
      rationale : new FormControl('',),
      // currency : new FormControl('',[Validators.required]),
      // otherCurrency : new FormControl('',),
      // taxSelect : new FormControl({value : '',disabled : !this.isHonararium}),
      // benficiaryName : new FormControl('',[Validators.required]),
      bankAccountNumber : new FormControl('',),
      // nameAsPan : new FormControl('',[Validators.required]),
      // panCardNumber : new FormControl('',[Validators.required]),
      // ifscCode : new FormControl('',[Validators.required]),
      // emailId : new FormControl(''),
      // uploadPAN : new FormControl('',[Validators.required]),
      // uploadCheque : new FormControl('',[Validators.required])
    })

    this.eventInitiation7 = new FormGroup({
      invitee : new FormControl('',[Validators.required]),
      expense : new FormControl('',[Validators.required]),
      expenseAmount : new FormControl(0,),
      isLocalConveyance : new FormControl('No',),
      isAdvanceRequired : new FormControl('No',Validators.required),
      isExcludingTax : new FormControl('',[Validators.required]),
      uploadExpenseDeviation : new FormControl('',[Validators.required]),
      isBtc : new FormControl('',[Validators.required]),
      toCalculateExpense : new FormControl('No',[Validators.required]),
      finalAmount : new FormControl('',[Validators.required]),
      btcTotalAmount : new FormControl('',[Validators.required]),
      bteTotalAmount : new FormControl('',[Validators.required]),
      uploadAgenda : new FormControl('',[Validators.required]),
      uploadInvitation : new FormControl('',[Validators.required])
    }) */
  }

  ngOnInit(): void {

   
    this.event1FormPrepopulate();
    this.event2FormPrepopulate();
    this.event3FormPrepopulate();
    this.event4FormPrepopulate();
    this.event4FormSpeakerPrepopulate();
    this.event4FormTrainerPrepopulate();
    this.event4FormOtherPrepopulate();
    this.eventInitiatio4HonarariumPrepopulate()
    this.event4FormSubPrepopulate();
    this.inviteeSelectionFormPrePopulate();
    this.expenseSelectionFormPrePopulate();
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
    })
   
    
  }

  // Filter Events within 30 days
  eventsWithin30Days: any[] =[] ;
  filterEventsWithIn30Days(eventList:any){
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
  eventType : string = 'EVTC1'
  eventDate : string ;

  event2FormPrepopulate(){
    this.eventInitiation2.valueChanges.subscribe(changes => {
      if(changes.startTime){
        // console.log(changes.startTime)
        Class1EventRequestComponent.startTime = changes.startTime;
      }
      if(changes.state){
        this.filteredCity = this._filterCity(changes.state)
      }
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
      return this.approvedSpeakers.filter(emp => emp.SpeakerName.toLowerCase().includes(value.toLowerCase()));
    }
  }

  private _getFilteredSpeaker(misCode : string){
    if(Boolean(misCode)){
      return this.approvedSpeakers.find(speaker => speaker.MISCode.toLowerCase() == misCode.toLowerCase())
    }
  }

  private _getFilteredSpeakerByName(name : string){
    if(Boolean(name)){
      let speakers : any[] = [];

      this.approvedSpeakers.forEach(speaker => {
        if(speaker.SpeakerName.toLowerCase() == name.toLowerCase()){
          speakers.push(speaker);
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
              this.otherSpeciality = filteredOther.Speciality
              this.otherGoNonGo = filteredOther['GO/Non-GO'];
              this.otherMisCode = changes.otherMisCode

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
      return this.inviteesFromHCPMaster.find(invitee => invitee.MISCode.toLowerCase() == misCode.toLowerCase())
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
      return this.approvedTrainers.find(trainer => trainer.MISCode.toLowerCase() == misCode.toLowerCase())
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
        Rationale : (this.isHonararium && this.showRationale)? this.eventInitiatio4Honararium.value.rationale : 0+'',
        PresentationDuration : honarariumDuration.presentationDuration+'' ,
        PanelSessionPreperationDuration :  honarariumDuration.panelSessionPreparation+'',
        PanelDisscussionDuration : honarariumDuration.panelDiscussionDuration+'',
        QaSessionDuration : honarariumDuration.qaSession+'',
        BriefingSession : honarariumDuration.briefingDuration+'',
        TotalSessionHours : (Boolean(this.totalHours))? this.totalHours+'' : 0+'',


        // For Table
        HcpRole : (!this.showOtherHCPRoleTextBox)? this.hcpRoles.find(role => { if(this.eventInitiation4.value.hcpRole == role.HCPRoleID) return role }).HCPRole : this.hcpRoleWritten,
        HcpName : hcpname,
        MisCode : hcpMisCode,
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


      console.log(HcpData)
      this.hcpTableDetails.push(HcpData);
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
  hideUploadFile : boolean = false;
  sideKitBrand(id:number){
    // console.log(id)
    console.log(document.getElementsByClassName('.brand-dropdown')[id])
    
   
    this.hideUploadFile = true;
  }
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
      return this.inviteesFromHCPMaster.filter(invitee => invitee['HCPName'].toLowerCase().includes(name.toLowerCase()));
    }
    // return this.inviteesFromHCPMaster.find(invitee => invitee['HCP Name'].includes(name))
  }
  
  getFilteredInvitee(misCode:string){
    console.log('mis',Boolean(misCode))
    if(Boolean(misCode)){
      return this.inviteesFromHCPMaster.find(invitee => invitee['MISCode'].toLowerCase() == misCode.toLowerCase());
    }
   
  }

  getHCPMasterInviteeWithName(name : string){
    if(Boolean(name)){
      const invitees : any[] = [];
    
      this.inviteesFromHCPMaster.forEach(invitee => {
        if(invitee['HCPName'].toLowerCase() === name.toLowerCase()) invitees.push(invitee)
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
    if(inviteeValidity == 0){
      const inviteeData = {
        EventIdOrEventRequestId : ' ',
        MisCode : this.filteredInviteeMisCode,
        InviteeName : this.inviteeSelectionForm.value.inviteeName,
        LocalConveyance :  this.inviteeSelectionForm.value.isInviteeLocalConveyance,
        BtcorBte : (this.inviteeSelectionForm.value.inviteeBTC)? this.inviteeSelectionForm.value.inviteeBTC : 'NIL',
        LcAmount : (this.showInviteeLocalConveyance)?this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount+'':0+'',
      }
      this.inviteeTableDetails.push(inviteeData)
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
      const expense = {
        expenseType : this.expenseSelectionForm.value.expenseType,
        expenseAmount : this.expenseSelectionForm.value.expenseAmount,
        isExcludingTax : this.expenseSelectionForm.value.isExcludingTax,
        isExpenseBtc : this.expenseSelectionForm.value.isExpenseBtc
      }
      this.expenseTableDetails.push(expense);
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
  }

  // Submitting Form
  submitForm(){

    let class1EventData = {
      EventTopic : this.eventInitiation2.value.eventTopic,
      EventType : this.eventDetails.find(event => event.EventTypeId == this.eventCode ).EventType,
      EventDate : new Date(this.eventInitiation1.value.eventDate),
      StartTime : this.eventInitiation2.value.startTime,
      EndTime : this.eventInitiation2.value.endTime,
      VenueName : this.eventInitiation2.value.venueName,
      State : this.allStates.find(state => state.StateId == this.eventInitiation2.value.state).StateName,
      City : this.allCity.find(city => city.CityId == this.eventInitiation2.value.city).CityName,
      BrandName : " ",
      PercentAllocation : " ",
      ProjectId: " ",
      HcpRole : " ",
      IsAdvanceRequired: " "
    }
    const class1 = {
      Class1 : class1EventData,
      // ExpenseDetails : this.expenseTableDetails
      RequestBrandsList : this.brandTableDetails,
      EventRequestHcpRole : this.hcpTableDetails,
      EventRequestInvitees : this.inviteeTableDetails,
      EventRequestHCPSlideKits : [
        {
          EventId : " ",
          Mis: " ",
          SlideKitType : " ",
          SlideKitDocument : " "
        }
      ]
    }

    console.log(class1)
    this.utilityService.postClass1PreEventRequest(class1).subscribe(res => {
      console.log(res)
    },
    err => console.log(err))
    // console.log(this.brandTableDetails)
  }

/*
  // Event Inititaion Form7 COntrol
  showExpenseTextBox : boolean = false;
  showTotalExpense : boolean = false;

  expenseTableDetails : any;
  localConveyanceNeeded : boolean = false;

  event7FormPrepopulate(){
    this.eventInitiation7.valueChanges.subscribe(
      changes => {
      
        if(changes.expense == 'e2'){
          this.showExpenseTextBox = true;
        }
        else{
          this.showExpenseTextBox = false;
        }
        if(changes.toCalculateExpense == 'Yes'){
          this.showTotalExpense = true;
        }
        else{
          this.showTotalExpense = false;
        }
        if(changes.isLocalConveyance == 'Yes'){
          this.localConveyanceNeeded = true;
        }
        else this.localConveyanceNeeded = false;

        if(changes.invitee && changes.expense && changes.isAdvanceRequired && changes.isExcludingTax && changes.isBtc){
          console.log(changes)
        }
      }
    )
  }

  addInviteesToTable(){
    const invitee = {
      invitee : 'aa'
    };

  }  
  
  


  submitForm(){
    // console.log(this.eventInitiation1.value);
    // console.log(this.eventInitiation2.value);
    // console.log(this.eventInitiation3.value);
    // console.log(this.eventInitiation4.value);
    // console.log(this.eventInitiation5.value);
    // console.log(this.eventInitiation6.value);
    // console.log(this.eventInitiation7.value);

    if(this.eventInitiation2.value.eventTopic &&  this.eventCode && this.eventInitiation2.value.eventDate &&
      this.eventInitiation2.value.startTime && this.eventInitiation2.value.endTime  && this.eventInitiation2.value.venueName &&
      this.eventInitiation2.value.state && this.eventInitiation2.value.city && this.eventInitiation7.value.isAdvanceRequired &&
      this.eventInitiation3.value.brandName && this.eventInitiation4.value.hcpRole && this.percentageAllocation &&  this.projectId){
        const class1FinalData1 = {
          EventTopic : this.eventInitiation2.value.eventTopic,
          EventType : this.eventDetails.find(event => event.EventTypeId == this.eventCode ).EventType,
          EventDate : new Date(this.eventInitiation2.value.eventDate),
          StartTime : this.eventInitiation2.value.startTime,
          EndTime : this.eventInitiation2.value.endTime,
          VenueName : this.eventInitiation2.value.venueName,
          State : this.allStates.find(state => state.StateId == this.eventInitiation2.value.state).StateName,
          City : this.allCity.find(city => city.CityId == this.eventInitiation2.value.city).CityName,
          // BeneficiaryName : this.benificiaryName,
          // BankAccountNumber : this.eventInitiation6.value.bankAccountNumber,
          // PanName : this.nameAsPan,
          // PanCardNumber : this.panCardNumber,
          // IfscCode : this.ifscCode,
          // EmailId : this.emailId,
          // Invitees : this.eventInitiation7.value.invitee,
          IsAdvanceRequired : this.eventInitiation7.value.isAdvanceRequired || 'No',
          // SelectionOfTaxes : this.taxSelect,
          BrandName : this._getBrandWithId(this.eventInitiation3.value.brandName).BrandName,
          HCPRole :   (this.eventInitiation4.value.hcpRole !== 'H6')? this.hcpRoles.find(role =>  role.HCPRoleID === this.eventInitiation4.value.hcpRole).HCPRole : this.hcpRoleWritten, 
          // InitiatorName : this.auth.decodeToken()['unique_name'],
          PercentAllocation : this.percentageAllocation.toString(),
          ProjectId : this.projectId,
        }
        console.log(class1FinalData1)
        this.utilityService.postEvent1Data1(class1FinalData1).subscribe(
          res => {
            console.log("Data added successfully");
            alert('Event Submitted Successfully');
            this.router.navigate(['dashboard']);
            
          },
          err => alert("Not Added")
        )

      }
      else{
        alert("Some Fields are missing")
      }
    

    const class1FinalData2 = {
      HcpRoleId : this.eventInitiation4.value.hcpRole,
      MISCode : this.eventInitiation4.value.misCode,
      SpeakerCode : this.speakerCode,
      TrainerCode : "null",
      HonarariumRequired : this.eventInitiation6.value.isHonararium,
      Speciality : this.speciality,
      Tier : this.tier,
      'Go/NGo' : this.goNonGo,
      PresentationDuration : this.eventInitiation5.value.presentationDuration+"",
      PanelSessionPresentationDuration : this.eventInitiation5.value.panelSessionPreparation+"",
      PanelDiscussionDuration : this.eventInitiation5.value.panelDiscussionDuration+"",
      QASessionDuration : this.eventInitiation5.value.qaSession+"",
      BriefingSession : this.eventInitiation5.value.briefingDuration+"",
      TotalSessiionHours : this.totalHours+"",
      Rationale :this.eventInitiation6.value.rationale

    }
    // console.log(class1FinalData2)
  }

  */

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
    formData.append('File 1', this.selectedFile);
    console.log(formData.get('File 1'))
   
  }



  stepControl1 = new FormGroup({
    step1 : new FormControl('',Step1Validator)
  })
  

  //Min Date
  today:string = new Date().toISOString().split('T')[0];
}




function endTimeValidator(control : AbstractControl): ValidationErrors | null{
  
  console.log(Class1EventRequestComponent.startTime)
  if(Class1EventRequestComponent.startTime < control.value){
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
  console.log(Class1EventRequestComponent.upload1)
  console.log(Class1EventRequestComponent.withIn30Days)
  if(Class1EventRequestComponent.withIn30Days){
    if(Class1EventRequestComponent.upload1){
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
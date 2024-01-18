import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilityService } from 'src/app/services/utility.service';

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

  constructor(private utilityService : UtilityService, private auth : AuthService, private router : Router) {
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
      isTravelRequired : new FormControl(''),
      isLocalConveyance : new FormControl(''),
      isHonararium : new FormControl(''),
      isAccomRequired : new FormControl(''),
      localConveyanceAmount : new FormControl(''),
    })

    this.eventInitiatio4Honararium = new FormGroup({
      presentationDuration : new FormControl(0,[Validators.required]),
      panelSessionPreparation : new FormControl(0,[Validators.required]),
      qaSession : new FormControl(0,[Validators.required]),
      honorariumAmount : new FormControl(0,),
      briefingDuration : new FormControl(0,[Validators.required]),
      panelDiscussionDuration : new FormControl(0,[Validators.required]),

      isHonararium : new FormControl('No',[Validators.required]),
      currency : new FormControl('',),
      uploadNOC : new FormControl('',),
      rationale : new FormControl('',),
      bankAccountNumber : new FormControl('',),
      benificiaryName : new FormControl(''),
     
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
      travelAmount : new FormControl(''),
      travelBTC : new FormControl('')
    })

    this.eventInitiation4Accomodation = new FormGroup({
      accomBTC : new FormControl(''),
      accomAmount : new FormControl('')
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
      inviteesFrom : new FormControl(''),
      inviteeName : new FormControl(''),
      inviteeMisCode : new FormControl(''),
      isInviteeLocalConveyance : new FormControl('No'),
      inviteeLocalConveyanceAmount : new FormControl(''),
      inviteeBTC : new FormControl('') 
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
    this.eventInitiatio4HonarariumPrepopulate()
    this.event4FormSubPrepopulate();
    this.inviteeSelectionFormPrePopulate();
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
  eventType : string = 'EVT1'
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
      const brand = {
        BrandName : this.brandNames.find(brand => brand.BrandId == this.eventInitiation3.value.brandName).BrandName,
        PercentAllocation : this.percentageAllocation+"",
        ProjectId : this.projectId
      }
      this.brandTableDetails.push(brand);
      this.showBrandTable = true;
      this.eventInitiation3.reset();
      this.percentageAllocation = 0;
      this.projectId = '';
      this.eventCode = this.eventType;

    }
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

  sendBrandDetails(){
    console.log(this.brandTableDetails)
    this.utilityService.postBrandNames(this.brandTableDetails).subscribe(
      res => {
        console.log(res)
      },
      err => {
        alert("Brands not added")
      }
    )
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

  event4FormSpeakerPrepopulate(){
    this.eventInitiation4Speaker.valueChanges.subscribe(
      changes => {
        if(changes.speakerName !== ''){
          // console.log(this._filter(changes.misCode))
          this.filteredspeakers = this._filter(changes.speakerName);
  
          if(this.eventInitiation4Speaker.controls.speakerName.valid){
            // console.log("MIS Valli")
            // console.log(this._getFilteredSpeaker(changes.misCode))
            const filteredSpeaker = this._getFilteredSpeaker(changes.speakerName);
            // console.log('Check1',filteredSpeaker)
            // console.log()
            this.filteredSpeakerLength = filteredSpeaker.length;
            // console.log(filteredSpeaker)
            
            if(filteredSpeaker && filteredSpeaker.length == 1 ){
              // console.log('Check2')
              this.speakerName  = filteredSpeaker[0].SpeakerName;
              this.speakerCode = filteredSpeaker[0].SpeakerCode;
              this.speakerSpeciality = filteredSpeaker[0].Speciality;
              this.speakerGoNonGo = (filteredSpeaker[0].isNonGO == "yes")? 'Non GO' : 'GO';
              this.speakerTier = filteredSpeaker[0].TierType;  
              this.speakerMisCode = filteredSpeaker[0].MISCode;
              
            }
            else if (this.filteredSpeakerLength && this.filteredSpeakerLength > 1){
              // console.log('Check3')
              this.speakersWithSameName = filteredSpeaker;
              this.filteredSpeakerLength = filteredSpeaker.length;
              this.fillSpeakerByMISCode();
            }
            else{
              this.speakerName  = "";
              this.speakerCode = "";
              this.speakerSpeciality = "";
              this.speakerGoNonGo = "";
              this.speakerTier = "";
            }
           
            if(this.speakerGoNonGo == "GO"){
              // this.showUploadNOC = true;
              // this.showRationale = true;
            }
            else{
              // this.showUploadNOC = false;
              // this.showRationale = false;
            }
          }
        }
      }
    )
  }

  fillSpeakerByMISCode(){
    this.eventInitiation4Speaker.valueChanges.subscribe(
      changes => {
        let filteredSpeaker: any = [];
        if(changes.speakerMisCode){
          // console.log(changes.speakerMisCode)
          filteredSpeaker.push(this.speakersWithSameName.find(
            speaker => speaker.MISCode == changes.speakerMisCode
          ))
        }

        this.filteredSpeakerLength = filteredSpeaker.length;
        // console.log(this.filteredSpeakerLength)
        if(this.filteredSpeakerLength && this.filteredSpeakerLength == 1 ){
          this.speakerName  = filteredSpeaker[0].SpeakerName;
          this.speakerCode = filteredSpeaker[0].SpeakerCode;
          this.speakerSpeciality = filteredSpeaker[0].Speciality;
          this.speakerGoNonGo = (filteredSpeaker[0].isNonGO == "yes")? 'Non GO' : 'GO';
          this.speakerTier = filteredSpeaker[0].TierType;  
          this.speakerMisCode = filteredSpeaker[0].MISCode;
        }
      }
    )
  }

  otherSpeciality : string = '';
  otherTier : string = '';
  otherGoNonGo : string = '';


  event4FormOtherPrepopulate(){

  }

  trainerCode : string = '';
  trainerSpeciality : string = '';
  trainerTier : string = '';
  trainerGoNonGo : string = '';

  event4FormTrainerPrepopulate(){

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

  private _filter(value: string): string[] {
    // console.log(this.employeeDetails)
    const filterValue = value.toLowerCase();
    return this.approvedSpeakers.filter(emp => emp.SpeakerName.toLowerCase().includes(filterValue));
  }

  private _getFilteredSpeaker(speakerName){
    const filteredSpeaker : any = [];

    this.approvedSpeakers.forEach(speaker => {
      if(speaker.SpeakerName === speakerName){
        filteredSpeaker.push(speaker);
      }
    })

    return filteredSpeaker;

  }

  hcpTableDetails : any[] = [];

  addHCPTable(){
   
    const HcpData  = {
      hcpRole : this.eventInitiation4.value.hcpRole,
      hcpName : this.speakerName,
      misCode : this.speakerMisCode,
      goNonGo : this.speakerGoNonGo,
      honararium : this.eventInitiation4Sub.value.isHonararium,
      honarariumAmount : this.eventInitiatio4Honararium.value.honorariumAmount,
      travelAmount : this.eventInitiation4Travel.value.travelAmount,
      localConveyanceAmount : this.eventInitiation4Sub.value.localConveyanceAmount,
      accomAmount : this.eventInitiation4Accomodation.value.accomAmount,
      finalAmount : parseInt(this.eventInitiatio4Honararium.value.honorariumAmount)+ parseInt(this.eventInitiation4Travel.value.travelAmount)+
                  parseInt( this.eventInitiation4Sub.value.localConveyanceAmount)+parseInt(this.eventInitiation4Accomodation.value.accomAmount)
    }
    console.log(HcpData)
    this.hcpTableDetails.push(HcpData);
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
  showRationale :boolean = false;
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
        if(changes.inviteesFrom == 'hcpMaster'){
          // console.log(this.inviteesFromHCPMaster)
        }
        // console.log(this.inviteeSelectionForm.controls.inviteesFrom)
        if(changes.inviteeName !=''){
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
         
        }
      }
    )
  }

  filterHCPMasterInvitees(name : string){
    return this.inviteesFromHCPMaster.filter(invitee => invitee['HCPName'].toLowerCase().includes(name.toLocaleLowerCase()));
    // return this.inviteesFromHCPMaster.find(invitee => invitee['HCP Name'].includes(name))
  }

  getHCPMasterInviteeWithName(name : string){
    const invitees : any[] = [];
    
      this.inviteesFromHCPMaster.forEach(invitee => {
        if(invitee['HCPName'].toLowerCase() === name.toLowerCase()) invitees.push(invitee)
      }
    )
    return invitees;
  }

  inviteeTableDetails : any[] = [];
  addToInviteeTable(){
    console.log(this.inviteeSelectionForm.value)
    const inviteeData = {
      inviteeName : this.inviteeSelectionForm.value.inviteeName,
      localConveyance : this.inviteeSelectionForm.value.isInviteeLocalConveyance,
      btc : (this.inviteeSelectionForm.value.inviteeBTC)? this.inviteeSelectionForm.value.inviteeBTC : 'NIL',
      localConveyanceAmount : (this.inviteeSelectionForm.value.isInviteeLocalConveyance=='Yes')? this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount : 0,
    }
    this.inviteeTableDetails.push(inviteeData)
    console.log(this.inviteeSelectionForm.controls)
    this.inviteeSelectionForm.reset();
    console.log(this.inviteeSelectionForm.controls)
    this.hideInviteeMisCode = true;
    this.filteredInviteeMisCode = '';
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
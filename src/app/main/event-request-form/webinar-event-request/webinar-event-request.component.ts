import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';

@Component({
  selector: 'app-webinar-event-request',
  templateUrl: './webinar-event-request.component.html',
  styleUrls: ['./webinar-event-request.component.css']
})



export class WebinarEventRequestComponent implements OnInit {
  // Spinner
  loadingIndicator: boolean = false;


  eventInitiation1: FormGroup;
  eventInitiation2: FormGroup;
  eventInitiation3: FormGroup;
  eventInitiation4: FormGroup;
  eventInitiation4Sub: FormGroup;
  eventInitiatio4Honararium: FormGroup;
  eventInitiation4Speaker: FormGroup;
  eventInitiation4Other: FormGroup;
  eventInitiation4Trainer: FormGroup;
  panalselectionstandard: FormGroup;
  eventInitiation4Travel: FormGroup;
  eventInitiation4Accomodation: FormGroup;

  inviteeSelectionForm: FormGroup;
  expenseSelectionForm: FormGroup;
  eventInitiation5: FormGroup;
  eventInitiation6: FormGroup;
  eventInitiation7: FormGroup;

  // Data From sheet:
  previousEvent: any;
  eventDetails: any;
  hcpRoles: any
  vendorDetails: any;
  expenseType: any[] = [];


  // time adding purpose added by karthick 
  changestartTime: string;
  changeendTime: string;

  // Upload Deviationn
  show30DaysUploaDeviation: boolean = false
  show7DaysUploadDeviation: boolean = false


  // For Stepper Validation
  isLinear: boolean = true;
  orientation: string;
  pageLoaded: boolean = false
  minDate: string;
  maxDate: string;

  private FcpaToday = new Date();
  private lastFcpaDate = new Date(this.FcpaToday.getFullYear() - 1, this.FcpaToday.getMonth(), this.FcpaToday.getDate());
  private futureFcpaDate = new Date(this.FcpaToday.getFullYear() + 1, this.FcpaToday.getMonth(), this.FcpaToday.getDate());

  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT
  public page: number = 1

  showinvitees = false;

  // Summary Table
  BTCSummaryTable: any[] = [];
  BTESummaryTable: any[] = [];

  showexpensetax: boolean = false;

  private _userDetails: any;
  

  constructor(private utilityService: UtilityService,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBarService: SnackBarService,
    private _authService: AuthService) {



  }

  ngOnInit(): void {
    this._generateMinutes();

    this._authService.getUserDetails$.subscribe(res => this._userDetails = res)
    // Getting Panelist data from shared component
    this._getPanelData();

    // Getting Invitees data from shared component
    this._getInviteeData();

    this.isMobileMenu();
    this.minDate = this.lastFcpaDate.toISOString().split('T')[0];
    this.maxDate = this.FcpaToday.toISOString().split('T')[0];

    this.loadingIndicator = true;
    this.utilityService.getEventListFromProcess().subscribe(res => {
      this.loadingIndicator = false;
      this._filterEventsWithIn30Days(res);
    })


    // Getting event types
    this.utilityService.getEventTypes().subscribe(
      res => {
        this.eventDetails = res;
      },
      err => {
        // alert('Unexpected error Happened')
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }
    )

    // Getting HCP Roles
    this.utilityService.getHcpRoles().subscribe(
      res => {
        this.hcpRoles = res;
        console.log(this.hcpRoles)
      },
      err => {
        // alert("Unexpected Error Happened")
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }

    )

    // Getting BrandNames
    this.utilityService.getBrandNames().subscribe(
      res => {
        this.brandNames = res;
        this._filterBrandDetailsForClass1();
      },
      err => {
        // alert("Unexpected Error Happened")
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }
    )

    // Getting Approved Speakers
    this.utilityService.getApprovedSpeakers().subscribe(
      res => {
        // console.log(res)
        this.approvedSpeakers = res;
        // console.log(this.approvedSpeakers.length);
        // console.log('ApprSe',this.approvedSpeakers)
      }
    )

    // Get Approved Trainers
    this.utilityService.getApprovedTrainers().subscribe(
      res => this.approvedTrainers = res
    )



    // Get Vendor Details
    this.utilityService.getVendorDetails().subscribe(
      res => this.vendorDetails = res
    )

    // Get Invitees From HCP Master 
    this.utilityService.getEmployeesFromHCPMaster().subscribe(
      res => {
        this.inviteesFromHCPMaster = res;
        console.log('Before SPlice', this.inviteesFromHCPMaster.length);
        this.inviteesFromHCPMaster.splice(1000,);
        console.log('After SPlice', this.inviteesFromHCPMaster.length);
        console.log(this.inviteesFromHCPMaster)

      }

    )

    // Get Slidekit Details
    this.utilityService.getSlideKitDetails().subscribe(
      res => {
        if (Boolean(res)) this.slideKitDetails = res;
      }
    )
    // // Get Expense Types
    // this.utilityService.getExpenseType().subscribe(res=>{
    //   console.log('expenses type ',res)
    //   res.forEach(expenseTypes => {
    //     let supportArr = expenseTypes['Event Type'].split(',');
    //     // "Class I, Webinar, Medical Utility, Stall Fabrication, HCP Consultants, Class II, Class III, Demo Meetings, Hands on Training Workshops, Class IV"
    //     if(supportArr.indexOf('Webinar')> -1){
    //       this.expenseType.push(expenseTypes)
    //     }
    //   })
    //   console.log('after changes',this.expenseType)

    // })
    // Get Expense Types
this.utilityService.getExpenseType().subscribe(res => {
  console.log('expenses type ', res);
  
  this.expenseType = res.filter(expense => {
    const eventTypes = expense['Event Type'].split(',').map(type => type.trim());
    return eventTypes.includes('Webinar');
  });
  
  console.log('after changes', this.expenseType);
});

    // Step 1 Form Controls
    this.eventInitiation1 = new FormGroup({
      withIn30DaysDeviation: new FormControl(''),
      eventDate: new FormControl('', Validators.required),
      next7DaysDeviation: new FormControl('')
    })

    this.eventInitiation2 = new FormGroup({

      eventTopic: new FormControl('', [Validators.required]),
      startHours: new FormControl('', [Validators.required]),
      startMinutes: new FormControl('', Validators.required),
      startAMPM: new FormControl('', [Validators.required]),
      endHours: new FormControl('', [Validators.required]),
      endMinutes: new FormControl('', Validators.required),
      endAMPM: new FormControl('', [Validators.required]),
      // For Webinar
      meetingType: new FormControl('', Validators.required),
      vendorName: new FormControl(''),
      vendorFileUpload: new FormControl('')

    })

    this.eventInitiation3 = new FormGroup({
      brandName: new FormControl('', [Validators.required]),
      percentageAllocation: new FormControl('', [Validators.required]),
      // projectId : new FormControl('', [Validators.required]),
      // eventCode : new FormControl('',[Validators.required])
    })

    this.eventInitiation4 = new FormGroup({
      hcpRole: new FormControl('', [Validators.required]),
      // New Columns

    })

    this.eventInitiation4Sub = new FormGroup({
      uploadFCPA: new FormControl(),
      fcpaDate: new FormControl('',),

      isTravelRequired: new FormControl('No', Validators.required),
      isLocalConveyance: new FormControl('No', Validators.required),
      isHonararium: new FormControl('No', Validators.required),
      isAccomRequired: new FormControl('No', Validators.required),
      localConveyanceAmount: new FormControl(0,),
      isLocalConveyBTC: new FormControl('',),

      uploadNOC: new FormControl(),
      rationale: new FormControl('',),
    })

    this.eventInitiatio4Honararium = new FormGroup({
      presentationDuration: new FormControl(0, [Validators.required]),
      panelSessionPreparation: new FormControl(0, [Validators.required]),
      qaSession: new FormControl(0, [Validators.required]),
      honorariumAmount: new FormControl(0,),
      briefingDuration: new FormControl(0, [Validators.required]),
      panelDiscussionDuration: new FormControl(0, [Validators.required]),

      // isHonararium : new FormControl('No',[Validators.required]),
      currency: new FormControl('', Validators.required),
      taxSelection: new FormControl('', Validators.required),

      bankAccountNumber: new FormControl('',),
      benificiaryName: new FormControl('', Validators.required),

      uploadPAN: new FormControl('',),
      uploadCheque: new FormControl('',),


    })

    this.eventInitiation4Speaker = new FormGroup({
      speakerName: new FormControl('', [Validators.required]),
      speakerMisCode: new FormControl('',),
    })

    this.eventInitiation4Other = new FormGroup({
      otherName: new FormControl('', Validators.required),
      otherMisCode: new FormControl('',),
    })

    this.eventInitiation4Trainer = new FormGroup({
      trainerName: new FormControl('', Validators.required),
      trainerMisCode: new FormControl('', Validators.required)
    })

    this.eventInitiation4Travel = new FormGroup({
      travelType: new FormControl(''),
      travelAmount: new FormControl(0),
      travelBTC: new FormControl(''),
      // uploadPANForTravel: new FormControl('',),
      // uploadChequeForTravel: new FormControl('',)
    })

    this.eventInitiation4Accomodation = new FormGroup({
      accomBTC: new FormControl(''),
      accomAmount: new FormControl(0)
    })


    this.inviteeSelectionForm = new FormGroup({
      inviteesFrom: new FormControl('', Validators.required),
      inviteeName: new FormControl('',),
      inviteeMisCode: new FormControl(''),
      isInviteeLocalConveyance: new FormControl('No', Validators.required),
      inviteeLocalConveyanceAmount: new FormControl(0),
      inviteeBTC: new FormControl(''),
      uploadAgenda: new FormControl(''),
      uploadInvitation: new FormControl(''),
      InviteeName:new FormControl(''),
      inviteedFrom: new FormControl(''),
      Speciality: new FormControl(''),
      HCPType : new FormControl('')
    })

    this.expenseSelectionForm = new FormGroup({
      expenseType: new FormControl('', Validators.required),
      expenseAmount: new FormControl('', Validators.required),
      isExcludingTax: new FormControl(''),
      isExpenseBtc: new FormControl(''),
      uploadExpenseDeviation: new FormControl(''),
      // isAdvanceRequired : new FormControl('',Validators.required),

      localBTC: new FormControl('',),
      localAmountWithoutTax: new FormControl(0),
      localAmountWithTax: new FormControl(0)
    })



    this._event1FormPrepopulate();
    this._event2FormPrepopulate();
    this._event3FormPrepopulate();
    this._event4FormPrepopulate();
    this._event4FormSpeakerPrepopulate();
    this._event4FormTrainerPrepopulate();
    this._event4FormOtherPrepopulate();
    this._eventInitiatio4HonarariumPrepopulate();

    this._event4FormSubPrepopulate();
    this._inviteeSelectionFormPrePopulate();
    this._expenseSelectionFormPrePopulate();
    this._aggregateSpendForAccom();
    this._aggregateSpendForLC();
    this._aggregateSpendForTravel();

     this.expenseTaxFormPrePopulate()


    // Getting allowed file types
    this._allowedTypes = Config.FILE.ALLOWED;

    // Generating Allowed types for HTML
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', '
    })

    
  }

  public minutes: any[] = [];
  private _generateMinutes(){
     for(let i=0;i<60;i++){
      if(i < 10){
        this.minutes.push({minute: '0'+i});
      }
      else{
        this.minutes.push({minute: i});
      }
    }
  }

  // Step1 Functionalities
  static upload1: any;
  static withIn30Days: boolean;

  private _event1FormPrepopulate() {
    this.eventInitiation1.valueChanges.subscribe(changes => {
      if (changes.eventDate) {
        let today: any = new Date();
        let eventDate = new Date(changes.eventDate);

        let Difference_In_Time = eventDate.getTime() - today.getTime();

        let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

        this.eventDate = changes.eventDate

        if (Difference_In_Days < 5 ) {
          this.show7DaysUploadDeviation = true;
        }
        else {
          this.show7DaysUploadDeviation = false;
        }

      }

      let step1Validity = 0;

      if (!this.eventInitiation1.valid) {
        step1Validity++;
      }
      if (this.show7DaysUploadDeviation && !Boolean(this.eventInitiation1.value.next7DaysDeviation)) {
        step1Validity++;
      }
      if (this.show30DaysUploaDeviation && !Boolean(this.eventInitiation1.value.withIn30DaysDeviation)) {
        step1Validity++;
      }

      if (step1Validity == 0) {
        this.isStep1Valid = true;
      }
      else {
        this.isStep1Valid = false;
      }
    })
  }

  public pageChanged(thisPage) {
    this.page = thisPage
  }

  // Filter Events within 30 days
  eventsWithin30Days: any[] = [];
  private _filterEventsWithIn30Days(eventList: any) {
    if (Boolean(eventList) && eventList.length > 0) {
      let row = 1
      eventList.forEach(event => {
        let today: any = new Date();
        // console.log(event.EventDate)
        if(event['Initiator Email'] == this._userDetails.email ){
          if (event.EventDate) {
            let eventDate: any = new Date(event.EventDate);
            if (eventDate > today) {
  
              let Difference_In_Time = eventDate.getTime() - today.getTime();
  
              // To calculate the no. of days between two dates
              let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  
              if (Difference_In_Days <= 45) {
                event.row = row++
                this.eventsWithin30Days.push(event)
              }
            }
            // console.log(new Date(event.EventDate))
  
            // console.log(event.EventDate)
          }
        }
        this.eventsWithin30Days.sort((list1,list2)=>{
          return list2['EventId/EventRequestId'].localeCompare(list1['EventId/EventRequestId']);
        })
      })
    }

    // this.pageLoaded = true
    if (this.eventsWithin30Days.length > 0) {
      this.show30DaysUploaDeviation = true;
    }
    console.log(this.eventsWithin30Days)


  }


  // Step2 Functionalities
  filteredCity: any;

  // New Values
  eventType: string = 'EVTWEB'
  eventDate: string;

  showVendorFields: boolean = false;

  private _event2FormPrepopulate() {
    this.eventInitiation2.valueChanges.subscribe(changes => {

      let startTime: string;
      let endTime: string;
      let isEndTimeValid;

      if (Boolean(this.eventDate) && Boolean(changes.startHours) && Boolean(changes.startMinutes) && Boolean(changes.startAMPM)) {
        startTime = changes.startHours + ':' + changes.startMinutes + ' ' + changes.startAMPM;

      }
      if (Boolean(this.eventDate) && Boolean(startTime) && Boolean(changes.endHours) && Boolean(changes.endMinutes) && Boolean(changes.endAMPM)) {
        endTime = changes.endHours + ':' + changes.endMinutes + ' ' + changes.endAMPM;
        isEndTimeValid = this._validateTime(startTime, endTime)
      }

      if (changes.meetingType == 'Vendor') {
        this.showVendorFields = true;
      }
      else {
        this.showVendorFields = false;
      }


      // Step2 Next Button Validation
      let step2Validity = 0;
      console.log(Boolean(this.eventInitiation2.value.vendorName));
      console.log(Boolean(this.eventInitiation2.value.vendorFileUpload))
      console.log(this.eventInitiation2.value)
      if (this.showVendorFields && (!Boolean(this.eventInitiation2.value.vendorName) || !Boolean(this.eventInitiation2.value.vendorFileUpload))) {
        step2Validity++;
      }
      if (this.eventInitiation2.invalid) {
        step2Validity++;
      }
      if (!isEndTimeValid) {
        step2Validity++;
      }

      this.isStep2Valid = (step2Validity == 0) ? true : false;
    })

  }

  // Start Time End Time Validation
  showEndTimeError: boolean = false;
  private _validateTime(start: string, end: string) {
    let startingTime = new Date(`${this.eventDate} ${start}`);
    let endingTime = new Date(`${this.eventDate} ${end}`);

    if (startingTime >= endingTime) {
      console.log("invalid");
      this.showEndTimeError = true;
      return false;
    }
    else {
      this.showEndTimeError = false;
      return true;
    }


  }



  // Step3 Control

  // Adding value to Brand Tables
  showBrandTable: boolean = false;
  brandTableDetails: any[] = [];

  brandNames: any;

  // New Values:
  percentageAllocation: number = 0;
  projectId: string = '';
  eventCode: string = this.eventType;

  totalPercent: number = 0;


  private _filterBrandDetailsForClass1() {
    this.brandNames = this.brandNames.filter(brand => {
      const name = brand.Name.split("_")
      return name[1] == 'Webinar';
    })
  }
  // Array to store filtered brands
  deletedBrand: any[] = [];
  addToBrandTable() {

    if (this.eventInitiation3.valid) {
      this.totalPercent=this.getTotalPercent();
      this.totalPercent = +this.totalPercent + +this.percentageAllocation;

      if (this.totalPercent <= 100) {
        const brand = {
          BrandName: this.brandNames.find(brand => brand.BrandId == this.eventInitiation3.value.brandName).BrandName,
          PercentAllocation: this.percentageAllocation + "",
          ProjectId: this.projectId
        }

        this.brandTableDetails.push(brand);
        this.isStep3Valid = (this.totalPercent == 100) ? true : false;
        this.showBrandTable = true;
        this.eventInitiation3.reset();
        this.percentageAllocation = 0;
        this.projectId = '';
        this.eventCode = this.eventType;

        let index: number = -1;
        for (let i = 0; i < this.brandNames.length; i++) {
          if (this.brandNames[i].BrandName == brand.BrandName) {
            index = i;
          }
        }
        this.deletedBrand.push(this.brandNames[index]);
        this.brandNames.splice(index, 1);

        this.slideKitBrandMatch();
      }
      else {
        this.totalPercent=this.getTotalPercent();
        this.totalPercent = this.totalPercent - this.percentageAllocation;
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.BRAND_PERCENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }
    }
    else this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
  }

  getTotalPercent()
  {
      this.totalPercent=0;
      console.log(this.brandTableDetails);
      this.brandTableDetails.forEach((brand) => {
         console.log(brand,brand.PercentAllocation);
          this.totalPercent+=parseFloat(brand.PercentAllocation);
      });
      return this.totalPercent;
  }
  private _event3FormPrepopulate() {
    this.eventInitiation3.valueChanges.subscribe(changes => {
      if (changes.brandName) {

        const selectedBrand = this._getBrandWithId(changes.brandName);
        this.projectId = selectedBrand.ProjectId;

      }
      if (changes.percentageAllocation) {
        this.percentageAllocation = changes.percentageAllocation;
      }

    })
  }

  private _getBrandWithId(brandId) {
    return this.brandNames.find(brand => brand.BrandId == brandId)
  }

  openBrandUpdateModal(brand: any, id: number) {
    const originalBrand = brand.PercentAllocation;
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: brand
    });



    dialogRef.afterClosed().subscribe(
      res => {
        // console.log(this.brandTableDetails)


        if (res !== 'closed') {
          let updatedPercent: number = 0;
          this.brandTableDetails.forEach(brand => {
            updatedPercent += parseInt(brand.PercentAllocation);
          })
          if (updatedPercent > 100) {
            console.log(id)
            console.log(originalBrand)
            this.brandTableDetails[id].PercentAllocation = originalBrand;
            this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.BRAND_PERCENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);

            //alert("Percentage Allocation Should be less than or equal to 100");
          }
          else {
            this.totalPercent = updatedPercent;
            this.isStep3Valid = (this.totalPercent == 100) ? true : false;
          }

        }


      }
    )
  }

  deleteBrand(brand, id) {
    // delete this.brandTableDetails[id];
    this.brandTableDetails.splice(id, 1);
    this.totalPercent -= +brand.PercentAllocation;

    this.isStep3Valid = (this.totalPercent == 100) ? true : false;

    // Logic to add brand that is deleted to dropdown
    this.brandNames.push(this.deletedBrand.find(br => brand.BrandName == br.BrandName));
    this.brandNames.sort((brand1, brand2) => {
      return brand1.BrandName.localeCompare(brand2.BrandName);
    })

    this.slideKitDropDownOptions = [];
    this.slideKitBrandMatch();
  }




  // Step4 Control

  // Role Select Control
  approvedSpeakers: any;
  filteredspeakers: any;

  showOtherHCPRoleTextBox: boolean = false;
  showSpeakerForm: boolean = false;
  showTrainerForm: boolean = false;
  showOthersForm: boolean = false;



  private _event4FormPrepopulate() {

    this.eventInitiation4.valueChanges.subscribe(changes => {
      // console.log(changes)
      if (changes.hcpRole == "H6") {
        this.showOthersForm = true;
        this.showOtherHCPRoleTextBox = true;
      }

      else {
        this.showOthersForm = false;
        this.showOtherHCPRoleTextBox = false;
      }

      if (changes.hcpRole !== "H1" && changes.hcpRole !== "H2") {
        this.showOthersForm = true;

      }
      else {
        this.showOthersForm = false;
      }

      if (changes.hcpRole == 'H1') {
        this.showSpeakerForm = true;
      }
      else {
        this.showSpeakerForm = false;
      }

      if (changes.hcpRole == 'H2') {
        this.showTrainerForm = true;
        this.trainerMisCode = '';
        this.hideTrainerMisCode = true;
        this.trainerCode = '';
        this.trainerSpeciality = '';
        this.trainerTier = '';
        this.trainerGoNonGo = '';

      }
      else { this.showTrainerForm = false; }



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

  // Speaker Control
  speakerName: string = '';
  speakerCode: string = '';
  speakerSpeciality: string = '';
  speakerTier: string = '';
  speakerGoNonGo: string = '';
  hcpRoleWritten: string = '';
  speakerMisCode: string = '';

  // For Aggregate Calculation
  aggregateHonorarium: number = 0;
  aggregateAccomLCTravel: number = 0;

  filteredSpeakerLength: number = 0;
  speakersWithSameName: any;

  filteredSpeakerByName: any

  hideSpeakerMisCode: boolean = true;
  showRationale: boolean = false;

  // Add Speaker Button
  showAddSpeakerButton: boolean = false;

  private _event4FormSpeakerPrepopulate() {


    this.eventInitiation4Speaker.valueChanges.subscribe(
      changes => {

        if (changes.speakerName !== '') {

          this.filteredspeakers = this._filter(changes.speakerName);
          // console.log(this.filteredspeakers.length)



          if (Boolean(this.filteredspeakers)) {
            if (this.filteredspeakers.length == 1) {

              this.hideSpeakerMisCode = true;

              this.speakerName = this.filteredspeakers[0].SpeakerName;
              this.speakerCode = this.filteredspeakers[0]['Speaker Code'];
              this.speakerSpeciality = this.filteredspeakers[0].Speciality;
              this.speakerGoNonGo = this.filteredspeakers[0]['Speaker Type'];
              this.speakerTier = this.filteredspeakers[0]['Speaker Category'];
              this.speakerMisCode = this.filteredspeakers[0].MisCode;
              this.aggregateHonorarium = this.filteredspeakers[0]['Aggregate spend Honorarium'];
              this.aggregateAccomLCTravel = this.filteredspeakers[0]['Aggregate spend on Accommodation'] || 10
              console.log('Agg', this.aggregateHonorarium)

              // by karthick
              this.getRemuneration(this.speakerSpeciality, this.speakerTier);

              // Get FCPA Details
              this._getFCPADetails(this.speakerMisCode + '');


            }
            else {
              this.hideSpeakerMisCode = false;
              this.filteredSpeakerByName = this._getFilteredSpeakerByName(changes.speakerName);
              console.log(this.filteredSpeakerByName)
              this.speakerName = '';
              this.speakerCode = '';
              this.speakerSpeciality = '';
              this.speakerGoNonGo = '';
              this.speakerTier = '';
              this.speakerMisCode = '';
            }

            //  Logic to enable add speaker button
            if (this.filteredspeakers.length == 0 && changes.speakerName.length >= 5) {
              this.showAddSpeakerButton = true;
            }
            else {
              this.showAddSpeakerButton = false;
            }


          }
        }


        if (changes.speakerMisCode) {
          // console.log(this._getFilteredSpeaker(changes.speakerMisCode))
          if (!this.hideSpeakerMisCode) {
            const filteredSpeaker = this._getFilteredSpeaker(changes.speakerMisCode);
            this.speakerName = filteredSpeaker.SpeakerName;
            this.speakerCode = filteredSpeaker['Speaker Code'];
            this.speakerSpeciality = filteredSpeaker.Speciality;
            this.speakerGoNonGo = filteredSpeaker['Speaker Type'];
            this.speakerTier = filteredSpeaker['Speaker Category'];
            this.speakerMisCode = changes.speakerMisCode;
            this.aggregateHonorarium = filteredSpeaker['Aggregate spend Honorarium'];
            this.aggregateAccomLCTravel = filteredSpeaker['Aggregate spend on Accommodation'] || 10;
            // by karthick

            this.getRemuneration(this.speakerSpeciality, this.speakerTier)

            // Get FCPA Details
            this._getFCPADetails(this.speakerMisCode + '');

          }



          // this.filteredspeakers = this._getFilteredSpeaker(changes.speakerMisCode);

        }

        console.log('Speaker Go NGo', this.speakerGoNonGo);

        if (this.speakerGoNonGo == 'GO') {
          this.showRationale = true;
        }
        else this.showRationale = false;
      }
    )
  }

  private _filter(value: string): string[] {
    // console.log(this.employeeDetails)
    if (Boolean(value)) {
      return this.approvedSpeakers.filter(emp => {
        if (Boolean(emp.SpeakerName)) {
          if (emp.SpeakerName.toLowerCase().includes(value.toLowerCase())) {
            return emp;
          }
        }

      });
    }
  }

  private _getFilteredSpeaker(misCode: string) {
    if (Boolean(misCode)) {
      return this.approvedSpeakers.find(speaker => {
        if (Boolean(speaker.MisCode)) {
          if (speaker.MisCode == misCode) {
            return speaker;
          }
        }
      })
    }
  }

  private _getFilteredSpeakerByName(name: string) {
    if (Boolean(name)) {
      let speakers: any[] = [];

      this.approvedSpeakers.forEach(speaker => {
        if (Boolean(speaker.SpeakerName)) {
          if (speaker.SpeakerName.toLowerCase() == name.toLowerCase()) {
            speakers.push(speaker);
          }
        }
      })

      return speakers;
    }
  }



  otherSpeciality: string = '';
  otherTier: string = '';
  otherGoNonGo: string = '';
  otherMisCode: string = '';

  hideOtherMisCode: boolean = true;

  filteredOthers: any;
  filteredOthersByName: any;


  // show HCP Add Button
  showHCPAddButton: boolean = false;

  private _event4FormOtherPrepopulate() {
    this.eventInitiation4Other.valueChanges.subscribe(
      changes => {
        if (changes.otherName) {

          this.filteredOthers = this._filterHCPMasterInvitees(changes.otherName);

          if (Boolean(this.filteredOthers)) {
            if (this.filteredOthers.length == 1) {
              this.hideOtherMisCode = true;

              this.otherSpeciality = this.filteredOthers[0].Speciality
              this.otherGoNonGo = this.filteredOthers[0]['HCP Type'];
              this.otherMisCode = this.filteredOthers[0].MisCode,
                this.aggregateHonorarium = this.filteredOthers[0]['Aggregate spend Honorarium'] || 10;
              this.aggregateAccomLCTravel = this.filteredOthers[0]['Aggregate spend on Accommodation'] || 10
              this._getFCPADetails(this.otherMisCode + '');

            }
            else {
              this.hideOtherMisCode = false;
              this.filteredOthersByName = this._getHCPMasterInviteeWithName(changes.otherName);
              this.otherSpeciality = ''
              this.otherGoNonGo = ''
              this.otherMisCode = ''
            }

            //  Logic to enable add speaker button
            if (this.filteredOthers.length == 0 && changes.otherName.length >= 5) {
              this.showHCPAddButton = true;
            }
            else {
              this.showHCPAddButton = false;
            }
          }

          if (changes.otherMisCode) {
            if (!this.hideOtherMisCode) {
              console.log(this._getFilteredOther(changes.otherMisCode))
              const filteredOther = this._getFilteredOther(changes.otherMisCode);
              if (Boolean(filteredOther)) {
                this.otherSpeciality = filteredOther['Speciality']
                this.otherGoNonGo = filteredOther['HCP Type'];
                this.otherMisCode = changes.otherMisCode,
                  this.aggregateHonorarium = filteredOther['Aggregate spend Honorarium'] || 10;
                this.aggregateAccomLCTravel = filteredOther['Aggregate spend on Accommodation'] || 10;
                this._getFCPADetails(this.otherMisCode + '');

              }

            }
          }

        }
        if (!this.otherGoNonGo.toLowerCase().includes('n')) {
          this.showRationale = true;
        }
        else this.showRationale = false;


        // console.log(this.eventInitiation4Other.controls.otherName.touched)
      }
    )
  }

  private _getFilteredOther(misCode: string) {
    if (Boolean(misCode)) {
      return this.inviteesFromHCPMaster.find(invitee => {
        if (invitee['MisCode']) {
          if (invitee.MisCode == misCode) return invitee
        }
      })
    }
  }

  trainerCode: string = '';
  trainerSpeciality: string = '';
  trainerTier: string = '';
  trainerGoNonGo: string = '';
  trainerMisCode: string = '';

  hideTrainerMisCode: boolean = true;

  // Data From Sheet
  approvedTrainers: any;


  filteredTrainerOption: any;
  filteredTrainerOptionByName: any;
  filteredTrainerMisCodeOption: any;

  // show trainer add button
  showTrainerAddButton: boolean = false;
  private _event4FormTrainerPrepopulate() {

    this.eventInitiation4Trainer.valueChanges.subscribe(
      changes => {

        if (changes.trainerName !== '') {
          this.filteredTrainerOption = this._filterTrainer(changes.trainerName)

          if (Boolean(this.filteredTrainerOption)) {
            if (this.filteredTrainerOption.length == 1) {
              this.hideTrainerMisCode = true

              this.trainerCode = this.filteredTrainerOption[0].TrainerCode;
              this.trainerSpeciality = this.filteredTrainerOption[0].Speciality;
              this.trainerTier = this.filteredTrainerOption[0].TierType;
              this.trainerGoNonGo = (this.filteredTrainerOption[0].Is_NONGO == "yes") ? 'Non Go' : 'Go';
              this.trainerMisCode = this.filteredTrainerOption[0].MisCode;
              this.getRemuneration(this.trainerSpeciality, this.trainerTier);
              this.aggregateHonorarium = this.filteredTrainerOption[0]['Aggregate spend on Honorarium']
              this.aggregateAccomLCTravel = this.filteredTrainerOption[0]['Aggregate spend on Accomodation']
              this._getFCPADetails(this.trainerMisCode + '');
            }
            else {
              this.hideTrainerMisCode = false;
              this.filteredTrainerOptionByName = this._getFilteredTrainer(changes.trainerName);
              console.log(this.filteredTrainerOptionByName)
              this.trainerCode = '';
              this.trainerSpeciality = '';
              this.trainerTier = '';
              this.trainerGoNonGo = '';
              this.trainerMisCode = '';
            }

            //  Logic to enable add speaker button
            if (this.filteredTrainerOption.length == 0 && changes.trainerName.length >= 5) {
              this.showTrainerAddButton = true;
            }
            else {
              this.showTrainerAddButton = false;
            }

          }

        }
        if (changes.trainerMisCode) {
          if (!this.hideTrainerMisCode) {
            const filteredTrainer = this._filterTrainerByMisCode(changes.trainerMisCode);

            this.trainerCode = filteredTrainer.TrainerCode;
            this.trainerSpeciality = filteredTrainer.Speciality;
            this.trainerTier = filteredTrainer.TierType;
            this.trainerGoNonGo = (filteredTrainer.Is_NONGO == "yes") ? 'Non GO' : 'GO';
            this.trainerMisCode = changes.trainerMisCode;

            this.getRemuneration(this.trainerSpeciality, this.trainerTier);
            this.aggregateHonorarium = filteredTrainer['Aggregate spend on Honorarium'];
            this.aggregateAccomLCTravel = filteredTrainer['Aggregate spend on Accomodation'];

            this._getFCPADetails(this.trainerMisCode + '');
          }


        }

        if (this.trainerGoNonGo.toUpperCase() == 'GO') {
          this.showRationale = true;
        }
        else this.showRationale = false;
      }
    )
  }

  private _filterTrainer(name: string) {
    if (Boolean(name)) {
      return this.approvedTrainers.filter(trainer => trainer.TrainerName.toLowerCase().includes(name.toLowerCase()))
    }
  }

  private _filterTrainerByMisCode(misCode: string) {
    if (Boolean(misCode)) {
      return this.approvedTrainers.find(trainer => trainer.MisCode == misCode)
    }
  }

  private _getFilteredTrainer(name: string) {
    if (Boolean(name)) {
      let filteredTrainerByName: any[] = [];
      this.approvedTrainers.forEach(trainer => {
        if (trainer.TrainerName.toLowerCase() === name.toLowerCase()) {
          filteredTrainerByName.push(trainer);
        }
      })
      return filteredTrainerByName;
    }
  }

  showTravelForm: boolean = false;
  showAccomForm: boolean = false;
  showLocalConveyance: boolean = false;

  private _event4FormSubPrepopulate() {
    this.eventInitiation4Sub.valueChanges.subscribe(
      changes => {
        if (changes.isHonararium == "Yes") {
          this.isHonararium = true;
        }
        else {
          this.isHonararium = false;
        }
        if (changes.isTravelRequired == "Yes") {
          this.showTravelForm = true;
        }
        else {
          this.showTravelForm = false;
        }

        if (changes.isAccomRequired == "Yes") {
          this.showAccomForm = true;
        }
        else {
          this.showAccomForm = false;
        }

        if (changes.isLocalConveyance == "Yes") {
          this.showLocalConveyance = true;
        }
        else {
          this.showLocalConveyance = false;
        }
      }
    )
  }

  isHonarariumYes: boolean = true
  isTravelYes: boolean = true
  isAccomYes: boolean = true
  isLocalYes: boolean = true
  timecalculationhonorariumifYes: boolean = true
  invitesslocalyes: boolean = true


  hcpTableDetails: any[] = [];

  // Arrays to store added panelists
  addedSpeakers: any[] = [];
  addedTrainers: any[] = [];
  addedOthers: any[] = []

  addHCPTable() {
    let hcpValidity: number = 0;

    let hcpname: string = '';
    let hcpMisCode: string = '';
    let hcpgoNonGo: string = '';
    if (this.showSpeakerForm && this.speakerName !== '') {
      hcpname = this.speakerName;
      hcpMisCode = this.speakerMisCode;
      hcpgoNonGo = this.speakerGoNonGo;
    }
    if (this.showTrainerForm && this.eventInitiation4Trainer.controls.trainerName.value !== '') {
      hcpname = this.eventInitiation4Trainer.controls.trainerName.value;
      hcpMisCode = this.trainerMisCode;
      hcpgoNonGo = this.trainerGoNonGo;
    }
    if (this.showOthersForm && this.eventInitiation4Other.controls.otherName.value !== '') {
      hcpname = this.eventInitiation4Other.controls.otherName.value;
      hcpMisCode = this.otherMisCode;
      hcpgoNonGo = this.otherGoNonGo;
    }

    if (this.showFcpaUpload) {
      if (!Boolean(this.eventInitiation4Sub.controls.fcpaDate.value)) {
        // alert("FCPA Date is missing");
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FCPA_DATE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        hcpValidity++;
      }

      if (!Boolean(this.eventInitiation4Sub.value.uploadFCPA)) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        hcpValidity++;
      }
    }



    // console.log("HonarVal",this.eventInitiatio4Honararium.valid)
    if (this.isHonararium && !this.eventInitiatio4Honararium.valid) {
      // alert("Honararium Details are missing")
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HONARARIUM, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      hcpValidity++;
    }

    if (this.showRationale && !Boolean(this.eventInitiation4Sub.value.uploadNOC)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      hcpValidity++;
    }

    if (this.isHonararium && !Boolean(this.eventInitiatio4Honararium.value.uploadPAN)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      hcpValidity++;
    }

    if (this.isHonararium && !Boolean(this.eventInitiatio4Honararium.value.uploadCheque)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      hcpValidity++;
    }





    if (!Boolean(hcpname) && !Boolean(hcpgoNonGo) && !Boolean(hcpMisCode)) {
      // alert("HCP Role Details are missing")
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    if (this.eventInitiation4Sub.value.isHonararium == "Yes" && this.eventInitiatio4Honararium.value.honorariumAmount == 0) {
      // alert("Honararium amount is missing")
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HONARARIUM, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    let honarariumDuration = this.eventInitiatio4Honararium.value;
    // console.log("honar",honarariumDuration)
    if (this.eventInitiation4Sub.value.isHonararium == "Yes" && !this.eventInitiatio4Honararium.valid && (
      honarariumDuration.presentationDuration == 0
      || honarariumDuration.panelSessionPreparation == 0 || honarariumDuration.qaSession == 0
      || honarariumDuration.briefingDuration == 0 || honarariumDuration.panelDiscussionDuration == 0
    )) {
      // alert("Honararium Details are missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HONARARIUM, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    if (this.showRationale && !Boolean(this.eventInitiation4Sub.value.rationale)) {
      // alert("Rationale Amount is missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_RATIONALE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    if (this.eventInitiation4Sub.value.isTravelRequired == "Yes" && (this.eventInitiation4Travel.value.travelAmount == 0
      || !Boolean(this.eventInitiation4Travel.value.travelType) || !Boolean(this.eventInitiation4Travel.value.travelBTC))) {
      // alert("Travel Deatails are missing")
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_TRAVEL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    // if (this.showTravelForm && (!Boolean(this.eventInitiation4Travel.value.uploadPANForTravel) || !Boolean(this.eventInitiation4Travel.value.uploadChequeForTravel))) {
    //   this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
    //   hcpValidity++;
    // }

    if (this.eventInitiation4Sub.value.isLocalConveyance == "Yes" && this.eventInitiation4Sub.value.localConveyanceAmount == 0) {
      // alert("Local Conveyance Amount is missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_LOCAL_CONVEYANCE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    if (this.showLocalConveyance && !Boolean(this.eventInitiation4Sub.value.isLocalConveyBTC)) {
      // alert("Local Conveyance BTC/BTE is missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_LOCAL_CONVEYANCE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    if (this.eventInitiation4Sub.value.isAccomRequired == "Yes" && (this.eventInitiation4Accomodation.value.accomAmount == 0 || !Boolean(this.eventInitiation4Accomodation.value.accomBTC))) {
      // alert("Accomodation Details are missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ACCOMODATION, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    if (this.showOtherHCPRoleTextBox && !Boolean(this.hcpRoleWritten)) {
      // alert("HCP Role is Missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      hcpValidity++;
    }

    if (hcpValidity == 0) {

      const HcpData = {
        // For API
        EventIdorEventRequestId: " ",
        SpeakerCode: (Boolean(this.speakerCode)) ? this.speakerCode + ' ' : " ",
        TrainerCode: (Boolean(this.trainerCode)) ? this.trainerCode + ' ' : " ",
        Speciality: (Boolean(this.speakerSpeciality)) ? this.speakerSpeciality + ' ' : this.trainerSpeciality || ' ',
        Tier: (Boolean(this.speakerTier)) ? this.speakerTier + ' ' : this.trainerTier + ' ',
        Rationale: (this.showRationale) ? this.eventInitiation4Sub.value.rationale + ' ' : 'None',
        PresentationDuration: honarariumDuration.presentationDuration + '' || ' ',
        PanelSessionPreperationDuration: honarariumDuration.panelSessionPreparation + '' || '0',
        PanelDisscussionDuration: honarariumDuration.panelDiscussionDuration + '' || '0',
        QaSessionDuration: honarariumDuration.qaSession + '' || '0',
        BriefingSession: honarariumDuration.briefingDuration + '' || '0',
        TotalSessionHours: (Boolean(this.totalHours)) ? this.totalHours + '' : 0 + '',
        IsInclidingGst: "No",
        AgreementAmount: this.eventInitiatio4Honararium.value.honorariumAmount + '',

        // For Amount
        isTravelBTC: this.eventInitiation4Travel.value.travelBTC,
        isAccomBTC: this.eventInitiation4Accomodation.value.accomBTC,


        // For Table
        HcpRole: (!this.showOtherHCPRoleTextBox) ? this.hcpRoles.find(role => { if (this.eventInitiation4.value.hcpRole == role.HCPRoleID) return role }).HCPRole : this.hcpRoleWritten,
        HcpName: hcpname,
        MisCode: hcpMisCode + '',
        GOorNGO: hcpgoNonGo || ' ',
        HonorariumRequired: this.eventInitiation4Sub.value.isHonararium,
        HonarariumAmount: this.eventInitiatio4Honararium.value.honorariumAmount + '',
        Travel: this.eventInitiation4Travel.value.travelAmount + '',
        LocalConveyance: this.eventInitiation4Sub.value.localConveyanceAmount + '',
        Accomdation: this.eventInitiation4Accomodation.value.accomAmount + '',
        FinalAmount: (parseInt(this.eventInitiatio4Honararium.value.honorariumAmount) + parseInt(this.eventInitiation4Travel.value.travelAmount) +
          parseInt(this.eventInitiation4Sub.value.localConveyanceAmount) + parseInt(this.eventInitiation4Accomodation.value.accomAmount)) + ''
      }

      if (this.showOthersForm) {
        HcpData.Speciality = this.otherSpeciality;
        HcpData.Tier = " ";

      }

      this.BTCTotalAmount += parseInt(HcpData.HonarariumAmount);

      if (this.isHonararium) {
        let honorariumSummary = this.BTCSummaryTable.find(data => data.expense == 'Honorarium');
        if (!honorariumSummary) {
          this.BTCSummaryTable.push({
            expense: 'Honorarium',
            amount: +HcpData.HonarariumAmount,
            includingTax: 'No'
          })
        }
        else {
          honorariumSummary.amount += +HcpData.HonarariumAmount;
        }
      }


      // console.log(HcpData)
      if (this.showTravelForm) {
        let travelSummaryBTC = this.BTCSummaryTable.find(data => data.expense == 'Travel Allowance');
        let travelSummaryBTE = this.BTESummaryTable.find(data => data.expense == 'Travel Allowance');
        if (HcpData.isTravelBTC == 'BTC') {
          this.BTCTotalAmount += parseInt(HcpData.Travel);
          if (!travelSummaryBTC) {
            this.BTCSummaryTable.push({
              expense: 'Travel Allowance',
              amount: +HcpData.Travel,
              includingTax: 'No'
            })
          }
          else {
            travelSummaryBTC.amount += +HcpData.Travel;
          }
        }
        else {
          this.BTETotalAmount += parseInt(HcpData.Travel)
          if (!travelSummaryBTE) {
            this.BTESummaryTable.push({
              expense: 'Travel Allowance',
              amount: +HcpData.Travel || 0,
              includingTax: 'No'
            })
          }
          else {
            travelSummaryBTE.amount += +HcpData.Travel;
          }
        }
      }

      if (this.showAccomForm) {
        let accomSummaryBTC = this.BTCSummaryTable.find(data => data.expense == 'Accomodation Allowance');
        let accomSummaryBTE = this.BTESummaryTable.find(data => data.expense == 'Accomodation Allowance');
        if (HcpData.isAccomBTC == 'BTC') {
          this.BTCTotalAmount += parseInt(HcpData.Accomdation);
          if (!accomSummaryBTC) {
            this.BTCSummaryTable.push({
              expense: 'Accomodation Allowance',
              amount: +HcpData.Accomdation,
              includingTax: 'No'
            })
          }
          else {
            accomSummaryBTC.amount += +HcpData.Accomdation;
          }
        }
        else {
          this.BTETotalAmount += parseInt(HcpData.Accomdation);
          if (!accomSummaryBTE) {
            this.BTESummaryTable.push({
              expense: 'Accomodation Allowance',
              amount: +HcpData.Accomdation,
              includingTax: 'No'
            })
          }
          else {
            accomSummaryBTE.amount += +HcpData.Accomdation;
          }
        }
      }

      if (this.showLocalConveyance) {
        let localConveyanceSummartBTC = this.BTCSummaryTable.find(data => data.expense == 'Local Conveyance');
        let localConveyanceSummartBTE = this.BTESummaryTable.find(data => data.expense == 'Local Conveyance');
        if (this.eventInitiation4Sub.value.isLocalConveyBTC == 'BTC') {
          this.BTCTotalAmount += +HcpData.LocalConveyance;
          if (!localConveyanceSummartBTC) {
            this.BTCSummaryTable.push({
              expense: 'Local Conveyance',
              amount: +HcpData.LocalConveyance,
              includingTax: 'No'
            })
          }
          else {
            localConveyanceSummartBTC.amount += +HcpData.LocalConveyance;
          }

        }
        else {
          this.BTETotalAmount += +HcpData.LocalConveyance;
          if (!localConveyanceSummartBTE) {
            this.BTCSummaryTable.push({
              expense: 'Local Conveyance',
              amount: +HcpData.LocalConveyance,
              includingTax: 'No'
            })
          }
          else {
            localConveyanceSummartBTE.amount += +HcpData.LocalConveyance;
          }
        }
      }


      // this.BudgetAmount = this.BTCTotalAmount + this.BTCTotalAmount;
      this.hcpTableDetails.push(HcpData);

      for (let i = 0; i < this.hcpTableDetails.length; i++) {
        this.slideKitTableInput.push('slideBrand' + i);
        this.slideKitTableRadio.push('radio' + i)
      }

      // Logic to remove added panelists
      let index: number = -1;
      // 1.Speaker
      if (this.showSpeakerForm) {
        for (let i = 0; i < this.approvedSpeakers.length; i++) {
          if (this.approvedSpeakers[i].MisCode == this.speakerMisCode) {
            // console.log(this.approvedSpeakers[i])
            index = i;
          }
        }
        this.addedSpeakers.push(this.approvedSpeakers[index]);
        this.approvedSpeakers.splice(index, 1)
      }
      else if (this.showTrainerForm) {
        for (let i = 0; i < this.approvedTrainers.length; i++) {
          if (this.approvedTrainers[i].MisCode == this.trainerMisCode) {
            console.log(this.approvedTrainers[i])
            index = i;
          }
        }
        this.addedTrainers.push(this.approvedTrainers[index]);
        this.approvedTrainers.splice(index, 1)
        console.log(this.approvedTrainers)
      }
      else if (this.showOthersForm) {
        for (let i = 0; i < this.inviteesFromHCPMaster.length; i++) {
          if (this.inviteesFromHCPMaster[i].MisCode == this.otherMisCode) {
            // console.log(this.inviteesFromHCPMaster[i]);
            index = i;
          }
        }

        this.addedOthers.push(this.inviteesFromHCPMaster[index]);
        this.inviteesFromHCPMaster.splice(index, 1);
      }




      this.isStep4Valid = (this.hcpTableDetails.length > 0) ? true : false;

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
      this.eventInitiation4Sub.controls.uploadFCPA.reset();

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
      this.eventInitiation4Sub.controls.rationale.setValue('');
      this.totalHours = 0;

      this.benificiaryName = '';
      this.bankAccountNumber = '';
      this.panCardNumber = '';
      this.nameAsPan = '';
      this.ifscCode = '';

      this.showRationale = false;



    }

  }


  private _panelOtherFiles : string[] = [];
  private _panelDeviationFile : string[] = [];
  public totalPanelBTE: number = 0;
  public totalPanelBTC: number = 0;

  public panelBTCSummary: any[] = [];
  public panelBTESummary: any[] = [];
  // Getting Panelists Data From Shared Component
  private _getPanelData(){
    this.utilityService.data.subscribe(
      value => {
        // console.log('received')
        // console.log(value);

        if(value.from == 'PanelComponent'){
          this.hcpTableDetails = value.panelists;

          this._panelDeviationFile = value.deviationFiles;
          this._panelOtherFiles = value.otherFiles
       
          // this.BTCSummaryTable.concat(value.btcSummary);
          // this.BTESummaryTable.concat(value.btcSummary);
          // this.BTESummaryTable = [];
          // this.BTCSummaryTable = [];
          this.totalPanelBTC = value.btcTotalAmount;
          this.totalPanelBTE = value.bteTotalAmount;


          if(value.btcSummary.length > 0){
            // value.btcSummary.forEach(summary => {
            //   this.BTCSummaryTable.push(summary)
            // })
            this.panelBTCSummary = value.btcSummary;
          }

          if(value.bteSummary.length > 0){
            // value.bteSummary.forEach(summary => {
            //   this.BTESummaryTable.push(summary)
            // })
            this.panelBTESummary = value.bteSummary;
          }

          console.log(this.hcpTableDetails.length);
          console.log(this.BTCSummaryTable);
          console.log(this.BTESummaryTable)

          this.isStep4Valid = (this.hcpTableDetails.length > 0) ? true : false;

          for (let i = 0; i < this.hcpTableDetails.length; i++) {
            this.slideKitTableInput.push('slideBrand' + i);
            this.slideKitTableRadio.push('radio' + i)
          }
        }
      }
    )
  }

  openHCPTableUpdateModal(hcpData: any) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '800px',
      data: hcpData
    });
  }

  deletHcp(id: number, panelist: any) {
    this.hcpTableDetails.splice(id, 1);
    this.isStep4Valid = (this.hcpTableDetails.length > 0) ? true : false;

    for (let i = 0; i < this.hcpTableDetails.length; i++) {
      this.slideKitTableInput.push('slideBrand' + i);
      this.slideKitTableRadio.push('radio' + i)
    }

    // Logic to add deleted panelist to options
    // 1.Speaker
    // console.log(this.addedSpeakers.find(spk => spk.MisCode == panelist.MisCode))
    if (this.addedSpeakers.find(spk => spk.MisCode == panelist.MisCode)) {
      this.approvedSpeakers.push(this.addedSpeakers.find(speaker => speaker.MisCode == panelist.MisCode));
      this.approvedSpeakers.sort((asp1, asp2) => {
        return asp1.SpeakerName.localeCompare(asp2.SpeakerName)
      })
    }
    else if (this.addedTrainers.find(tra => tra.MisCode == panelist.MisCode)) {
      this.approvedTrainers.push(this.addedTrainers.find(tariner => tariner.MisCode == panelist.MisCode));
      this.approvedTrainers.sort((atr1, atr2) => {
        return atr1.TrainerName.localeCompare(atr2.TrainerName)
      })
    }
    else if (this.addedOthers.find(hcp => hcp.MisCode == panelist.MisCode)) {
      this.inviteesFromHCPMaster.push(this.addedOthers.find(inv => panelist.MisCode == inv.MisCode));
      this.inviteesFromHCPMaster.sort((inv1, inv2) => {
        return inv1.HCPName.localeCompare(inv2.HCPName)
      })
    }

  }

  // Remuneration Calculation
  totalHours: any;
  remuneration: any;
  remunerationToCalculate: any;

  // by karthick
  getRemuneration(speciality, tier) {
    if (Boolean(speciality) && Boolean(tier)) {
      this.utilityService.getFMV(speciality, tier).subscribe(
        res => {
          console.log('from FMV calculation', res)
          this.remunerationToCalculate = res;


        },
        err => {
          // this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          this.remunerationToCalculate = 1;
        }
      )
    }
    else {
      this.remunerationToCalculate = 0;
    }
  }

  // get FCPA details based on MIS Code
  showFcpaUpload: boolean = false;
  showFcpaDownload: boolean = false;
  fcpaDownloadLink: string;

  private _getFCPADetails(misCode: string) {
    console.log(misCode);
    this.utilityService.getFCPA(misCode).subscribe(
      res => {
        console.log('fcpa', res);
        if (res.fcpaValid == 'Yes') {
          this.showFcpaUpload = false;
          this.showFcpaDownload = true;
          this.fcpaDownloadLink = res.url;
        }
        else {
          this.showFcpaUpload = true;
          this.showFcpaDownload = false;
        }
      }
    )
  }

  private _aggregateSpendForTravel() {
    this.eventInitiation4Travel.valueChanges.subscribe(changes => {

      if (changes.travelAmount) {
        if (changes.travelAmount > this.aggregateAccomLCTravel || changes.travelAmount > this.aggregateAccomLCTravel / 3) {

          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AGGREGATES_LIMIT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        }

      }

    })
  }

  private _aggregateSpendForAccom() {
    this.eventInitiation4Accomodation.valueChanges.subscribe(changes => {
      console.log('accomdation', changes);
      if (changes.accomAmount) {
        if (changes.accomAmount > this.aggregateAccomLCTravel || changes.accomAmount > this.aggregateAccomLCTravel / 3) {
          console.log('divided by 3 ', this.aggregateAccomLCTravel / 3)
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AGGREGATES_LIMIT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        }
      }
    })
  }

  private _aggregateSpendForLC() {
    this.eventInitiation4Sub.valueChanges.subscribe(changes => {
      console.log('accomdation', changes);
      if (changes.localConveyanceAmount) {
        if (changes.localConveyanceAmount > this.aggregateAccomLCTravel || changes.localConveyanceAmount > this.aggregateAccomLCTravel / 3) {
          console.log('divided by 3 ', this.aggregateAccomLCTravel / 3)
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AGGREGATES_LIMIT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        }
      }
    })
  }



  showUploadNOC: boolean = false;

  showOtherCurrencyTextBox: boolean = false;

  // vendorDetails : any ;
  filteredAccounts: any;

  isHonararium: boolean = false;
  isVendorPresent: boolean = false;
  // Additional Values:
  currency: string = '';
  otherCurrency: string = ''
  taxSelect: string = '';
  benificiaryName: string = ''
  bankAccountNumber: string = ''
  nameAsPan: string = ''
  panCardNumber: string = ''
  ifscCode: string = ''
  emailId: string = ''
  uploadPAN: any = '';
  uploadCheque: any = '';

  showvendorbutton: boolean = false;
  private _eventInitiatio4HonarariumPrepopulate() {
    this.eventInitiatio4Honararium.valueChanges.subscribe(
      changes => {

        this.totalHours = ((changes.presentationDuration + changes.panelDiscussionDuration +
          changes.panelSessionPreparation + changes.qaSession + changes.briefingDuration));
        if (this.totalHours >= 480) {
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.MAX_HOURS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);

          // Removing the last digit when minutes pass 480
          let totalHourStr = this.totalHours.toString();
          this.totalHours = +(totalHourStr.substring(0, totalHourStr.length - 1));

        }

        // by karthick

        if (changes.honorariumAmount) {
          if (changes.honorariumAmount > this.aggregateHonorarium || changes.honorariumAmount > this.remuneration) {
            this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.HONORARIUM_LIMIT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);

          }
        }

        // by karthick 


        const fmvcalHours = +(this.totalHours / 60).toFixed(2);
        //console.log('fmvcalHours',fmvcalHours);

        console.log('in hours', +fmvcalHours);

        this.remuneration = (this.remunerationToCalculate * +fmvcalHours);
        console.log('final amonut', this.remuneration);
        console.log(changes)
        if (changes.currency == 'Others') {
          this.showOtherCurrencyTextBox = true;
        }
        else {
          this.showOtherCurrencyTextBox = false
        }
        // console.log(changes.benificiaryName)
        if (changes.benificiaryName) {

          // console.log(this._filterBankAccounts(changes.bankAccountNumber))
          this.filteredAccounts = this._filterBankAccounts(changes.benificiaryName);
          // console.log(this.filteredAccounts)
          if (this.eventInitiatio4Honararium.controls.bankAccountNumber.valid) {
            // console.log(this._getSelectedBankDetails(changes.bankAccountNumber))
            const filteredVendor = this._getSelectedBankDetails(changes.benificiaryName);
            console.log(filteredVendor)
            if (filteredVendor) {
              this.isVendorPresent = true;
              this.bankAccountNumber = filteredVendor.BankAccountNumber;
              this.benificiaryName = filteredVendor.BeneficiaryName;
              this.nameAsPan = filteredVendor.PanCardName;
              this.panCardNumber = filteredVendor.PanNumber;
              this.ifscCode = filteredVendor.IfscCode
            }
          }

          if (this.filteredAccounts.length == 0 && changes.benificiaryName.length >= 5) {
            this.showvendorbutton = true;
          }
          else {
            this.showvendorbutton = false;
          }
        }


      }
    )
  }
  private _getSelectedBankDetails(acctNumber: any) {
    return this.vendorDetails.find(ven => {
      if (ven.BeneficiaryName) {
        // console.log(typeof ven.BankAccountNumber);
        // console.log(typeof acctNumber)
        return ven.BeneficiaryName == acctNumber
      }
    })
  }

  private _filterBankAccounts(value: string): string[] {
    // console.log(this.employeeDetails)
    const filterValue = value.toLowerCase();

    return this.vendorDetails.filter(ven => {

      if (ven.BeneficiaryName) {
        const benName = ven.BeneficiaryName.toLowerCase();

        return benName.includes(filterValue);
      }

    })
  }


  // Step5 control
  slideKitDetails: any;
  slideKitDropDown: any;
  slideKitDropDownOptions: any[] = [];

  slideKitTableInput: any[] = [];
  slideKitTableRadio: any[] = [];

  slideKitTableDetails: any[] = [];

  slideKitType: any;
  idShown: any[] = [];
  misCode: any;
  // showSlideKitUploadFile : boolean = false

  slideKitRadioOption(option: any, name: string, id: string, misCode: string) {

    this.misCode = misCode;

    if (this.idShown.indexOf(id) == -1) {
      this.idShown.push(id);
    }


    if (this.idShown.length == this.hcpTableDetails.length) {
      this.isStep5Valid = true;
    } else this.isStep5Valid = false;


    console.log(this.idShown)
    if (option == 'SlideKit From Company') {


      this.slideKitType = option;
      // document.getElementById(id).style.visibility = "visible";
      document.getElementById(id).style.display = 'block';
      document.getElementById(misCode + id).style.display = 'none'
      // console.log(document.getElementById(misCode+id))
      // this.showSlideKitUploadFile = false;  
    }
    else {
      const slideKitDetail = {
        EventId: " ",
        Mis: this.misCode,
        SlideKitType: option,
        SlideKitDocument: " "
      }

      if (this.slideKitTableDetails.length > 0) {
        if (!this.slideKitTableDetails.find(ele => ele.Mis == this.misCode)) {
          this.slideKitTableDetails.push(slideKitDetail)
        }
      }
      else {
        this.slideKitTableDetails.push(slideKitDetail);
      }



      // document.getElementById(id).style.visibility = "hidden";
      document.getElementById(id).style.display = 'none';
      document.getElementById(misCode + id).style.display = 'block'
      // this.showSlideKitUploadFile = true;
    }

  }

  // Tracking the slidekit option selected
  slideKitPrePopulate(a: any) {

    const slideKitDetail = {
      EventId: " ",
      Mis: this.misCode,
      SlideKitType: this.slideKitType,
      SlideKitDocument: a
    }


    if (this.slideKitTableDetails.length > 0) {
      if (!this.slideKitTableDetails.find(ele => ele.Mis == this.misCode)) {
        this.slideKitTableDetails.push(slideKitDetail);
      }
    }
    else {
      this.slideKitTableDetails.push(slideKitDetail);
    }
  }


  slideKitBrandMatch() {
    let activeSlideKits: any[] = [];
    if (Boolean(this.slideKitDetails) && this.slideKitDetails.length > 0) {
      this.slideKitDetails.forEach(slideKit => {
        if (slideKit.IsActive == 'Yes') {
          activeSlideKits.push(slideKit)
        }
      })
    }


    activeSlideKits.forEach(slideKit => {
      this.brandTableDetails.forEach(brand => {
        if (slideKit.BrandName == brand.BrandName) {

          if (this.slideKitDropDownOptions.length > 0) {
            if (!Boolean(this.slideKitDropDownOptions.find(option => option.BrandName == brand.BrandName))) {
              this.slideKitDropDownOptions.push(slideKit)
            }
          }
          else {
            this.slideKitDropDownOptions.push(slideKit)
          }

        }
      })
    })

    console.log(this.slideKitDropDownOptions)
  }


  // Step 6 Control
  showInviteeLocalConveyance: boolean = false;

  inviteesFromHCPMaster: any;

  filteredHCPMasterInvitees: any;
  filteredInviteeLength: number = 0;

  filteredInviteeMisCode: string;
  hideInviteeMisCode: boolean = true;
  filteredInviteeMisCodeSelect: any[] = [];

  private _inviteeSelectionFormPrePopulate() {
    this.inviteeSelectionForm.valueChanges.subscribe(
      changes => {
        if (changes.isInviteeLocalConveyance == 'Yes') {
          this.showInviteeLocalConveyance = true;
        }
        else {
          this.showInviteeLocalConveyance = false;
        }
        if (changes.inviteesFrom) {
          this.filteredHCPMasterInvitees = null;
          this.filteredInviteeMisCode = '';

        }

        if (changes.inviteeName != '') {
          if (this.inviteeSelectionForm.controls.inviteesFrom.touched && changes.inviteesFrom == 'hcpMaster') {

            this.filteredHCPMasterInvitees = this._filterHCPMasterInvitees(changes.inviteeName);

            // const filteredInvitee = this._getHCPMasterInviteeWithName(changes.inviteeName);

            // if (filteredInvitee && filteredInvitee.length == 1) {
            //   this.hideInviteeMisCode = true;
            //   this.filteredInviteeMisCode = filteredInvitee[0].MisCode;
            // }
            // else {
            //   this.hideInviteeMisCode = false
            //   this.filteredInviteeMisCodeSelect = filteredInvitee
            // }


            const filteredInvitee = this._getFilteredInvitee(changes.inviteeName)

            if (Boolean(filteredInvitee)) {
              this.inviteeSelectionForm.controls.inviteeName.setValue(filteredInvitee.HCPName)
              this.filteredInviteeMisCode = filteredInvitee.MisCode;
            }



          }
          else {

            // alert("Select Invitees From")
          }

          // if (changes.inviteeMisCode != '') {
          //   if (Boolean(changes.misCode)) {
          //     this.filteredInviteeMisCode = this._getFilteredInvitee(changes.inviteeMisCode).MisCode;
          //   }

          // }

        }

        if (this.inviteeTableDetails.length > 0 && Boolean(changes.uploadAgenda) && Boolean(changes.uploadInvitation)) {
          this.isStep6Valid = true;

        }
        else this.isStep6Valid = false;

        if (changes.inviteesFrom == 'other') {
          this.showinvitees = true;
          // this.inviteeSelectionForm.controls.inviteedFrom.setValue(
          //   'Others'
          // );
        } else {
          // this.inviteeSelectionForm.controls.inviteedFrom.setValue(
          //   ' '
          // );
          this.showinvitees = false;
        }
        
      }
    )
  }

  private _filterHCPMasterInvitees(name: string) {
    console.log("nam", Boolean(name))
    if (Boolean(name)) {
      return this.inviteesFromHCPMaster.filter(invitee => {
        if (invitee['HCPName']) {
          return invitee['HCPName'].toLowerCase().includes(name.toLowerCase())
        }
      });
    }
    // return this.inviteesFromHCPMaster.find(invitee => invitee['HCP Name'].includes(name))
  }

  private _getFilteredInvitee(misCode: string) {
    console.log('mis', Boolean(misCode))
    if (Boolean(misCode)) {
      return this.inviteesFromHCPMaster.find(invitee => invitee['MisCode'] == misCode);
    }

  }

  private _getHCPMasterInviteeWithName(name: string) {
    if (Boolean(name)) {
      const invitees: any[] = [];

      this.inviteesFromHCPMaster.forEach(invitee => {
        if (invitee['HCPName']) {
          if (invitee['HCPName'].toLowerCase() === name.toLowerCase()) invitees.push(invitee)
        }
      }
      )
      return invitees;
    }
  }

  inviteeTableDetails: any[] = [];
  // Array to store added invitee
  addedInvitees: any[] = [];

  addToInviteeTable() {
    // console.log(this.inviteeSelectionForm.value)
    let inviteeValidity: number = 0;

    if (!this.inviteeSelectionForm.valid) {
      // alert("Please Fill all the details")
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      inviteeValidity++;
    }
    // console.log(Boolean(this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount))
    if (this.showInviteeLocalConveyance && (this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount == 0 || !Boolean(this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount))) {
      // alert("Enter Local Conveyance Amount");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_LOCAL_CONVEYANCE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      inviteeValidity++;
    }
    if (this.showInviteeLocalConveyance && !Boolean(this.inviteeSelectionForm.value.inviteeBTC)) {
      // alert("Select BTC/BTE");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_LOCAL_CONVEYANCE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      inviteeValidity++;
    }

    if (!this.hideInviteeMisCode && !Boolean(this.inviteeSelectionForm.value.inviteeMisCode)) {
      // alert("Invitee MIS Code is missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_MIS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      inviteeValidity++;
    }

    if (inviteeValidity == 0) {

      const inviteeData = {
        EventIdOrEventRequestId: ' ',
        MisCode: (Boolean(this.filteredInviteeMisCode)) ? this.filteredInviteeMisCode + ' ' : this.inviteeSelectionForm.value.inviteeMisCode + ' ',
        InviteeName: this.inviteeSelectionForm.value.inviteeName ||  this.inviteeSelectionForm.value.InviteeName ,
        LocalConveyance: this.inviteeSelectionForm.value.isInviteeLocalConveyance,
        BtcorBte: (Boolean(this.inviteeSelectionForm.value.inviteeBTC)) ? this.inviteeSelectionForm.value.inviteeBTC : 'NIL',
        LcAmount: (this.showInviteeLocalConveyance) ? this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount + '' : 0 + '',
        InviteedFrom: 'Others' || ' ',
      // NewInviteeName:this.inviteeSelectionForm.value.inviteeName ||  this.inviteeSelectionForm.value.InviteeName ,
      Speciality: this.inviteeSelectionForm.value.Speciality || ' ',
      HCPType:this.inviteeSelectionForm.value.HCPType || ' '
      }

      if (this.showInviteeLocalConveyance) {
        let localConveyanceSummartBTC = this.BTCSummaryTable.find(data => data.expense == 'Local Conveyance');
        let localConveyanceSummartBTE = this.BTESummaryTable.find(data => data.expense == 'Local Conveyance');
        if (inviteeData.BtcorBte == 'BTC') {
          this.BTCTotalAmount += +inviteeData.LcAmount;
          if (!localConveyanceSummartBTC) {
            this.BTCSummaryTable.push({
              expense: 'Local Conveyance',
              amount: +inviteeData.LcAmount,
              includingTax: 'No'
            })
          }
          else {
            localConveyanceSummartBTC.amount += +inviteeData.LcAmount;
          }

        }
        else {
          this.BTETotalAmount += +inviteeData.LcAmount;
          if (!localConveyanceSummartBTE) {
            this.BTESummaryTable.push({
              expense: 'Local Conveyance',
              amount: +inviteeData.LcAmount,
              includingTax: 'No'
            })
          }
          else {
            localConveyanceSummartBTE.amount += +inviteeData.LcAmount;
          }
        }
      }

      // this.BudgetAmount = this.BTCTotalAmount + this.BTCTotalAmount;
      this.inviteeTableDetails.push(inviteeData);


      // Logic to remove the invitee who was added
      let index: number = -1;

      for (let i = 0; i < this.inviteesFromHCPMaster.length; i++) {
        if (this.inviteesFromHCPMaster[i].MisCode == inviteeData.MisCode) {
          // console.log(this.inviteesFromHCPMaster[i]);
          index = i;
        }
      }
      this.addedInvitees.push(this.inviteesFromHCPMaster[index]);
      this.inviteesFromHCPMaster.splice(index, 1);

      // this.inviteeSelectionForm.reset();
      this.inviteeSelectionForm.controls.inviteesFrom.reset();
      this.inviteeSelectionForm.controls.inviteeName.reset();
      this.inviteeSelectionForm.controls.inviteeMisCode.reset();
      // this.inviteeSelectionForm.controls.isInviteeLocalConveyance.reset();
      this.inviteeSelectionForm.controls.inviteeLocalConveyanceAmount.reset();
      this.inviteeSelectionForm.controls.inviteeBTC.reset();
      this.inviteeSelectionForm.controls.InviteeName.reset();
      this.inviteeSelectionForm.controls.inviteedFrom.reset();
      this.inviteeSelectionForm.controls.Speciality.reset();
      this.inviteeSelectionForm.controls.HCPType.reset();
      this.inviteeSelectionForm.controls.isInviteeLocalConveyance.setValue('No');


      // console.log(this.inviteeSelectionForm.controls)
      this.hideInviteeMisCode = true;
      this.filteredInviteeMisCode = '';
      this.filteredHCPMasterInvitees = null;
      inviteeValidity = 0;
    }
  }

  inviteeData: any;
  inviteeFiles: any;

  private _inviteeFiles: string[] = [];

  totalInviteeBTC: number = 0;
  totalInviteeBTE: number = 0;

  inviteeBTCSummary: any[] = [];
  inviteeBTESummary: any[] = [];
  private _getInviteeData() {
    this.utilityService.data.subscribe(value => {
      if (value.from == 'inviteeComponent') {
        console.log('recievede from invitee component', value)
        this.inviteeData = value.eventRequestInvitees,
          this.inviteeFiles = value.otherFiles,

        //   this.BTCSummaryTable = [];
        // this.BTESummaryTable = [];
        this.inviteeTableDetails = [];
        // this.BTETotalAmount = 0;
        // this.BTCTotalAmount = 0;

        if (value.bteSummary.length > 0) {
          // value.bteSummary.forEach(summary => {
          //   this.BTCSummaryTable.push(summary)
          // })
          this.inviteeBTESummary = value.bteSummary;
        }
        if (value.btcSummary.length > 0) {
          // value.btcSummary.forEach(summary => {
          //   this.BTESummaryTable.push(summary)
          // })
          this.inviteeBTCSummary = value.btcSummary;
        }
        // if (value.otherFiles.length > 0) {
        //   value.otherFiles.forEach(files => {
        //     this.otherFiles.push(files);
        //   })
        // }
        this._inviteeFiles = value.otherFiles;

        if (value.eventRequestInvitees.length > 0) {
          value.eventRequestInvitees.forEach(invitees => {
            this.inviteeTableDetails.push(invitees);
          })
        }
        this.totalInviteeBTC = value.btctotal;
        this.totalInviteeBTE = value.btetotal;

        console.log(this.totalInviteeBTC)
        console.log('length of invitee table', this.inviteeTableDetails.length);
        console.log('lwnght of files', value.otherFiles.length)
        this.isStep6Valid = (this.inviteeTableDetails.length > 0 &&  Boolean(this._inviteeFiles[0]) && Boolean(this._inviteeFiles[1])) ? true : false;
      }
      // console.log()

      // this.otherFiles.push(this.inviteeFiles);
      // this.inviteeTableDetails.push(this.inviteeData);



    })
  }

  openInviteeUpdateModal(invitee: any) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: invitee
    });
  }

  deleteInvitee(id: number, invitee: any) {
    this.inviteeTableDetails.splice(id, 1);
    this.isStep6Valid = (this.inviteeTableDetails.length > 0) ? true : false;

    this.inviteesFromHCPMaster.push(this.addedInvitees.find(inv => invitee.MisCode == inv.MisCode));
    this.inviteesFromHCPMaster.sort((inv1, inv2) => {
      return inv1.HCPName.localeCompare(inv2.HCPName)
    })

  }



  // Step7 Control
  showExpenseDeviation: boolean = false;
  expenseTableDetails: any = [];

  private _expenseSelectionFormPrePopulate() {

    this.expenseSelectionForm.valueChanges.subscribe(
      changes => {
        if (Boolean(changes.expenseType)) {
          if (changes.expenseType.includes('Food & Beverages') && changes.isExcludingTax == 'No') {
            if (changes.expenseAmount / this.inviteeTableDetails.length > 1500) {
              this.showExpenseDeviation = true;
            }
            else {
              this.showExpenseDeviation = false;
            }
          }
          else {
            this.showExpenseDeviation = false;
          }
        }

      }
    )
  }

  addToExpenseTable() {
    if (this.expenseSelectionForm.valid) {
      if (this.showExpenseDeviation && !Boolean(this.expenseSelectionForm.value.uploadExpenseDeviation)) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }
      else {
        if (this.expenseSelectionForm.value.isExpenseBtc == 'BTC'){
          this.BTCTotalAmount += this.expenseSelectionForm.value.expenseAmount
        }
        else{
          this.BTETotalAmount += this.expenseSelectionForm.value.expenseAmount
        }


        const expense = {
          // For API
          EventId: " ",
          BtcAmount: (this.BTCTotalAmount + this.totalInviteeBTC + this.totalPanelBTC) + '',
          BteAmount: (this.BTETotalAmount + this.totalInviteeBTE + this.totalPanelBTE) + '',
          BudgetAmount: (this.BTETotalAmount+this.BTCTotalAmount+this.totalPanelBTC+this.totalPanelBTE+this.totalInviteeBTC+this.totalInviteeBTE) + '',

          // For Table
          Expense: this.expenseSelectionForm.value.expenseType,
          Amount: this.expenseSelectionForm.value.expenseAmount + '',
          AmountExcludingTax: this.expenseSelectionForm.value.isExcludingTax,
          BtcorBte: this.expenseSelectionForm.value.isExpenseBtc
        }

        let expenseSummaryBTC = this.BTCSummaryTable.find(summ => summ.expense == expense.Expense);
        let expenseSummaryBTE = this.BTESummaryTable.find(summ => summ.expense == expense.Expense);

        if (this.expenseSelectionForm.value.isExpenseBtc == 'BTC') {
          // this.BTCTotalAmount += this.expenseSelectionForm.value.expenseAmount;
          if (!expenseSummaryBTC) {
            this.BTCSummaryTable.push({
              expense: expense.Expense,
              amount: +expense.Amount,
              includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes'
            })
          }
          else {
            expenseSummaryBTC.amount += +expense.Amount;
          }
        }
        else {
          // this.BTETotalAmount += this.expenseSelectionForm.value.expenseAmount;
          if (!expenseSummaryBTE) {
            this.BTESummaryTable.push({
              expense: expense.Expense,
              amount: +expense.Amount,
              includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes'
            })
          }
          else {
            expenseSummaryBTE.amount += +expense.Amount;
          }
        }


        //  this.BudgetAmount = this.BTCTotalAmount + this.BTCTotalAmount;
        this.expenseTableDetails.push(expense);
        this.BudgetAmount = this.BTETotalAmount + this.BTCTotalAmount;
        console.log('Budget',this.BudgetAmount)
        this.isStep7Valid = (this.expenseTableDetails.length > 0) ? true : false;


        this.expenseSelectionForm.reset();
      }

    }
    else {
      // alert("Please Fill all the fields")
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
  }

  openExpenseUpdateModal(expense: any) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: expense
    });

  }

  deleteExpense(id: any) {
    this.expenseTableDetails.splice(id, 1);
    this.isStep7Valid = (this.expenseTableDetails.length > 0) ? true : false;
  }

  BTCTotalAmount: number = 0;
  BTETotalAmount: number = 0;
  BudgetAmount: number = 0;


  // Building payload to use for submiting and preview
  private payLoad
  private buildPayload(): boolean {
    //by karthick
    this.changestartTime = this.eventInitiation2.value.startHours + ":" + this.eventInitiation2.value.startMinutes + ":" + this.eventInitiation2.value.startAMPM + '';
    this.changeendTime = this.eventInitiation2.value.endHours + ":" + this.eventInitiation2.value.endMinutes + ":" + this.eventInitiation2.value.endAMPM + '';




    if (!this.isStep1Valid) {
      // alert("Pre Event Check is missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    // by karthick
    if (!this.isStep2Valid) {
      // alert("Event Details are missing")
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if (!this.isStep3Valid) {
      // alert('Brand Details are Missing');
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if (!this.isStep4Valid) {
      // alert('Panel Selection is missing');
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if (!this.isStep5Valid) {
      // alert("SlideKit selection is missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if (!this.isStep6Valid) {
      // alert("Invitee Selection is missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if (!this.isStep7Valid) {
      // alert("Expense Selection is missing");
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }


    // by karthick this.isStep2Valid &&

    if (this.isStep1Valid && this.isStep3Valid && this.isStep2Valid && this.isStep4Valid && this.isStep5Valid && this.isStep6Valid && this.isStep7Valid) {
      this.deviationFiles = [];
      this.otherFiles = [];

      if (Boolean(this.thirtyDaysDeviationFile)) this.deviationFiles.push(this.thirtyDaysDeviationFile);
      if (Boolean(this.sevenDaysDeviationFile)) this.deviationFiles.push(this.sevenDaysDeviationFile);
      if (Boolean(this.expenseDeviationFile)) this.deviationFiles.push(this.expenseDeviationFile);
      // if (Boolean(this.nocFile)) this.otherFiles.push(this.nocFile);
      // if (Boolean(this.panFile)) this.otherFiles.push(this.panFile);
      if (Boolean(this.slideKitFile)) this.otherFiles.push(this.slideKitFile);
      // if (Boolean(this.invitationFile)) this.otherFiles.push(this.invitationFile);
      // if (Boolean(this.agendaFile)) this.otherFiles.push(this.agendaFile);
      // if (Boolean(this.fcpaFile)) this.otherFiles.push(this.fcpaFile);
      // if (Boolean(this.chequeFile)) this.otherFiles.push(this.chequeFile);
      // if (Boolean(this.travelPanFile)) this.otherFiles.push(this.travelPanFile);
      // if (Boolean(this.travelChequeFile)) this.otherFiles.push(this.travelChequeFile);
     
      // this.otherFiles.concat(this._panelOtherFiles);
      this._panelOtherFiles.forEach(file => this.otherFiles.push(file));
      this._panelDeviationFile.forEach(file => this.deviationFiles.push(file));
      this._inviteeFiles.forEach(file => this.otherFiles.push(file));
      // this.deviationFiles.concat(this._panelDeviationFile);
      // this.otherFiles.concat(this._inviteeFiles);
      

      let roleDetails = this._authService.decodeToken();

      let webinarEventData = {
        EventId: ' ',
        EventTopic: this.eventInitiation2.value.eventTopic,
        EventType: this.eventDetails.find(event => event.EventTypeId == this.eventCode).EventType,
        EventDate: new Date(this.eventInitiation1.value.eventDate),
        StartTime: this.changestartTime,
        EndTime: this.changeendTime,
        Meeting_Type: this.eventInitiation2.value.meetingType + " | " + this.eventInitiation2.value.vendorName || ' ',
        BrandName: " ",
        PercentAllocation: " ",
        ProjectId: " ",
        HcpRole: " ",
        IsAdvanceRequired: "No", //Changed to No as webinar has no advance required
        EventOpen30days: (this.show30DaysUploaDeviation) ? 'Yes' : 'No',
        EventWithin7days: (this.show7DaysUploadDeviation) ? 'Yes' : 'No',
        RBMorBM: roleDetails['RBM_BM'] || ' ',
        'Sales_Head': roleDetails.SalesHead,
        'Marketing_Head': roleDetails.MarketingHead || ' ',
        Finance: roleDetails.FinanceTreasury || ' ',
        InitiatorName: roleDetails.unique_name || ' ',
        'Initiator_Email': roleDetails.email || ' ',
        Files: this.otherFiles,
        DeviationFiles: this.deviationFiles,
        'FB_Expense_Excluding_Tax': (this.showExpenseDeviation) ? 'Yes' : 'No',
        Role: roleDetails.role,
        AdvanceAmount: this.BudgetAmount + '' || '0',
        TotalExpenseBTC: this.BTCTotalAmount + '' || '0',
        TotalExpenseBTE: this.BTETotalAmount + '' || '0',
        MedicalAffairsEmail: roleDetails.MedicalAffairsHead,
        ReportingManagerEmail: roleDetails.reportingmanager,
        FirstLevelEmail: roleDetails.firstLevelManager,
        ComplianceEmail: roleDetails.ComplianceHead,
        FinanceAccountsEmail: roleDetails.FinanceAccounts,
        SalesCoordinatorEmail: roleDetails.SalesCoordinator,
        EventOpen30dayscount: this.eventsWithin30Days.length+''
      }
      const webinar = {
        Webinar: webinarEventData,
        // ExpenseDetails : this.expenseTableDetails
        RequestBrandsList: this.brandTableDetails,
        EventRequestHcpRole: this.hcpTableDetails,
        EventRequestInvitees: this.inviteeTableDetails,
        EventRequestExpenseSheet: this.expenseTableDetails,
        EventRequestHCPSlideKits: this.slideKitTableDetails
      }

      console.log(webinar)
      this.payLoad = webinar;
      return true;
    }
    else {
      return false;
    }
  }

  // Preview of form data
  openPreview() {
    if (this.buildPayload()) {
      const dialogRef = this.dialog.open(ModalComponent, {
        width: '800px',
        height: '500px',
        data: this.payLoad

      })
    }
  }



  // Submitting Form
  submitForm() {

    if (this.buildPayload()) {
      this.loadingIndicator = true;
      this.utilityService.postWebinarPreEventForm(this.payLoad).subscribe(
        res => {
          // console.log(res);
          if (res.message == " Success!") {
            this.loadingIndicator = false;
            this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_PRE_EVENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
            this.router.navigate(['dashboard'])
          }
        },
        err => {
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        })
    }
  }


  // Step Controls:
  isStep1Valid: boolean = false;
  isStep2Valid: boolean = false;
  isStep3Valid: boolean = false;
  isStep4Valid: boolean = false;
  isStep5Valid: boolean = false;
  isStep6Valid: boolean = false;
  isStep7Valid: boolean = false;
  isFormValid: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobileMenu();
  }
  isMobileMenu() {

    if ($(window).width() <= 598) {
      // return false;
      console.log("yes")
      this.orientation = "vertical"
      // return 'vertical'
    }
    else {
      console.log("No")
      this.orientation = "horizontal"
      // return 'horizontal'
    }
  };

  // File Upload Check
  selectedFile: File | null;

  allowedTypesForHTML: string;
  private _allowedTypes: string[];

  private deviationFiles: any[] = [];
  private otherFiles: any[] = [];

  // Deviation Files:
  private thirtyDaysDeviationFile: string;
  private sevenDaysDeviationFile: string;
  private expenseDeviationFile: string;
  private nocFile: string;
  private fcpaFile: string
  private panFile: string;
  private chequeFile: string;
  private agendaFile: string;
  private invitationFile: string;
  private slideKitFile: string;
  private vendorFile: string;
  // private travelPanFile: string;
  // private travelChequeFile: string;



  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {

      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE) {

        const extension = file.name.split('.')[1];

        const reader = new FileReader();

        console.log('extension', this._allowedTypes.includes(extension))
        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;


            if (type == 'deviation') {
              if (control == 'withIn30DaysDeviation') {
                // this.thirtyDaysDeviationFile = base64String.split(',')[1];
                // this.thirtyDaysDeviationFile = file.name+':'+ base64String.split(',')[1];
                this.thirtyDaysDeviationFile = "30DaysDeviationFile"+extension+':'+ base64String.split(',')[1];
              }
              else if (control == 'next7DaysDeviation') {
                // this.sevenDaysDeviationFile = base64String.split(',')[1];
                // this.sevenDaysDeviationFile = file.name+':'+base64String.split(',')[1];
                this.sevenDaysDeviationFile = "7DaysDeviationFile"+extension+':'+base64String.split(',')[1];

              }
              else if (control == 'uploadExpenseDeviation') {
                // this.expenseDeviationFile = base64String.split(',')[1];
                // this.expenseDeviationFile = file.name+':'+base64String.split(',')[1];
                this.expenseDeviationFile = "ExpenseExcludingTax"+extension+':'+base64String.split(',')[1];
              }
            }

            if (type == 'other') {
              if (control == 'uploadNOC') {
                // this.nocFile = base64String.split(',')[1];
                this.nocFile = file.name+':'+base64String.split(',')[1];
              }
              else if (control == 'uploadFCPA') {
                // this.fcpaFile = base64String.split(',')[1];
                this.fcpaFile = file.name+':'+base64String.split(',')[1];
              }
              else if (control == 'uploadPAN') {
                // this.uploadPAN = base64String.split(',')[1];
                this.uploadPAN =  file.name+':'+base64String.split(',')[1];
              }
              else if (control == 'uploadCheque') {
                this.chequeFile = base64String.split(',')[1];
              }
              else if (control == 'uploadAgenda') {
                // this.agendaFile = base64String.split(',')[1];
                this.agendaFile = file.name+':'+base64String.split(',')[1];
              }
              else if (control == 'uploadInvitation') {
                // this.invitationFile = base64String.split(',')[1];
                this.invitationFile = file.name+':'+base64String.split(',')[1];
              }
              else if (control == 'vendorFileUpload') {
                // this.vendorFile = base64String.split(',')[1];
                this.vendorFile = file.name+':'+base64String.split(',')[1];
              }
              // else if (control == 'uploadPANForTravel') {
              //   this.travelPanFile = base64String.split(',')[1];
              // }
              // else if (control == 'uploadChequeForTravel') {
              //   this.travelChequeFile = base64String.split(',')[1];
              // }
              else {
                // this.slideKitFile = base64String.split(',')[1];
                this.slideKitFile = file.name+':'+base64String.split(',')[1];
              }
            }
          }
          console.log(this.vendorFile)
          // this.utilityService.fileUpload(data).subscribe(res => console.log(res), err => console.log(err))
        }
        else {

          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_TYPE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          this.resetControl(control);
        }

      }
      else {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_SIZE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        this.resetControl(control);

      }


    }
  }

  private resetControl(control: string) {
    switch (control) {
      case 'withIn30DaysDeviation':
        this.eventInitiation1.controls.withIn30DaysDeviation.reset();
        break;

      case 'next7DaysDeviation':
        this.eventInitiation1.controls.next7DaysDeviation.reset();
        break;

      case 'uploadNOC':
        this.eventInitiation4Sub.controls.uploadNOC.reset();
        break;

      case 'uploadFCPA':
        this.eventInitiation4Sub.controls.uploadFCPA.reset();
        break;

      case 'uploadPAN':
        this.eventInitiatio4Honararium.controls.uploadPAN.reset();
        break;

      case 'uploadCheque':
        this.eventInitiatio4Honararium.controls.uploadCheque.reset();
        break;

      case 'uploadAgenda':
        this.inviteeSelectionForm.controls.uploadAgenda.reset();
        break;

      case 'uploadInvitation':
        this.inviteeSelectionForm.controls.uploadInvitation.reset();
        break;

      case 'uploadExpenseDeviation':
        this.expenseSelectionForm.controls.uploadExpenseDeviation.reset();
        break;

      case 'vendorFileUpload':
        this.eventInitiation2.controls.vendorFileUpload.reset();
        break;

      // case 'uploadPANForTravel':
      //   this.eventInitiation4Travel.controls.uploadPANForTravel.reset();
      //   break;

      // case 'uploadChequeForTravel':
      //   this.eventInitiation4Travel.controls.uploadChequeForTravel.reset();
      //   break;

    }
  }




  //Min Date
  today: string = new Date().toISOString().split('T')[0];


  //expense and tax


  public amountIncludingTaxCheck(value: string, control: string) {

    let excludingTaxAmount: number = 0;
    let includingTaxAmount: number = 0;
  
    if (control == 'localAmountWithTax') {
      excludingTaxAmount = this.expenseSelectionForm.value.localAmountWithoutTax;
      includingTaxAmount = this.expenseSelectionForm.value.localAmountWithTax;
      if (this._isAmountInvalid(includingTaxAmount, excludingTaxAmount)) {
        this.expenseSelectionForm.controls.localAmountWithTax.setValue(excludingTaxAmount)
      }
    }

    // console.log(excludingTaxAmount);
  }

  private _isAmountInvalid(includingTaxAmount: number, excludingTaxAmount: number) {
    if (includingTaxAmount < excludingTaxAmount) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      return true;
    }
  }

  expenseTaxFormPrePopulate() {
    this.expenseSelectionForm.valueChanges.subscribe((changes) => {
      if (Boolean(changes.expenseType)) {
        this.showexpensetax = true
        if (
          changes.expenseType.includes('Food & Beverages') &&
          changes.localAmountWithoutTax > 1500
        ) {
          if (changes.expenseAmount / this.inviteeTableDetails.length > 1500) {
            this.showExpenseDeviation = true;
          } else {
            this.showExpenseDeviation = false;
          }
        } else {
          this.showExpenseDeviation = false;
        }
      }
    });
  }

  addToExpensetaxTable(){
    // if (this.expenseSelectionForm.valid) {

    let formvalidity: number = 0;
    if(this.showexpensetax && (this.expenseSelectionForm.value.localAmountWithoutTax > this.expenseSelectionForm.value.localAmountWithTax)){
      formvalidity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
  }
      if (this.expenseSelectionForm.value.isExpenseBtc == 'BTC') {
        this.BTCTotalAmount += this.expenseSelectionForm.value.localAmountWithTax;
      } else {
        this.BTETotalAmount += this.expenseSelectionForm.value.localAmountWithTax;
      }

      this.BudgetAmount = this.BTCTotalAmount + this.BTETotalAmount;

      if(formvalidity == 0){
        const expense = {
          // For API
          EventId: ' ',
          BtcAmount: this.BTCTotalAmount + '',
          BteAmount: this.BTETotalAmount + '',
          BudgetAmount: this.BudgetAmount + '',
  
          // For Table
          Expense: this.expenseSelectionForm.value.expenseType,
          Amount: this.expenseSelectionForm.value.localAmountWithTax + '',
          AmountExcludingTax: this.expenseSelectionForm.value.isExcludingTax,
          BtcorBte: this.expenseSelectionForm.value.isExpenseBtc,
        };
  
        let expenseSummaryBTC = this.BTCSummaryTable.find(summ => summ.expense == expense.Expense);
        let expenseSummaryBTE = this.BTESummaryTable.find(summ => summ.expense == expense.Expense);
  
        if (this.expenseSelectionForm.value.isExpenseBtc == 'BTC') {
          // this.BTCTotalAmount += this.expenseSelectionForm.value.expenseAmount;
          if (!expenseSummaryBTC) {
            this.BTCSummaryTable.push({
              expense: expense.Expense,
              amount: +expense.Amount,
              includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes'
            })
          }
          else {
            expenseSummaryBTC.amount += +expense.Amount;
          }
        }
        else {
          // this.BTETotalAmount += this.expenseSelectionForm.value.expenseAmount;
          if (!expenseSummaryBTE) {
            this.BTESummaryTable.push({
              expense: expense.Expense,
              amount: +expense.Amount,
              includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes'
            })
          }
          else {
            expenseSummaryBTE.amount += +expense.Amount;
          }
        }
  
        this.expenseTableDetails.push(expense);
        this.BudgetAmount = this.BTETotalAmount + this.BTCTotalAmount;
        this.isStep7Valid = this.expenseTableDetails.length > 0 ? true : false;
        this.expenseSelectionForm.reset();

      }
      
      // this._bteBtcCalculation();
      // this.expenseSelectionForm.controls.isAdvanceRequired.setValue(advanceSelected)
      // console.log(this.expenseTableDetails);
    // } else {
    //   // alert("Please Fill all the fields")
    //   this._snackBarService.showSnackBar(
    //     Config.MESSAGE.ERROR.FILL_ALL,
    //     Config.SNACK_BAR.DELAY,
    //     Config.SNACK_BAR.ERROR
    //   );
    // }
  }

}

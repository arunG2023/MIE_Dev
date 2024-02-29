import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { filter } from 'rxjs';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';

@Component({
  selector: 'app-hcp-consultants-event-request',
  templateUrl: './hcp-consultants-event-request.component.html',
  styleUrls: ['./hcp-consultants-event-request.component.css']
})
export class HcpConsultantsEventRequestComponent implements OnInit {

  localconveyanceForm: FormGroup;
  showLocalConvenyenceForm: boolean = false;

  roadTravelForm: FormGroup;
  showRoadTravelForm: boolean = false;

  airTravelForm: FormGroup;
  showAirTravelForm: boolean = false;

  trainTravelForm: FormGroup;
  showTrainTravelForm: boolean = false;

  accomodationForm: FormGroup;
  showaccomdationForm: boolean = false;

  medicalRegistationForm: FormGroup;
  showmedicalRegistationForm: boolean = false;



  //event start date 
  eventStartDate: string;
  // Spinner
  loadingIndicator: boolean = false;

  // step 1 pre event check
  isLinear: boolean = true;
  orientation: string;
  isStep1Valid: boolean = false;
  eventInitiation1: FormGroup;

  // Upload Deviation
  show30DaysUploaDeviation: boolean = false;
  show7DaysUploadDeviation: boolean = false;

    //Min Date
    today: string = new Date().toISOString().split('T')[0];
  minDate: string;
  maxDate: string;

  //event type
  eventType: string = 'EVTHC';
  eventDate: string;

  // step 2 event details check
  eventInitiation2: FormGroup;
  isStep2Valid: boolean = false;

  //event details
  eventDetails: any;

  //step 3 brand allocation 
  isStep3Valid: boolean = false;

  // step 3 form 
  eventInitiation3: FormGroup;
  brandNames: any;
  // New Values:
  percentageAllocation: number = 0;
  projectId: string = '';
  eventCode: string = this.eventType;
  totalPercent: number = 0;
  brandTableDetails: any[] = [];
  showBrandTable: boolean = false;

  // from step 3 brand allocation to slide kit selection
  slideKitDetails: any;
  slideKitDropDown: any;
  slideKitDropDownOptions: any[] = [];

  // step 4 panel selection
  isStep4Valid: boolean = false;
  eventInitiation4: FormGroup;
  hcpRoles: any;
  showOtherHCPRoleTextBox: boolean = false;
  showOthersForm: boolean = false;

  // spaeker role
  // eventInitiation4Speaker: FormGroup;
  filteredspeakers: any;

  // Speaker Control
  speakerName: string = '';
  speakerCode: string = '';
  speakerSpeciality: string = '';
  speakerTier: string = '';
  speakerGoNonGo: string = '';
  hcpRoleWritten: string = '';
  speakerMisCode: string = '';

  hideSpeakerMisCode: boolean = true;
  // For Aggregate Calculation
  aggregateHonorarium: number = 0;
  aggregateAccomLCTravel: number = 0;

  filteredSpeakerByName: any;

  // Add Speaker Button
  showAddSpeakerButton: boolean = false;
  showRationale: boolean = false;
  showSpeakerForm: boolean = false;

  //other hcp
  eventInitiation4Other: FormGroup;

  filteredOthers: any;
  hideOtherMisCode: boolean = true;

  otherTier: string = 'Tier';
  otherGoNonGo: string = '';
  otherMisCode: string = '';
  otherHcpName: string = ''

  filteredOthersByName: any;

  // show HCP Add Button
  showHCPAddButton: boolean = false;



  // Data From Sheet
  approvedTrainers: any;
  hideTrainerMisCode: boolean = true;

  trainerCode: string = '';
  trainerSpeciality: string = '';
  trainerTier: string = '';
  trainerGoNonGo: string = '';
  trainerMisCode: string = '';

  showTrainerForm: boolean = false;

  // common fields
  eventInitiation4Sub: FormGroup;
  expenseSelectionForm: FormGroup;

  expenseType: any[] = [];

  // showing registration details
  showRegistration: boolean = false;
  showRegistrationRemains: boolean = false;

  // variable for adding expense in table
  expenseDetails: any[] = [];
  ExpenseDetailsClone: any[] = [];
  expenseDetailsForPayLoad: any[] = [];
  showExpenseTable: boolean = false;


  // travel form
  travelForm: FormGroup;
  ifTravelisYes: boolean = false;

  // ccomdation form


  // local conveyence form

  showLCFrom: boolean = false;

  // total expense calculation
  totalexpenseCalculationForm: FormGroup;

  // final form 
  finalForm: FormGroup;

  userDetails:any;




  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT
  public page: number = 1


  constructor(private utilityService: UtilityService, private _snackBarService: SnackBarService,
    private dialog: MatDialog, private _authService: AuthService, private router: Router,
    ) {


  }

  ngOnInit() {

    this._authService.getUserDetails$.subscribe(res => this.userDetails = res)

    const FcpaToday = new Date();
    const lastFcpaDate = new Date(FcpaToday.getFullYear() - 1, FcpaToday.getMonth(), FcpaToday.getDate());
    const futureFcpaDate = new Date(FcpaToday.getFullYear() + 1, FcpaToday.getMonth(), FcpaToday.getDate());

    this.minDate = lastFcpaDate.toISOString().split('T')[0];
    this.maxDate = FcpaToday.toISOString().split('T')[0];


    // Step 1 Form Controls
    this.eventInitiation1 = new FormGroup({
      withIn30DaysDeviation: new FormControl(''),
      eventDate: new FormControl('', Validators.required),
      next7DaysDeviation: new FormControl('')
    })

  



    //getting previous 30 days event list
    this.loadingIndicator = true;
    this.utilityService.getEventListFromProcess().subscribe(res => {
      this.loadingIndicator = false
      this._filterEventsWithIn30Days(res);
    })

    // getting event name
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

    //validation checking for 7 days 
    this._event1FormPrepopulate();

    // step 2 form control
    this.eventInitiation2 = new FormGroup({

      eventTopic: new FormControl('', [Validators.required]),
      sponsorshipSocietyName: new FormControl(''),
      venueName: new FormControl(''),
      country: new FormControl(''),
      eventEndDate: new FormControl('')

    })

    // validation checking
    this._event2FormPrepopulate();

    // step 3 form control
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
    this.eventInitiation3 = new FormGroup({
      brandName: new FormControl('', [Validators.required]),
      percentageAllocation: new FormControl('', [Validators.required]),
      // projectId : new FormControl('', [Validators.required]),
      // eventCode : new FormControl('',[Validators.required])
    })

    // step 3 form pre populate
    this._event3FormPrepopulate();

    // step 4 form control
    this.eventInitiation4 = new FormGroup({
      //hcpRole: new FormControl('', [Validators.required]),
      otherName: new FormControl('', Validators.required),
      otherMisCode: new FormControl('',),
      tier: new FormControl('')
    })

    // Getting HCP Roles
    this.utilityService.getHcpRoles().subscribe(
      res => {
        this.hcpRoles = res;
        // console.log(this.hcpRoles)
      },
      err => {
        // alert("Unexpected Error Happened")
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }

    )

    //other form control
    this.eventInitiation4Other = new FormGroup({

    })
    this.eventInitiation4Sub = new FormGroup({
      rationale: new FormControl('', [Validators.required]),
      uploadfcpa: new FormControl('', [Validators.required]),
      fcpaDate: new FormControl('', [Validators.required])
    })

    this.expenseSelectionForm = new FormGroup({
      expenseType: new FormControl('', [Validators.required]),
      isExpenseBtc: new FormControl('',),
      RegistrationAmountIxcludingTax: new FormControl('',),
      RegistrationAmountExcludingTax: new FormControl('',),

    })

    // Get Expense Types
    this.utilityService.getExpenseType().subscribe(
      res => {

        this._checkingHcp(res)
      }
    )

    this._event4FormPrepopulate();


    // Get Invitees From HCP Master 
    this.utilityService.getEmployeesFromHCPMaster().subscribe(
      res => {
        this.inviteesFromHCPMaster = res;
        // console.log('Before SPlice', this.inviteesFromHCPMaster.length);
        this.inviteesFromHCPMaster.splice(1000,);
        // console.log('After SPlice', this.inviteesFromHCPMaster.length);
        // console.log(this.inviteesFromHCPMaster)

      }

    )

    this.expenseFromPrepopulate();


    // accomdation 
    this.accomodationForm = new FormGroup({
      AccomBTC: new FormControl(''),
      AccomAmountIncludingTax: new FormControl(0),
      AccomAmountExcludingTax: new FormControl(0),

    })

    this.localconveyanceForm = new FormGroup({
      LCBTC: new FormControl(''),
      LCAmountIncludingTax: new FormControl(0),
      LCAmountExcludingTax: new FormControl(0)
    })

    this.roadTravelForm = new FormGroup({
      RoadBTC: new FormControl(''),
      RoadAmountIncludingTax: new FormControl(0),
      RoadAmountExcludingTax: new FormControl(0)
    })

    this.airTravelForm = new FormGroup({
      AirBTC: new FormControl(''),
      AirAmountIncludingTax: new FormControl(0),
      AirAmountExcludingTax: new FormControl(0)
    })

    this.trainTravelForm = new FormGroup({
      TrainBTC: new FormControl(''),
      TrainAmountIncludingTax: new FormControl(0),
      TrainAmountExcludingTax: new FormControl(0)
    })

    this.medicalRegistationForm = new FormGroup({
      MedicalRegistationBTC: new FormControl(''),
      MedicalRegistationIncludingTax: new FormControl(0),
      MedicalRegistationExcludingTax: new FormControl(0)
    })
    // this.ad();

    // total expense calculation form control
    this.totalexpenseCalculationForm = new FormGroup({
      totalexpense: new FormControl({ value: '', disabled: true }),
      expenseDevition: new FormControl('')

    })
    // final form 
    this.finalForm = new FormGroup({
      brochureupload: new FormControl(''),
      legitimate: new FormControl(''),
      Objective: new FormControl('')

    })

    // Getting allowed file types
    this._allowedTypes = Config.FILE.ALLOWED;

    // Generating Allowed types for HTML
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', '
    })

    this.localFormChange();
    this.accomdationFormChange();
    this.airTravalFormChange();
    this.trainTravelFormChange();
    this.roadFormChange();
    this.medicalFormChange();

    const draft = sessionStorage.getItem("step_1");
    if (draft) {
      this.eventInitiation1.setValue(JSON.parse(draft));
    }

    const draft1 = sessionStorage.getItem("step_2");
    if(draft1){
      this.eventInitiation2.setValue(JSON.parse(draft1));
    }

    const draft2 = sessionStorage.getItem('step_3');
    if(draft2){
      this.totalPercent = 0;
      JSON.parse(draft2).forEach( brandData =>{
        if(brandData){
          this.brandTableDetails.push(brandData);
          this.totalPercent += +brandData.PercentAllocation;
          
        }})}

    const draft3 = sessionStorage.getItem('step_4_miscode_details');
    if(draft3){
      this.eventInitiation4.setValue(JSON.parse(draft3));
    }    

   



    // for dreafting purpose 
    this.eventInitiation1.valueChanges.pipe(
      filter(() => this.eventInitiation1.valid)).subscribe(val => sessionStorage.setItem("step_1", JSON.stringify(val)));
     
    this.eventInitiation2.valueChanges.pipe(
      filter(() => this.eventInitiation2.valid)).subscribe(val => sessionStorage.setItem('step_2',JSON.stringify(val)));  

    this.eventInitiation4.valueChanges.pipe(
      filter(() => this.eventInitiation4.valid)).subscribe(val=> sessionStorage.setItem('step_4_miscode_details',JSON.stringify(val)));  


  }



  public pageChanged(thisPage) {
    this.page = thisPage
  }

  eventsWithin30Days: any[] = [];
  private _filterEventsWithIn30Days(eventList: any) {
    if (Boolean(eventList) && eventList.length > 0) {
      let row = 1
      eventList.forEach(event => {
        let today: any = new Date();
        // console.log(event.EventDate)
        if(event['Initiator Email'] == this.userDetails.email ){
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
        this.eventsWithin30Days.sort((list1, list2) => {
          return list2['EventId/EventRequestId'].localeCompare(list1['EventId/EventRequestId']);
        })

      })
      console.log('length of the 30 days events',this.eventsWithin30Days.length)
    }

    // this.pageLoaded = true
    if (this.eventsWithin30Days.length > 0) {
      this.show30DaysUploaDeviation = true;
    }
    // console.log(this.eventsWithin30Days)


  }

  private _event1FormPrepopulate() {
    this.eventInitiation1.valueChanges.subscribe(changes => {
      if (changes.eventDate) {
        let today: any = new Date();
        let eventDate = new Date(changes.eventDate);

        let Difference_In_Time = eventDate.getTime() - today.getTime();

        let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

        this.eventDate = changes.eventDate

        if (Difference_In_Days < 5) {
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

  private _event2FormPrepopulate() {
    this.eventInitiation2.valueChanges.subscribe(changes => {


      

      // Step2 Next Button Validation
      let step2Validity = 0;
      if ((!Boolean(this.eventInitiation2.value.sponsorshipSocietyName) || !Boolean(this.eventInitiation2.value.venueName) || !Boolean(this.eventInitiation2.value.country))) {
        step2Validity++;
      }
      if (this.eventInitiation2.invalid) {
        step2Validity++;
      }

      this.isStep2Valid = (step2Validity == 0) ? true : false;
    })

    // this.eventInitiation2.get('eventEndDate').setValidators([Validators.min(this.eventInitiation2.get('eventStartDate').value)])

  }
  private _event3FormPrepopulate() {
    this.eventInitiation3.valueChanges.subscribe(changes => {
      // console.log(changes)
      if (changes.brandName) {

        const selectedBrand = this._getBrandWithId(changes.brandName);
        this.projectId = selectedBrand.ProjectId;

      }
      if (changes.percentageAllocation) {
        this.percentageAllocation = changes.percentageAllocation;
      }

    })
  }

  // declaring the variable for hcp name
  hcpName: string = '';
  private _event4FormPrepopulate() {
    this.eventInitiation4.valueChanges.subscribe(
      changes => {
        // console.log('changes',changes)
        if (changes.otherName) {

          this.filteredOthers = this._filterHCPMasterInvitees(changes.otherName);
          // console.log('filtered others',this.filteredOthers)

          if (Boolean(this.filteredOthers)) {
            if (this.filteredOthers.length == 1) {
              console.log(this.filteredOthers)
              this.hideOtherMisCode = true;
              this.hcpName = this.filteredOthers[0]['HCPName'];
              this.otherGoNonGo = this.filteredOthers[0]['HCP Type'];
              this.otherMisCode = this.filteredOthers[0].MisCode,
                // this.aggregateHonorarium = this.filteredOthers[0]['Aggregate spend Honorarium'] || 0;
                this.aggregateAccomLCTravel = this.filteredOthers[0]['Aggregate Spent as HCP Consultant'] || 0;
              this._getFCPADetails(this.otherMisCode + '');
              // console.log('total aggregate spend ',this.aggregateAccomLCTravel)

            }
            else {
              this.hideOtherMisCode = false;
              this.filteredOthersByName = this._getHCPMasterInviteeWithName(changes.otherName);
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
              // console.log(this._getFilteredOther(changes.otherMisCode))
              const filteredOther = this._getFilteredOther(changes.otherMisCode);
              if (Boolean(filteredOther)) {
                this.otherGoNonGo = filteredOther['HCP Type'];
                this.otherMisCode = changes.otherMisCode,
                this.otherHcpName = changes.otherName,
                  // this.aggregateHonorarium = filteredOther['Aggregate spend Honorarium'] || 0;
                  this.aggregateAccomLCTravel = filteredOther['Total Spend on HCP'] || 0;
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
  // show trainer add button
  showTrainerAddButton: boolean = false;

  // Start Time End Time Validation
  showEndTimeError: boolean = false;
  private _validateTime(start: string, end: string) {
    let startingTime = new Date(`${this.eventDate} ${start}`);
    let endingTime = new Date(`${this.eventDate} ${end}`);

    if (startingTime >= endingTime) {
      // console.log("invalid");
      this.showEndTimeError = true;
      return false;
    }
    else {
      this.showEndTimeError = false;
      return true;
    }


  }

  private _filterBrandDetailsForClass1() {
    this.brandNames = this.brandNames.filter(brand => {
      const name = brand.Name.split("_")
      return name[1] == 'Webinar';
    })
  }


  // Array to store filtered brands
  deletedBrand: any[] = [];


  // step 3 add to brand table
  addToBrandTable() {

    if (this.eventInitiation3.valid) {
      this.totalPercent = +this.totalPercent + +this.percentageAllocation;

      if (this.totalPercent <= 100) {
        const brand = {
          BrandName: this.brandNames.find(brand => brand.BrandId == this.eventInitiation3.value.brandName).BrandName,
          PercentAllocation: this.percentageAllocation + "",
          ProjectId: this.projectId
        }

        // Logic To remove brand that already selected from down
        this.brandTableDetails.push(brand);
        sessionStorage.setItem('step_3', JSON.stringify(this.brandTableDetails));

        let index: number = -1;
        for (let i = 0; i < this.brandNames.length; i++) {
          if (this.brandNames[i].BrandName == brand.BrandName) {
            index = i;
          }
        }
        this.deletedBrand.push(this.brandNames[index]);
        this.brandNames.splice(index, 1);
        this.isStep3Valid = (this.totalPercent == 100) ? true : false;
        this.showBrandTable = true;
        this.eventInitiation3.reset();
        this.percentageAllocation = 0;
        this.projectId = '';
        this.eventCode = this.eventType;
      }
      else {
        this.totalPercent = this.totalPercent - this.percentageAllocation;
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.BRAND_PERCENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }
    }
    else this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
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
            // console.log(id)
            // console.log(originalBrand)
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
    sessionStorage.setItem('step_3', JSON.stringify(this.brandTableDetails));
    this.totalPercent -= +brand.PercentAllocation;

    this.isStep3Valid = (this.totalPercent == 100) ? true : false;
    // Logic to add brand that is deleted to dropdown
    this.brandNames.push(this.deletedBrand.find(br => brand.BrandName == br.BrandName));
    this.brandNames.sort((brand1, brand2) => {
      return brand1.BrandName.localeCompare(brand2.BrandName);
    })


    this.slideKitDropDownOptions = [];
  }


  // Remuneration Calculation
  totalHours: any;
  remuneration: any;
  remunerationToCalculate: any;

  // get renumeration
  getRemuneration(speciality, tier) {
    if (Boolean(speciality) && Boolean(tier)) {
      this.utilityService.getFMV(speciality, tier).subscribe(
        res => {
          // console.log('from FMV calculation', res)
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
        // console.log('fcpa', res);
        if (res.fcpaValid == 'Yes') {
          this.showFcpaUpload = false;
          this.showFcpaDownload = true;
          this.fcpaDownloadLink = res.url;
        }
        else {
          this.showFcpaUpload = true;
          this.showFcpaDownload = false;
        }
      },
      err => {
        this.showFcpaUpload = true;
        this.showFcpaDownload = false;
      }
    )
  }

  //other hcp

  inviteesFromHCPMaster: any;
  private _filterHCPMasterInvitees(misCode: string) {
    // console.log("nam", Boolean(name))
    // console.log('miscode',misCode)
    let arr=[];
    if (Boolean(misCode)) {
      // console.log('invitee from hCP master',this.inviteesFromHCPMaster)
      this.inviteesFromHCPMaster.forEach(invitee => {
        // console.log('invitee',invitee)
        if (invitee['MisCode']) {
          // console.log('inotee mis coed',invitee['MisCode'])
         if(invitee['MisCode'].toString().includes(misCode.toLowerCase())){
          arr.push(invitee)
         }
        }
      });
      // console.log('arr',arr)
      return arr
    }
    // return this.inviteesFromHCPMaster.find(invitee => invitee['HCP Name'].includes(name))
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
  private _getFilteredOther(misCode: string) {
    if (Boolean(misCode)) {
      return this.inviteesFromHCPMaster.find(invitee => {
        if (invitee['MISCode']) {
          if (invitee.MISCode == misCode) return invitee
        }
      })
    }
  }

  private _checkingHcp(expenseTypes: any) {
    if (Boolean(expenseTypes)) {
      expenseTypes.forEach(type => {

        if (type.ExpenseType.indexOf('_') > -1) {

          if (type.ExpenseType.split('_')[0] == 'HCP Consultant') {
            // console.log('chcekec', type)
            this.expenseType.push(type)
          }
        }
      })
      // console.log('hello', this.expenseType)


    }
  }

  private expenseFromPrepopulate() {
    this.expenseSelectionForm.valueChanges.subscribe(changes => {
      // console.log('expense changes', changes);
      if (changes) {
        this.showRegistration = true;
        this._checkingAggregateSpend();

      }
      else {
        this.showRegistrationRemains = false;
        this.showRegistration = false;
      }

    })

  }

  private hcpExpense: number = 0;
  private LCAmount: number = 0;
  private AccomdationAmount: number = 0;
  private TravelAmountAir: number = 0;
  private TravelAmountTrain: number = 0;
  private InsuranceAmount: number = 0;

  private localFormChange() {
    this.localconveyanceForm.valueChanges.subscribe(changes => {
      if (changes) {
        this.totalexpenseCalculationForm.controls.totalexpense.setValue(this.localconveyanceForm.value.LCAmountIncludingTax + this.accomodationForm.value.AccomAmountIncludingTax + this.airTravelForm.value.AirAmountIncludingTax +
          this.trainTravelForm.value.TrainAmountIncludingTax + this.roadTravelForm.value.RoadAmountIncludingTax + this.medicalRegistationForm.value.MedicalRegistationIncludingTax)
      }
    })
  }
  private accomdationFormChange() {
    this.accomodationForm.valueChanges.subscribe(changes => {
      if (changes) {
        this.totalexpenseCalculationForm.controls.totalexpense.setValue(this.localconveyanceForm.value.LCAmountIncludingTax + this.accomodationForm.value.AccomAmountIncludingTax + this.airTravelForm.value.AirAmountIncludingTax +
          this.trainTravelForm.value.TrainAmountIncludingTax + this.roadTravelForm.value.RoadAmountIncludingTax + this.medicalRegistationForm.value.MedicalRegistationIncludingTax)
      }
    })
  }
  private airTravalFormChange() {
    this.airTravelForm.valueChanges.subscribe(changes => {
      if (changes) {
        this.totalexpenseCalculationForm.controls.totalexpense.setValue(this.localconveyanceForm.value.LCAmountIncludingTax + this.accomodationForm.value.AccomAmountIncludingTax + this.airTravelForm.value.AirAmountIncludingTax +
          this.trainTravelForm.value.TrainAmountIncludingTax + this.roadTravelForm.value.RoadAmountIncludingTax + this.medicalRegistationForm.value.MedicalRegistationIncludingTax)
      }
    })
  }
  private trainTravelFormChange() {
    this.trainTravelForm.valueChanges.subscribe(changes => {
      if (changes) {
        this.totalexpenseCalculationForm.controls.totalexpense.setValue(this.localconveyanceForm.value.LCAmountIncludingTax + this.accomodationForm.value.AccomAmountIncludingTax + this.airTravelForm.value.AirAmountIncludingTax +
          this.trainTravelForm.value.TrainAmountIncludingTax + this.roadTravelForm.value.RoadAmountIncludingTax + this.medicalRegistationForm.value.MedicalRegistationIncludingTax)
      }
    })
  }
  private roadFormChange() {
    this.roadTravelForm.valueChanges.subscribe(changes => {
      if (changes) {
        this.totalexpenseCalculationForm.controls.totalexpense.setValue(this.localconveyanceForm.value.LCAmountIncludingTax + this.accomodationForm.value.AccomAmountIncludingTax + this.airTravelForm.value.AirAmountIncludingTax +
          this.trainTravelForm.value.TrainAmountIncludingTax + this.roadTravelForm.value.RoadAmountIncludingTax + this.medicalRegistationForm.value.MedicalRegistationIncludingTax)
      }
    })
  }

  private medicalFormChange() {
    this.medicalRegistationForm.valueChanges.subscribe(changes => {
      if (changes) {
        this.totalexpenseCalculationForm.controls.totalexpense.setValue(this.localconveyanceForm.value.LCAmountIncludingTax + this.accomodationForm.value.AccomAmountIncludingTax + this.airTravelForm.value.AirAmountIncludingTax +
          this.trainTravelForm.value.TrainAmountIncludingTax + this.roadTravelForm.value.RoadAmountIncludingTax + this.medicalRegistationForm.value.MedicalRegistationIncludingTax)
      }
    })
  }



  public addExpense() {
    if (this.expenseSelectionForm.value.expenseType.includes('HCP Consultant_Local Conveyance')) {
      const LCexpenses = {
        Expense: 'HCP Consultant_Local Conveyance',
        RegstAmount: this.localconveyanceForm.value.LCAmountIncludingTax + '' || '',
        BTC_BTE: (this.localconveyanceForm.value.LCBTC) ? this.localconveyanceForm.value.LCBTC : this.localconveyanceForm.value.LCBTC,
        forHCPConsultants: true
      }
      console.log('LC expenses :', LCexpenses)
      if (LCexpenses['BTC_BTE'] == 'BTC') {
        this.TotalBTCSummary.push(LCexpenses);
        this.TotalBTCAmount += +LCexpenses.RegstAmount

      }
      else if (LCexpenses['BTC_BTE'] == 'BTE') {
        this.TotalBTESummary.push(LCexpenses)
        this.TotalBTEAmount += +LCexpenses.RegstAmount
      }
      this.TotalBudgetAmount = (this.TotalBTCAmount + this.TotalBTEAmount);
      this.expenseDetails.push(LCexpenses);
      let amountPerHCP: number = 0;
      this.expenseDetails.forEach(expense => amountPerHCP += expense.RegstAmount);
      this.expenseDetailsForPayLoad = this.expenseDetails;
      this.calculateTotalExpense();

    }
    if (this.expenseSelectionForm.value.expenseType.includes('HCP Consultant_Air travel')) {
      const Airexpenses = {
        Expense: 'HCP Consultant_Air travel',
        RegstAmount: this.airTravelForm.value.AirAmountIncludingTax + '' || '',
        BTC_BTE: (this.airTravelForm.value.AirBTC) ? this.airTravelForm.value.AirBTC : this.airTravelForm.value.AirBTC,
        forHCPConsultants: true
      }
      console.log('aair expense : ', Airexpenses);
      if (Airexpenses['BTC_BTE'] == 'BTC') {
        this.TotalBTCSummary.push(Airexpenses);
        this.TotalBTCAmount += +Airexpenses.RegstAmount

      }
      else if (Airexpenses['BTC_BTE'] == 'BTE') {
        this.TotalBTESummary.push(Airexpenses)
        this.TotalBTEAmount += +Airexpenses.RegstAmount
      }
      this.TotalBudgetAmount = (this.TotalBTCAmount + this.TotalBTEAmount);
      this.expenseDetails.push(Airexpenses);
      let amountPerHCP: number = 0;
      this.expenseDetails.forEach(expense => amountPerHCP += expense.RegstAmount);

      this.expenseDetailsForPayLoad = this.expenseDetails;
      this.calculateTotalExpense();

    }
    if (this.expenseSelectionForm.value.expenseType.includes('HCP Consultant_Train Travel')) {
      const Trainexpenses = {
        Expense: 'HCP Consultant_Train Travel',
        RegstAmount: this.trainTravelForm.value.TrainAmountIncludingTax + '' || '',
        BTC_BTE: (this.trainTravelForm.value.TrainBTC) ? this.trainTravelForm.value.TrainBTC : this.trainTravelForm.value.TrainBTC,
        forHCPConsultants: true
      }
      // console.log('taine expense ', Trainexpenses)
      if (Trainexpenses['BTC_BTE'] == 'BTC') {
        this.TotalBTCSummary.push(Trainexpenses);
        this.TotalBTCAmount += +Trainexpenses.RegstAmount

      }
      else if (Trainexpenses['BTC_BTE'] == 'BTE') {
        this.TotalBTESummary.push(Trainexpenses)
        this.TotalBTEAmount += +Trainexpenses.RegstAmount
      }
      this.TotalBudgetAmount = (this.TotalBTCAmount + this.TotalBTEAmount);
      this.expenseDetails.push(Trainexpenses);
      let amountPerHCP: number = 0;
      this.expenseDetails.forEach(expense => amountPerHCP += expense.RegstAmount);

      this.expenseDetailsForPayLoad = this.expenseDetails;
      this.calculateTotalExpense();

    }

    if (this.expenseSelectionForm.value.expenseType.includes('HCP Consultant_Scientific/Medical Conference Registration')) {
      const Medicalexpenses = {
        Expense: 'HCP Consultant_Scientific/Medical Conference Registration',
        RegstAmount: this.medicalRegistationForm.value.MedicalRegistationIncludingTax + '' || '',
        BTC_BTE: (this.medicalRegistationForm.value.MedicalRegistationBTC) ? this.medicalRegistationForm.value.MedicalRegistationBTC : this.medicalRegistationForm.value.MedicalRegistationBTC,
        forHCPConsultants: true
      }
      // console.log(' medical expensed', Medicalexpenses)
      if (Medicalexpenses['BTC_BTE'] == 'BTC') {
        this.TotalBTCSummary.push(Medicalexpenses);
        this.TotalBTCAmount += +Medicalexpenses.RegstAmount

      }
      else if (Medicalexpenses['BTC_BTE'] == 'BTE') {
        this.TotalBTESummary.push(Medicalexpenses)
        this.TotalBTEAmount += +Medicalexpenses.RegstAmount
      }
      this.TotalBudgetAmount = (this.TotalBTCAmount + this.TotalBTEAmount);
      this.expenseDetails.push(Medicalexpenses);
      let amountPerHCP: number = 0;
      this.expenseDetails.forEach(expense => amountPerHCP += expense.RegstAmount);
      this.expenseDetailsForPayLoad = this.expenseDetails;
      this.calculateTotalExpense();

    }

    if (this.expenseSelectionForm.value.expenseType.includes('HCP Consultant_Accomodation')) {
      const Accomexpenses = {
        Expense: 'HCP Consultant_Accomodation',
        RegstAmount: this.accomodationForm.value.AccomAmountIncludingTax + '' || '',
        BTC_BTE: (this.accomodationForm.value.AccomBTC) ? this.accomodationForm.value.AccomBTC : this.accomodationForm.value.AccomBTC,
        forHCPConsultants: true
      }
      // console.log(' accom expense', Accomexpenses)
      if (Accomexpenses['BTC_BTE'] == 'BTC') {
        this.TotalBTCSummary.push(Accomexpenses);
        this.TotalBTCAmount += +Accomexpenses.RegstAmount

      }
      else if (Accomexpenses['BTC_BTE'] == 'BTE') {
        this.TotalBTESummary.push(Accomexpenses)
        this.TotalBTEAmount += +Accomexpenses.RegstAmount
      }
      this.TotalBudgetAmount = (this.TotalBTCAmount + this.TotalBTEAmount);
      this.expenseDetails.push(Accomexpenses);
      let amountPerHCP: number = 0;
      this.expenseDetails.forEach(expense => amountPerHCP += expense.RegstAmount);

      this.expenseDetailsForPayLoad = this.expenseDetails;
      this.calculateTotalExpense();

    }
    if (this.expenseSelectionForm.value.expenseType.includes('HCP Consultant_Road Travel')) {
      const Roadexpenses = {
        Expense: 'HCP Consultant_Road Travel',
        RegstAmount: this.roadTravelForm.value.RoadAmountIncludingTax + '' || '',
        BTC_BTE: (this.roadTravelForm.value.RoadBTC) ? this.roadTravelForm.value.RoadBTC : this.roadTravelForm.value.RoadBTC,
        forHCPConsultants: true
      }
      // console.log('rwad exoennjs', Roadexpenses)
      if (Roadexpenses['BTC_BTE'] == 'BTC') {
        this.TotalBTCSummary.push(Roadexpenses);
        this.TotalBTCAmount += +Roadexpenses.RegstAmount

      }
      else if (Roadexpenses['BTC_BTE'] == 'BTE') {
        this.TotalBTESummary.push(Roadexpenses)
        this.TotalBTEAmount += +Roadexpenses.RegstAmount
      }
      this.TotalBudgetAmount = (this.TotalBTCAmount + this.TotalBTEAmount);
      this.expenseDetails.push(Roadexpenses);
      let amountPerHCP: number = 0;
      this.expenseDetails.forEach(expense => amountPerHCP += expense.RegstAmount);
      this.expenseDetailsForPayLoad = this.expenseDetails;
      this.calculateTotalExpense();

    }


    console.log(' summary for all expense ', this.expenseDetails);
    console.log(' summary of BTE', this.TotalBTESummary);
    console.log('btc summary ', this.TotalBTCSummary)

  }


  private calculateTotalExpense() {
    this.expenseDetails.forEach(expense => {

      // console.log('expenses type check :', expense)
      if (expense.Expense == 'HCP Consultant_Local Conveyance') {
        this.LCAmount = this.expenseSelectionForm.value.RegistrationAmountIxcludingTax;
      }
      else if (expense.Expense == 'HCP Consultant_Air travel') {
        this.TravelAmountAir = this.expenseSelectionForm.value.RegistrationAmountIxcludingTax;
      }
      else if (expense.Expense == 'HCP Consultant_Train Travel') {
        this.TravelAmountTrain = this.expenseSelectionForm.value.RegistrationAmountIxcludingTax;
      }
      else if (expense.Expense == 'HCP Consultant_Scientific/Medical Conference Registration') {
        this.hcpExpense = this.expenseSelectionForm.value.RegistrationAmountIxcludingTax;
      }
      else if (expense.Expense == 'HCP Consultant_Insurance') {
        this.InsuranceAmount = this.expenseSelectionForm.value.RegistrationAmountIxcludingTax
      }
      else if (expense.Expense == 'HCP Consultant_Accomodation') {
        this.AccomdationAmount = this.expenseSelectionForm.value.RegistrationAmountIxcludingTax
      }
    })

    // filter(expense=>expense.Expense === expenseType)
    // .reduce((total,expense) => total + +expense.Amount, 0);
  }

  openExpenseUpdateModal(expense: any, id: number) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: expense
    });
  }
  deleteExpenseModal(expense, id) {
    // delete this.brandTableDetails[id];
    this.expenseDetails.splice(id, 1);
  }


  // calcultion for total expense per HCP's
  totalAggregateSpendFromSheeet: number = 0;
  totalexpence: number = 0;
  showDeviation: boolean = false;
  private _checkingAggregateSpend() {
    this.totalAggregateSpendFromSheeet = this.aggregateAccomLCTravel;
    if (this.totalAggregateSpendFromSheeet + this.totalexpenseCalculationForm.value.totalexpense > 500000) {
      this.showDeviation = true;
      return false;

    }
    else {
      this.showDeviation = false;
      return true;

    }

  }


  // declearing the hcp details array
  hcptableDetails: any[] = [];
  addedInvitees: any[] = [];
  public addtoHcp() {
    let formValidity = 0;
    if (this.eventInitiation4.invalid || (this.showRationale && this.eventInitiation4Sub.invalid) || this.expenseSelectionForm.invalid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.showLocalConvenyenceForm && (!Boolean(this.localconveyanceForm.value.LCAmountExcludingTax) || !Boolean(this.localconveyanceForm.value.LCAmountIncludingTax))) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_DETAILS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.localconveyanceForm.value.LCAmountIncludingTax < this.localconveyanceForm.value.LCAmountExcludingTax) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.showAirTravelForm && (!Boolean(this.airTravelForm.value.AirAmountExcludingTax) || !Boolean(this.airTravelForm.value.AirAmountIncludingTax))) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_DETAILS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.airTravelForm.value.AirAmountIncludingTax < this.airTravelForm.value.AirAmountExcludingTax) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.showTrainTravelForm && (!Boolean(this.trainTravelForm.value.TrainAmountExcludingTax) || !Boolean(this.trainTravelForm.value.TrainAmountIncludingTax))) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_DETAILS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.trainTravelForm.value.TrainAmountIncludingTax < this.trainTravelForm.value.TrainAmountExcludingTax) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.showRoadTravelForm && (!Boolean(this.roadTravelForm.value.RoadAmountExcludingTax) || !Boolean(this.roadTravelForm.value.RoadAmountIncludingTax))) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_DETAILS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.roadTravelForm.value.RoadAmountIncludingTax < this.roadTravelForm.value.RoadAmountExcludingTax) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.showaccomdationForm && (!Boolean(this.accomodationForm.value.AccomAmountExcludingTax) || !Boolean(this.accomodationForm.value.AccomAmountIncludingTax))) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_DETAILS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.accomodationForm.value.AccomAmountIncludingTax < this.accomodationForm.value.AccomAmountExcludingTax) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.showmedicalRegistationForm && (!Boolean(this.medicalRegistationForm.value.MedicalRegistationExcludingTax) || !Boolean(this.medicalRegistationForm.value.MedicalRegistationIncludingTax))) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_DETAILS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (this.medicalRegistationForm.value.MedicalRegistationIncludingTax < this.medicalRegistationForm.value.MedicalRegistationExcludingTax) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (!this.totalexpenseCalculationForm.valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_DETAILS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (!this.finalForm.valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_DETAILS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (formValidity == 0) {

      this.addExpense();

      let budgetAmount: number = 0;
      this.expenseDetails.forEach(expense => budgetAmount += expense.RegstAmount);
      const hcpDetails = {
        HcpName: this.hcpName,
        MisCode: this.otherMisCode + '',
        HcpType: this.otherGoNonGo,
        TravelAmount: (this.airTravelForm.value.AirAmountIncludingTax + this.trainTravelForm.value.TrainAmountIncludingTax + this.roadTravelForm.value.RoadAmountIncludingTax > 0) ? (this.airTravelForm.value.AirAmountIncludingTax + this.trainTravelForm.value.TrainAmountIncludingTax + this.roadTravelForm.value.RoadAmountIncludingTax) + '' : 0 + '',
        AccomAmount: (this.accomodationForm.value.AccomAmountIncludingTax > 0) ? (this.accomodationForm.value.AccomAmountIncludingTax) + '': 0 + '',
        LcAmount: (this.localconveyanceForm.value.LCAmountIncludingTax > 0) ? (this.localconveyanceForm.value.LCAmountIncludingTax) + '' : 0 + '',
        RegistrationAmount: (this.medicalRegistationForm.value.MedicalRegistationIncludingTax > 0) ? (this.medicalRegistationForm.value.MedicalRegistationIncludingTax) + '' : 0 + '',
        BudgetAmount: budgetAmount + '',
        Legitimate: this.finalForm.value.legitimate,
        Objective: this.finalForm.value.Objective,
        Rationale: (this.eventInitiation4Sub.value.rationale) ? this.eventInitiation4Sub.value.rationale : ' ',
        Fcpadate: (this.eventInitiation4Sub.value.fcpaDate) ? this.eventInitiation4Sub.value.fcpaDate : ' ',
        Hcpupdate: true
      }
      console.log('table hcp details', hcpDetails);
      this.hcptableDetails.push(hcpDetails);

      // Logic to remove the invitee who was added
      let index: number = -1;

      for (let i = 0; i < this.inviteesFromHCPMaster.length; i++) {
        if (this.inviteesFromHCPMaster[i].MisCode == hcpDetails.MisCode) {
          // console.log(this.inviteesFromHCPMaster[i]);
          index = i;
        }
      }
      this.addedInvitees.push(this.inviteesFromHCPMaster[index]);
      this.inviteesFromHCPMaster.splice(index, 1);

      // console.log('after pushed', this.hcptableDetails);
      // this.travelForm.reset();
      // this.accomodationForm.reset();
      // this.localconveyanceForm.reset();
      this.expenseSelectionForm.reset();
      this.totalexpenseCalculationForm.reset();
      this.otherMisCode = '';
      this.otherGoNonGo = '';
      this.eventInitiation4.reset();
      this.finalForm.reset();
      this.eventInitiation4Sub.reset();
      this.expenseDetails = [];
      this.LCAmount = 0;
      this.AccomdationAmount = 0;
      this.TravelAmountAir = 0;
      this.TravelAmountTrain = 0;
      this.InsuranceAmount = 0;
      this.hcpExpense = 0;
      this.localconveyanceForm.reset();
      this.medicalRegistationForm.reset();
      this.accomodationForm.reset();
      this.airTravelForm.reset();
      this.trainTravelForm.reset();
      this.roadTravelForm.reset();
      this.showLocalConvenyenceForm = false;
      this.showmedicalRegistationForm = false;
      this.showAirTravelForm = false;
      this.showAirTravelForm = false;
      this.showRoadTravelForm = false;
      this.showaccomdationForm = false;




    }

  }
  openHcpUpdateModal(hcps: any, id: number) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      height: '500px',
      data: hcps
    });
  }
  deleteHcpModal(hcps, id) {
    // delete this.brandTableDetails[id];
    this.hcptableDetails.splice(id, 1);
  }


  private payload;
  public buildPayLoad(): boolean {

    if (!this.isStep1Valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    if (!this.isStep2Valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    if (!this.isStep3Valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if (this.isStep1Valid && this.isStep3Valid && this.isStep2Valid) {
      this.deviationFiles = [];
      this.otherFiles = [];


      if (Boolean(this.thirtyDaysDeviationFile)) this.deviationFiles.push(this.thirtyDaysDeviationFile);
      if (Boolean(this.sevenDaysDeviationFile)) this.deviationFiles.push(this.sevenDaysDeviationFile);
      if (Boolean(this.expenseDeviationFile)) this.deviationFiles.push(this.expenseDeviationFile);
      if (Boolean(this.fcpaUploadFile)) this.otherFiles.push(this.fcpaUploadFile);
      if (Boolean(this.brochureFile)) this.otherFiles.push(this.brochureFile);

      let roleDetails = this._authService.decodeToken();
      // console.log('role Details',roleDetails)

      let HCPConsultEventData = {
        EventTopic: this.eventInitiation2.value.eventTopic,
        EventType: this.eventDetails.find(event => event.EventTypeId == this.eventCode).EventType,
        EventDate: new Date(this.eventInitiation1.value.eventDate),
        EventEndDate: new Date(this.eventInitiation2.value.eventEndDate),
        StartTime: ' ',
        EndTime: ' ',
        VenueName: this.eventInitiation2.value.venueName,
        SponsorshipSocietyName: this.eventInitiation2.value.sponsorshipSocietyName,
        Country: this.eventInitiation2.value.country,
        IsAdvanceRequired: "Yes",
        EventOpen30days: (this.thirtyDaysDeviationFile) ? this.thirtyDaysDeviationFile : '',
        EventWithin7days: (this.sevenDaysDeviationFile) ? this.sevenDaysDeviationFile : '',
        BrochureFile: (this.brochureFile) ? this.brochureFile : ' ',
        FcpaFile: '',
        AggregateDeviationFiles: (this.expenseDeviationFile) ? this.expenseDeviationFile : '',
        AggregateDeviation: (this.expenseDeviationFile.length > 0) ? 'Yes' : 'No',
        Role: roleDetails.role,
        RBMorBM: roleDetails['RBM_BM'] || ' ',
        'Sales_Head': roleDetails.SalesHead,
        'Marketing_Head': roleDetails.MarketingHead || ' ',
        Finance: roleDetails.FinanceTreasury || ' ',
        InitiatorName: roleDetails.unique_name || ' ',
        'Initiator_Email': roleDetails.email || ' ',
        SalesCoordinatorEmail: roleDetails.SalesCoordinator || ' ',
        MedicalAffairsEmail: roleDetails.MedicalAffairsHead || ' ',
        ReportingManagerEmail: roleDetails.reportingmanager || ' ',
        FirstLevelEmail: roleDetails.firstLevelManager || ' ',
        FinanceAccountsEmail: roleDetails.FinanceAccounts || ' ',
        ComplianceEmail: roleDetails.ComplianceHead,
        EventOpen30dayscount: this.eventsWithin30Days.length + '' || ''


      }
      const HCPConsult = {
        HcpConsultant: HCPConsultEventData,
        BrandsList: this.brandTableDetails,
        ExpenseSheet: this.expenseDetailsForPayLoad,
        HCPList: this.hcptableDetails
      }
      this.payload = HCPConsult;
      // console.log('final payload', this.payload);
      return true;

    }
    else {
      return false;
    }

  }

  openPreview() {
    if (this.buildPayLoad()) {
      const dialogRef = this.dialog.open(ModalComponent, {
        width: '800px',
        height: '500px',
        data: this.payload

      })
    }
  }
  public submitForm() {
    if (this.buildPayLoad()) {
      this.loadingIndicator = true;

      this.utilityService.postHcpConsultant(this.payload).subscribe(
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

  // for BTE and BTC caluculation purpose 
  TotalBTESummary: any[] = [];
  TotalBTCSummary: any[] = [];
  TotalBTEAmount: number = 0;
  TotalBTCAmount: number = 0;
  TotalBudgetAmount: number = 0;





  // File Upload Check
  selectedFile: File | null;

  allowedTypesForHTML: string;
  private _allowedTypes: string[];

  private deviationFiles: any[] = [];
  private otherFiles: any[] = [];

  // Deviation Files:
  private thirtyDaysDeviationFile: string;
  private sevenDaysDeviationFile: string;
  private expenseDeviationFile: string[] = [];
  private fcpaUploadFile: string;
  private brochureFile: string;

  private allowedTypes = Config.FILE.ALLOWED;
  // file uploads
  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {

      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE) {

        const extension = file.name.split('.')[1];

        const reader = new FileReader();

        // console.log('extension', this._allowedTypes.includes(extension))
        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;


            if (type == 'deviation') {
              if (control == 'withIn30DaysDeviation') {
                this.thirtyDaysDeviationFile = base64String.split(',')[1];
              }
              else if (control == 'next7DaysDeviation') {
                this.sevenDaysDeviationFile = base64String.split(',')[1];
              }
              else if (control == 'expenseDevition') {
                this.expenseDeviationFile.push(base64String.split(',')[1]);
                // console.log('expense deviation',this.expenseDeviationFile)
              }
            }

            if (type == 'other') {

              if (control == 'uploadfcpa') {
                this.fcpaUploadFile = base64String.split(',')[1];
                // console.log(this.fcpaUploadFile)
              }
              else if (control == 'brochureupload') {
                this.brochureFile = base64String.split(',')[1];

              }

            }
          }

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

  public onExpenseSelect(value: string) {
    console.log(value);
    if (value.indexOf('HCP Consultant_Local Conveyance') > -1) {
      this.showLocalConvenyenceForm = true;
    }
    else {
      this.showLocalConvenyenceForm = false;
      this.localconveyanceForm.reset();
    }
    if (value.indexOf('HCP Consultant_Road Travel') > -1) {
      this.showRoadTravelForm = true;
    }
    else {
      this.showRoadTravelForm = false;
      this.roadTravelForm.reset();
    }
    if (value.indexOf('HCP Consultant_Air travel') > -1) {
      this.showAirTravelForm = true;
    }
    else {
      this.showAirTravelForm = false;
      this.airTravelForm.reset();
    }
    if (value.indexOf('HCP Consultant_Train Travel') > -1) {
      this.showTrainTravelForm = true;
    }
    else {
      this.showTrainTravelForm = false;
      this.trainTravelForm.reset();
    }
    if (value.indexOf('HCP Consultant_Accomodation') > -1) {
      this.showaccomdationForm = true;
    }
    else {
      this.showaccomdationForm = false;
      this.accomodationForm.reset();
    }
    if (value.indexOf('HCP Consultant_Scientific/Medical Conference Registration') > -1) {
      this.showmedicalRegistationForm = true;
    }
    else {
      this.showmedicalRegistationForm = false;
      this.medicalRegistationForm.reset();
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

      case 'brochureupload':
        this.finalForm.controls.brochureupload.reset();
        break;

      case 'uploadfcpa':
        this.eventInitiation4Sub.controls.uploadfcpa.reset();
        break;

      case 'expenseDevition':
        this.totalexpenseCalculationForm.controls.expenseDevition.reset();
        break;

    }
  }



}
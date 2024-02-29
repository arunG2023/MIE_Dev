import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Config } from 'src/app/shared/config/common-config';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { ModuleService } from 'src/app/shared/services/event-utility/module.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-medical-utility-request',
  templateUrl: './medical-utility-request.component.html',
  styleUrls: ['./medical-utility-request.component.css']
})
export class MedicalUtilityRequestComponent implements OnInit {
  // Spinner
  loadingIndicator: boolean = false;
  eventInitiation1: FormGroup;
  eventInitiation2: FormGroup;
  eventInitiation3: FormGroup;
  eventInitiation4: FormGroup;
  eventInitiation4Other: FormGroup;
  expenseSelectionForm: FormGroup;
  hpcExpenseSelectionForm: FormGroup;
  expenseTotalSelectionForm: FormGroup;
  // For Stepper Validation
  isLinear: boolean = true;
  orientation: string = 'horizontal';
  pageLoaded: boolean = false;

  today: string = new Date().toISOString().split('T')[0];

  // Upload Deviationn
  show30DaysUploaDeviation: boolean = false;
  show7DaysUploadDeviation: boolean = true;

  showScientificMedicalConference: boolean = false;
  showMedicalUtilityTypeOther: boolean = false;

  isStep1Valid: boolean = false;
  isStep2Valid: boolean = false;
  isStep3Valid: boolean = false;
  isStep4Valid: boolean = false;
  isStep7Valid: boolean = false;
  eventType: string = 'EVTMU';
  eventDate: string;

  // Event Initiation Form3 Control

  // Adding value to Brand Tables
  showBrandTable: boolean = false;
  brandTableDetails: any[] = [];

  medicalUtilityTypes: any;
  expenseTypeFiltered: any;
  medicalUtilityTypeName:string='';
  brandNames: any;

  // New Values:
  percentageAllocation: number = 0;
  projectId: string = '';
  eventCode: string = this.eventType;

  totalPercent: number = 0;

  // SideKit Selection:
  slideKitDetails: any;
  slideKitDropDown: any;
  slideKitDropDownOptions: any[] = [];

  slideKitTableInput: any[] = [];
  slideKitTableRadio: any[] = [];

  slideKitTableDetails: any[] = [];

  slideKitType: any;
  idShown: any[] = [];
  misCode: any;
  eventDetails: any;
  expenseType: any;

  // starthours = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];

  changestartTime: string;
  changeendTime: string;

  // File Upload Check
  selectedFile: File | null;
  private deviationFiles: any[] = [];
  private otherFiles: any[] = [];

  // Deviation Files:
  private thirtyDaysDeviationFile: string;
  private sevenDaysDeviationFile: string;

  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT
  public page: number = 1
  private previewData;
  brouchureupload: any;
  invoiceUpload: any;
  brandsAll:any;

  private _userDetails: any;
  constructor(
    private _snackBarService: SnackBarService,
    private utilityService: UtilityService,
    private dialog: MatDialog,
    private _moduleService: ModuleService,
    private _authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this._authService.getUserDetails$.subscribe(res => this._userDetails = res)
    this.eventInitiation1 = new FormGroup({
      withIn30DaysDeviation: new FormControl(''),
      eventDate: new FormControl({value:this.today,disabled: true}),
      next7DaysDeviation: new FormControl(''),
      loadingStep: new FormControl('5'),
    });

    this.eventInitiation2 = new FormGroup({
      medicalUtilityType: new FormControl('', [Validators.required]),
      medicalUtilityTypeOther: new FormControl('',),
      medicalUtilityDescription: new FormControl('',),
      eventTopic: new FormControl('',),
      eventDate1: new FormControl(''),
      eventValidFromDate: new FormControl(''),
      eventValidToDate: new FormControl(''),
      /*startHours: new FormControl('', [Validators.required]),
      startMinutes: new FormControl(''),
      startAMPM: new FormControl('', [Validators.required]),
      endHours: new FormControl('', [Validators.required]),
      endMinutes: new FormControl(''),
      EndAMPM: new FormControl('', [Validators.required]),*/
    });
    this.eventInitiation3 = new FormGroup({
      brandName: new FormControl('', [Validators.required]),
      percentageAllocation: new FormControl('', [Validators.required]),
      // projectId : new FormControl('', [Validators.required]),
      // eventCode : new FormControl('',[Validators.required])
    });

    this.eventInitiation4 = new FormGroup({
      brouchureupload: new FormControl('', [Validators.required]),

      invoiceUpload: new FormControl('', [Validators.required]),
    });

    this.expenseSelectionForm = new FormGroup({
      expenseType: new FormControl('', Validators.required),
      expenseAmount: new FormControl('', Validators.required),

      isExpenseBtc: new FormControl('', Validators.required),
      uploadExpenseDeviation: new FormControl(''),
    });

    this.hpcExpenseSelectionForm = new FormGroup({
      expenseType: new FormControl('', Validators.required),
      expenseAmountExcludingTax: new FormControl('', Validators.required),
      expenseAmountIncludingTax: new FormControl('', Validators.required),
      isExpenseBtc: new FormControl('', Validators.required),
    });  


    // Add custom validator to amountIncludingTax to ensure it's greater than or equal to amountExcludingTax
    this.hpcExpenseSelectionForm.get('expenseAmountIncludingTax').setValidators([
      Validators.required,
      Validators.min(0),
      this.amountIncludingTaxValidator(this.hpcExpenseSelectionForm.get('expenseAmountExcludingTax'))
    ]);


    this.expenseTotalSelectionForm = new FormGroup({
      calculateTotalExpense: new FormControl('Yes', Validators.required),
      totalAmountPerHCP: new FormControl('0', Validators.required),
      uploadHcpExpenseDeviation: new FormControl(),
      uploadHcpExpenseDeviationFile: new FormControl(),
    });      

    this.eventInitiation4Other = new FormGroup({
      otherName: new FormControl('', Validators.required),
      otherMisCode: new FormControl('', Validators.required),//('', MISValidator),
      //otherTire: new FormControl(''),
      rationale: new FormControl(''),
      FCPA: new FormControl(''),
      FCPAIssueDate: new FormControl(''),
      FCPAFile: new FormControl(''),
      writtenRequest: new FormControl(''),
      writtenRequestFile: new FormControl(''),
      hcpRequestDate: new FormControl('', Validators.required),
      invoiceBrochureQuotation: new FormControl(''),
      invoiceBrochureQuotationFile: new FormControl(''),
      legitimateNeed: new FormControl(''),
      objectiveCriteria: new FormControl(''),
      //medicalUtilityCostAmount: new FormControl(''),
      //tax: new FormControl(''),
    })

    this.loadingIndicator=true;
    // Get Invitees From HCP Master 
    this.utilityService.getEmployeesFromHCPMaster().subscribe(
      res => {
        this.inviteesFromHCPMaster = res;
        // console.log('Before SPlice', this.inviteesFromHCPMaster.length);
        this.inviteesFromHCPMaster.splice(1000,);
        // console.log('After SPlice', this.inviteesFromHCPMaster.length);
        // console.log(this.inviteesFromHCPMaster)        
        this.reduceLoading();
      }

    )

    this.getBrand();
    this.getEvent();
    this.getMedicalUtilityTypes();
    this.getExpense();
    this.event1FormPrepopulate();
    this._event2FormPrepopulate();
    this.event3FormPrepopulate();
    this.event4FormPrepopulate();
    this.event4FormOtherPrepopulate();
    this.utilityService.getEventListFromProcess().subscribe((res) => {
      this.filterEventsWithIn30Days(res);
    });
    // this.eventInitiation2.get('medicalUtilityType').valueChanges.subscribe((value) => {
    //     console.log(value.toString());
    //     if(value.toString().toLowerCase().includes('other'))
    //     {
    //           this.showMedicalUtilityTypeOther=true;
    //           this.eventInitiation2.get("medicalUtilityTypeOther").enable();
    //     }
    //     else
    //     {
    //           this.showMedicalUtilityTypeOther=false;
    //           this.eventInitiation2.get("medicalUtilityTypeOther").disable();
    //     }
    //     this.updateValidFromToValidator(value.toString());
    //     this.filterExpenses(value.toString());
    // });
  }


  // Filter Events within 30 days
  eventsWithin30Days: any[] = [];
  filterEventsWithIn30Days(eventList: any) {
    if (Boolean(eventList) && eventList.length > 0) {
      let row = 1
      eventList.forEach((event) => {
        let today: any = new Date();
        // console.log(event.EventDate)
        if(event['Initiator Email'] == this._userDetails.email ){
          if (event.EventDate) {
            let eventDate: any = new Date(event.EventDate);
            if (eventDate > today) {
              let Difference_In_Time = eventDate.getTime() - today.getTime();
  
              // To calculate the no. of days between two dates
              let Difference_In_Days = Math.round(
                Difference_In_Time / (1000 * 3600 * 24)
              );
  
              if (Difference_In_Days <= 45) {
                event.row = row++
                this.eventsWithin30Days.push(event);
              }
            }
            this.eventsWithin30Days.sort((list1,list2)=>{
              return list2['EventId/EventRequestId'].localeCompare(list1['EventId/EventRequestId']);
            })
            // console.log(new Date(event.EventDate))
  
            // console.log(event.EventDate)
          }
        }
       
      });
    }

    // this.pageLoaded = true
    if (this.eventsWithin30Days.length > 0) {
      this.show30DaysUploaDeviation = true;
      const withIn30DaysDeviation = this.eventInitiation1.get('withIn30DaysDeviation');
      withIn30DaysDeviation.setValidators([Validators.required]);
      withIn30DaysDeviation.updateValueAndValidity();
    }
    else
    {
      const withIn30DaysDeviation = this.eventInitiation1.get('withIn30DaysDeviation');
      withIn30DaysDeviation.setValidators(null);
      withIn30DaysDeviation.updateValueAndValidity();
    }
    // console.log(this.eventsWithin30Days);
  }

  public pageChanged(thisPage) {
    this.page = thisPage
  }
  // Custom validator function for amountIncludingTax
  amountIncludingTaxValidator(amountExcludingTaxControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const amountIncludingTax = control.value;
      const amountExcludingTax = amountExcludingTaxControl.value;

      if (amountIncludingTax !== null && amountExcludingTax !== null && amountIncludingTax < amountExcludingTax) {
        return { 'amountComparison': true };
      }

      return null;
    };
  }  
  updateValidFromToValidator(value: string) {
    const eventDateControl = this.eventInitiation2.get('eventDate1');
    const eventValidFromDateControl = this.eventInitiation2.get('eventValidFromDate');
    const eventValidToDateControl = this.eventInitiation2.get('eventValidToDate');
    if (value.toString().toLowerCase().includes('scientific/medical conference registration')) {
      this.showScientificMedicalConference=true;
      // If 'option1' is selected, make misCode required
      eventValidFromDateControl.setValidators([Validators.required]);
      eventValidToDateControl.setValidators([Validators.required]);
      eventDateControl.setValidators([Validators.required]);
    } else {
      this.showScientificMedicalConference=false;
      // If 'option1' is not selected, remove misCode required validator
      eventValidFromDateControl.setValidators(null);
      eventValidToDateControl.setValidators(null);
      eventDateControl.setValidators(null);
    }
    eventValidFromDateControl.updateValueAndValidity();
    eventValidToDateControl.updateValueAndValidity();
    eventDateControl.updateValueAndValidity();
  }

  getMedicalUtilityTypes() {
    this.utilityService.getMedicalUtilityTypes().subscribe(
      (res) => {
        this.medicalUtilityTypes = res;
        this.reduceLoading();
      },
      (err) => {
        this._snackBarService.showSnackBar(
          Config.MESSAGE.ERROR.SERVER_ERR,
          Config.SNACK_BAR.DELAY,
          Config.SNACK_BAR.ERROR
        );
      }
    );
  }
  reduceLoading()
  {
    let val = parseInt(this.eventInitiation1.get("loadingStep").value)-1;
    this.eventInitiation1.patchValue({loadingStep:val});
    if(parseInt(this.eventInitiation1.get("loadingStep").value)<=0)
    {
        this.loadingIndicator=false;
    }
    // console.log("reduceLoading",parseInt(this.eventInitiation1.get("loadingStep").value));
  }
  getBrand() {
    this.utilityService.getBrandNames().subscribe(
      (res) => {
        // console.log(res);
        //this.brandsAll=res;
        //const uniqueNamesSet = new Set(this.brandsAll.map(brand => brand.BrandName));
        //this.brandNames = Array.from(uniqueNamesSet).sort();
        //console.log(this.brandNames);
        this.brandNames = res;
        this.filterBrand();
        this.reduceLoading();

      },
      (err) => {
        this._snackBarService.showSnackBar(
          Config.MESSAGE.ERROR.SERVER_ERR,
          Config.SNACK_BAR.DELAY,
          Config.SNACK_BAR.ERROR
        );
      }
    );
  }  

  getEvent() {
    this.utilityService.getEventTypes().subscribe(
      (res) => {
        this.eventDetails = res;
        this.reduceLoading();
      },
      (err) => {
        this._snackBarService.showSnackBar(
          Config.MESSAGE.ERROR.SERVER_ERR,
          Config.SNACK_BAR.DELAY,
          Config.SNACK_BAR.ERROR
        );
      }
    );
  }

  getExpense() {
    // Get Expense Types
    this.utilityService
      .getExpenseType()
      .subscribe((res) => {
        this.expenseType = res;        
        this.reduceLoading();
    });
  }
  filterExpenses(value) {
    // console.log("filterExpenses",value);
      value = value.toLowerCase();
    this.expenseTypeFiltered = this.expenseType.filter((expense) => {
      let evalue=expense.ExpenseType.toLowerCase().replace(" amount","");
      // console.log([value,expense.ExpenseType.toLowerCase(),evalue,value.includes(evalue)])
      if(value.includes(evalue))
      {
          return true;
      }
      if(value.includes('others') && expense.ExpenseType=='Medical Utility - Others')
      {
          return true;
      }

      return false;
    });
  }
  filterBrand() {
    this.brandNames = this.brandNames.filter((brand) => {
      const name = brand.Name.split('_');
      return name[1] == 'Medical Utility';
    });
  }

  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    const allowedTypes = Config.FILE.ALLOWED;
    if (event.target.files.length > 0) {
      if (
        file.size >= Config.FILE.MIN_SIZE &&
        file.size < Config.FILE.MAX_SIZE
      ) {
        const extension = file.name.split('.')[1];
        const reader = new FileReader();

        if (allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;
            if (type == 'deviation') {
              if (control == 'withIn30DaysDeviation') {
                this.thirtyDaysDeviationFile = base64String.split(',')[1];
              } else if (control == 'next7DaysDeviation') {
                this.sevenDaysDeviationFile = base64String.split(',')[1];
              }
            }

            if (type == 'other') {
              if (control == 'brouchureupload') {
                this.brouchureupload = base64String.split(',')[1];
              }
              else if (control == 'invoiceUpload') {
                this.invoiceUpload = base64String.split(',')[1];
              }
            }
          };
        } else {
          this._snackBarService.showSnackBar(
            Config.MESSAGE.ERROR.FILE_TYPE,
            Config.SNACK_BAR.DELAY,
            Config.SNACK_BAR.ERROR
          );
        }
      } else {
        this._snackBarService.showSnackBar(
          Config.MESSAGE.ERROR.FILE_SIZE,
          Config.SNACK_BAR.DELAY,
          Config.SNACK_BAR.ERROR
        );
      }
    }
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
      //  console.log(this.brandTableDetails);
       this.brandTableDetails.forEach((brand) => {
          // console.log(brand,brand.PercentAllocation);
           this.totalPercent+=parseFloat(brand.PercentAllocation);
       });
       return this.totalPercent;
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

  slideKitBrandMatch() {
    let activeSlideKits: any[] = [];
    if (Boolean(this.slideKitDetails) && this.slideKitDetails.length > 0) {
      this.slideKitDetails.forEach((slideKit) => {
        if (slideKit.IsActive == 'Yes') {
          activeSlideKits.push(slideKit);
        }
      });
    }
    activeSlideKits.forEach((slideKit) => {
      this.brandTableDetails.forEach((brand) => {
        if (slideKit.BrandName == brand.BrandName) {
          this.slideKitDropDownOptions.push(slideKit);
        }
      });
    });
  }

  event1FormPrepopulate() {
    this.eventInitiation1.valueChanges.subscribe((changes) => {
      // console.log('event1FormPrepopulate',changes);
      if (changes.eventDate) {
        let today: any = new Date();
        let eventDate = new Date(changes.eventDate);

        let Difference_In_Time = eventDate.getTime() - today.getTime();

        let Difference_In_Days = Math.round(
          Difference_In_Time / (1000 * 3600 * 24)
        );

        this.eventDate = changes.eventDate;
        this.eventInitiation2.patchValue({eventDate1:this.eventDate});

        if (Difference_In_Days < 5) {
          this.show7DaysUploadDeviation = true;
        } else this.show7DaysUploadDeviation = false;
      }
      let step1Validity = 0;

      if (
        this.eventInitiation1.valid &&
        !this.show7DaysUploadDeviation &&
        !this.show30DaysUploaDeviation
      ) {
        step1Validity = 0;
      }
      if (
        this.show7DaysUploadDeviation &&
        !Boolean(this.eventInitiation1.value.next7DaysDeviation)
      ) {
        step1Validity++;
      }
      if (
        this.show30DaysUploaDeviation &&
        !Boolean(this.eventInitiation1.value.withIn30DaysDeviation)
      ) {
        step1Validity++;
      }
      if (step1Validity == 0) {
        this.isStep1Valid = true;
      } else {
        this.isStep1Valid = false;
      }
    });


      this.eventDate ='';
      let step1Validity = 0;
      if (
        this.eventInitiation1.valid &&
        !this.show7DaysUploadDeviation &&
        !this.show30DaysUploaDeviation
      ) {
        step1Validity = 0;
      }
      if (
        this.show7DaysUploadDeviation &&
        !Boolean(this.eventInitiation1.value.next7DaysDeviation)
      ) {
        step1Validity++;
      }
      if (
        this.show30DaysUploaDeviation &&
        !Boolean(this.eventInitiation1.value.withIn30DaysDeviation)
      ) {
        step1Validity++;
      }
      if (step1Validity == 0) {
        this.isStep1Valid = true;
      } else {
        this.isStep1Valid = false;
      }

  }
  // Step2 Functionalities
  filteredCity: any;
  showVendorFields: boolean = false;

  private _event2FormPrepopulate() {
    this.eventInitiation2.valueChanges.subscribe((changes) => {
      let startTime: string;
      let endTime: string;
      let isEndTimeValid;

      if(changes.medicalUtilityType){
        this.filterExpenses(changes.medicalUtilityType.toString());
      }
      // Condition CHanged For Button Enable
      if(changes.medicalUtilityType.toString().toLowerCase().includes('other')){
        this.showMedicalUtilityTypeOther = true;
      }
      else{
        this.showMedicalUtilityTypeOther = false;
      }

      if(changes.medicalUtilityType.toString().toLowerCase().includes('scientific/medical conference registration')){
        this.showScientificMedicalConference = true;
      }
      else{
        this.showScientificMedicalConference = false;
      }

      // Step2 Next Button Validation
      let step2Validity = 0;

      // console.log(this.eventInitiation2.value);
      // console.log(this.eventInitiation2.valid);
     if(this.eventInitiation2.invalid){
      step2Validity++;
     }

      if(this.showScientificMedicalConference && (!Boolean(this.eventInitiation2.value.eventValidFromDate) || !Boolean(this.eventInitiation2.value.eventValidToDate))){
        step2Validity++;
      }
      
      if(this.showMedicalUtilityTypeOther && !Boolean(this.eventInitiation2.value.medicalUtilityTypeOther)){
        step2Validity++;
      }

      // if (this.eventInitiation2.invalid) {
      //   step2Validity++;
      // }
      // if (!isEndTimeValid) {
      //   step2Validity++;
      // }
      // console.log(step2Validity);

      this.isStep2Valid = step2Validity == 0 ? true : false;
    });
  }

  // Start Time End Time Validation
  showEndTimeError: boolean = false;
  private _validateTime(start: string, end: string) {
    let startingTime = new Date(`${this.eventDate} ${start}`);
    let endingTime = new Date(`${this.eventDate} ${end}`);

    if (startingTime >= endingTime) {
      // console.log('invalid');
      this.showEndTimeError = true;
      return false;
    } else {
      this.showEndTimeError = false;
      return true;
    }
  }


  event3FormPrepopulate() {
    this.eventInitiation3.valueChanges.subscribe((changes) => {
      // console.log(changes);
      if (changes.brandName) {
        const selectedBrand = this._getBrandWithId(changes.brandName);
        this.projectId = selectedBrand.ProjectId;
        //this.percentageAllocation = selectedBrand['%Allocation'] * 100;
      }
      if (changes.percentageAllocation) {
        this.percentageAllocation = changes.percentageAllocation;
      }
    });
  }

  event4FormPrepopulate() {
    this.eventInitiation4.valueChanges.subscribe((changes) => {
      // console.log(changes);
      let step4Validity = 0;
      if (!this.eventInitiation4.valid) {
        step4Validity++;
      }
      if (!Boolean(this.eventInitiation4.value.brouchureupload)) {
        step4Validity++;
      }

      if (step4Validity == 0) {
        this.isStep4Valid = true;
      } else {
        this.isStep4Valid = false;
      }
    });
  }
  
  
  private _getBrandWithId(brandId) {
    return this.brandNames.find(brand => brand.BrandId == brandId)
  }

  showExpenseDeviation: boolean = false;

  expenseTableDetails: any = [];

  BTCTotalAmount: number = 0;
  BTETotalAmount: number = 0;
  BudgetAmount: number = 0;
  AggregateSpentonMedicalUtility: number = 0;

  addToExpenseTable() {
    if (this.expenseSelectionForm.valid) {
      if (this.expenseSelectionForm.value.isExpenseBtc == 'BTC') {
        this.BTCTotalAmount += this.expenseSelectionForm.value.expenseAmount;
      } else {
        this.BTETotalAmount += this.expenseSelectionForm.value.expenseAmount;
      }

      this.BudgetAmount = this.BTCTotalAmount + this.BTETotalAmount;

      const expense = {
        // For API
        EventId: ' ',
        BtcAmount: this.BTCTotalAmount + '',
        BteAmount: this.BTETotalAmount + '',
        BudgetAmount: this.BudgetAmount + '',

        // For Table
        Expense: this.expenseSelectionForm.value.expenseType,
        Amount: this.expenseSelectionForm.value.expenseAmount + '',
        AmountExcludingTax: ' ',
        BtcorBte: this.expenseSelectionForm.value.isExpenseBtc,
        stallexpense: true,
      };
      this.expenseTableDetails.push(expense);
      this.isStep7Valid = this.expenseTableDetails.length > 0 ? true : false;

      let advanceSelected = this.expenseSelectionForm.value.isAdvanceRequired;

      this.expenseSelectionForm.reset();
      this.expenseSelectionForm.controls.isAdvanceRequired.setValue(
        advanceSelected
      );
    } else {
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_ALL,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }
  }

  openExpenseUpdateModal(expense: any) {
    // console.log(expense);
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: expense,
    });

    dialogRef.afterClosed().subscribe((res) => {
      // console.log(res);
      if (res !== 'closed') {
      }
    });
  }

  deleteExpense(id: any) {
    this.expenseTableDetails.splice(id, 1);
    this.isStep7Valid = this.expenseTableDetails.length > 0 ? true : false;
  }

  buildPayload() {
    // console.log(
    //   this.isStep1Valid,
    //   this.isStep2Valid,
    //   this.isStep3Valid,
    //   this.isStep4Valid
    // );
/*    this.changestartTime =
      this.eventInitiation2.value.startHours +
      ':' +
      this.eventInitiation2.value.startMinutes +
      ':' +
      this.eventInitiation2.value.startAMPM +
      '';
    this.changeendTime =
      this.eventInitiation2.value.endHours +
      ':' +
      this.eventInitiation2.value.endMinutes +
      ':' +
      this.eventInitiation2.value.EndAMPM +
      '';
*/
    // console.log(this.changestartTime);
    // console.log(this.changeendTime);

    if (!this.isStep1Valid) {
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_ALL,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }

    if (!this.isStep2Valid) {
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_ALL,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }

    if (!this.isStep3Valid) {
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_ALL,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }

    if (!this.isStep4Valid) {
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_ALL,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }


    if (
      this.isStep1Valid &&
      this.isStep3Valid &&
      this.isStep2Valid &&
      this.isStep4Valid
    ) {
      this.deviationFiles = [];
      this.otherFiles = [];

      if (Boolean(this.thirtyDaysDeviationFile))
        this.deviationFiles.push(this.thirtyDaysDeviationFile);
      if (Boolean(this.sevenDaysDeviationFile))
        this.deviationFiles.push(this.sevenDaysDeviationFile);
        if (Boolean(this.brouchureupload)) this.otherFiles.push(this.brouchureupload);
        if (Boolean(this.invoiceUpload)) this.otherFiles.push(this.invoiceUpload);

      let medicalUtilityTypeValue= this.eventInitiation2.value.medicalUtilityType.toString();

      if(medicalUtilityTypeValue.toLowerCase().includes('others'))
      {
        medicalUtilityTypeValue = medicalUtilityTypeValue.replace("others","Other | "+this.eventInitiation2.value.medicalUtilityTypeOther);
        medicalUtilityTypeValue = medicalUtilityTypeValue.replace("Others","Other | "+this.eventInitiation2.value.medicalUtilityTypeOther);
      }

       let roleDetails = this._authService.decodeToken();

      let medicalUtilityEventData = {
        eventTopic: this.eventInitiation2.value.eventTopic,
        eventType: this.eventDetails.find(
          (event) => event.EventTypeId == this.eventCode
        ).EventType,
        eventDate: new Date(this.today),
        validFrom: (this.eventInitiation2.value.eventValidFromDate!=''?new Date(this.eventInitiation2.value.eventValidFromDate.toISOString()):""),
        validTill: (this.eventInitiation2.value.eventValidToDate!=''?new Date(this.eventInitiation2.value.eventValidToDate.toISOString()):""),
        medicalUtilityType: (medicalUtilityTypeValue),
        medicalUtilityDescription: this.eventInitiation2.value.medicalUtilityDescription,
        
        class_III_EventCode: "string",
        isAdvanceRequired: 'Yes',
        eventOpen30daysFile: (this.thirtyDaysDeviationFile?this.thirtyDaysDeviationFile:""),
        eventOpen30dayscount:(this.eventsWithin30Days?this.eventsWithin30Days.length+"":"0"),
        eventWithin7daysFile: (this.show7DaysUploadDeviation?this.sevenDaysDeviationFile:""),
        isDeviationUpload: (this.show30DaysUploaDeviation || this.show7DaysUploadDeviation) ? 'Yes' : 'No',
        totalBudgetAmount: this.BTETotalAmount+'' || '0',
        //withIn30DaysDeviation: this.thirtyDaysDeviationFile,

        rbMorBM:roleDetails['RBM_BM'] || ' ',
        sales_Head: roleDetails.SalesHead,
        marketing_Head: roleDetails.MarketingHead || ' ',
        medicalAffairsEmail: roleDetails.MedicalAffairsHead,
        reportingManagerEmail:  roleDetails.reportingmanager,
        firstLevelEmail:roleDetails.firstLevelManager,
        complianceEmail: roleDetails.ComplianceHead,
        financeTreasuryEmail: roleDetails.FinanceAccounts,
        financeAccountsEmail: roleDetails.FinanceAccounts,
        salesCoordinatorEmail: roleDetails.SalesCoordinator,        
        finance: roleDetails.FinanceTreasury || ' ',
        initiatorName:  roleDetails.unique_name || ' ',
        initiator_Email: roleDetails.email || ' ',
        role: roleDetails.role,
        uploadDeviationFile: this.uploadHcpExpenseDeviationFileString || '',
      };

      //const myClonedArray  = Object.assign([], myArray);
      var hpcTableDetailsLocal = Object.assign([], this.hpcTableDetails);
      hpcTableDetailsLocal.pop();


      var expenseData = [];

      var hcpForPayload = [];
      hpcTableDetailsLocal.forEach((hpcData) => {

        hcpForPayload.push({
          hcpName: hpcData.otherName+"",
          misCode: hpcData.otherMisCode+"",
          speciality: hpcData.speciality+"",
          tier: hpcData.tier+"",
          rationale: hpcData.rationale+"",
          hcpType: hpcData.otherGoNonGo+"",
          uploadFCPA: hpcData.FCPA+"",
          uploadWrittenRequestDate: hpcData.writtenRequest+"",
          hcpRequestDate: (hpcData.hcpRequestDate?hpcData.hcpRequestDate.toISOString():''),
          FCPAIssueDate: (hpcData.FCPAIssueDate?hpcData.FCPAIssueDate.toISOString():''),
          invoice_Brouchere_Quotation: hpcData.invoiceBrochureQuotation,
          //medicalUtilityCostAmount: hpcData.medicalUtilityCostAmount+"",
          legitimate: (hpcData.legitimateNeed?hpcData.legitimateNeed.join(","):""),
          objective: (hpcData.objectiveCriteria?hpcData.objectiveCriteria.join(","):""),
          medicalUtilityCostAmount:hpcData.medicalUtilityCostAmount+""

        });

        hpcData.hpcExpenses.forEach((expense) => {
          expenseData.push({
            misCode: hpcData.otherMisCode+"",
            expense: expense.Expense+"",
            btC_BTE: expense.BtcorBte+"",
            totalExpenseAmount: expense.Amount+"",
            totalExpenseAmountExcludingTax: expense.AmountExcludingTax+"",
          });
        });
      });


      const medicalUtility = {
        medicalUtilityData: medicalUtilityEventData,
        brandsList: this.brandTableDetails,
        expenseSheet: expenseData,
        hcpList: hcpForPayload,
      };

      this.previewData = medicalUtility;
      // console.log('preview Data', this.previewData);
      // console.log('hpcTableDetailsLocal', hpcTableDetailsLocal);
      // console.log('hpcTableDetails', this.hpcTableDetails);
      return true;
    }
  }

  submitForm() {


    if (this.buildPayload()) {
      this.loadingIndicator = true;

      console.log(this.previewData);
      
          //this.loadingIndicator = false;
      //return false;
      this.utilityService.postMedicalUtilityPreEventRequest(this.previewData).subscribe(
        (res) => {
          // console.log(res);
          if (res.message == ' Success!') {
            this.loadingIndicator = false;
            this._snackBarService.showSnackBar(
              Config.MESSAGE.SUCCESS.ADD_PRE_EVENT,
              Config.SNACK_BAR.DELAY,
              Config.SNACK_BAR.SUCCESS
            );
            this.router.navigate(['dashboard']);
          }
        },
        (err) => {
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar(
            Config.MESSAGE.ERROR.SERVER_ERR,
            Config.SNACK_BAR.DELAY,
            Config.SNACK_BAR.ERROR
          );
        }
      );
    }
    // console.log(this.brandTableDetails);
  }


  showRationale: boolean = false;

  //otherSpeciality: string = '';
  //otherTier: string = '';
  otherGoNonGo: string = '';
  otherMisCode: string = '';

  hideOtherMisCode: boolean = true;

  filteredOthers: any;
  filteredOthersByName: any;


  // show HCP Add Button
  showHCPAddButton : boolean = false;

  // For Aggregate Calculation
  aggregateHonorarium : number = 0;
  aggregateAccomLCTravel : number = 0;
  inviteesFromHCPMaster: any;
  showOthersForm: boolean = true;
  isAddNewHcpExpense: boolean = true;
  isAddNewHcpPanel: boolean = false;

  legitimatesNeed: any;
  objectiveCriterias: any;
  taxes: any;

   FCPAFileString: string = '';
   writtenRequestFileString: string = '';
   invoiceBrochureQuotationFileString: string = '';
   uploadHcpExpenseDeviationFileString: string = '';

   showTotalHcpExpenseDeviation: boolean = false;
   isSubmitMedicalUtility: boolean = false;
   showAggregateSpentonMedicalUtility: boolean = false;

   misCodeEditing: boolean = false;
   hpcnameEditing: boolean = false;

  event4FormOtherPrepopulate(){

    this.hpcExpenseSelectionForm.get('isExpenseBtc').disable();
    this.hpcExpenseSelectionForm.get('expenseAmountExcludingTax').disable();
    this.hpcExpenseSelectionForm.get('expenseAmountIncludingTax').disable();
    this.isAddNewHcpExpense=false;
    this.isAddNewHcpPanel=false;
    this.showTotalHcpExpenseDeviation=true;
    // this.showAggregateSpentonMedicalUtility=true;
    this.hpcExpenseSelectionForm.get('expenseType').valueChanges.subscribe(
      changes => {
          // console.log(changes)
          // console.log('changes',changes);
        if (changes) {
            if(changes!='')
            {
                this.hpcExpenseSelectionForm.get('isExpenseBtc').enable();
                this.hpcExpenseSelectionForm.get('expenseAmountExcludingTax').enable();
                this.hpcExpenseSelectionForm.get('expenseAmountIncludingTax').enable();
                //this.isAddNewHcpExpense=true;
            }
            else
            {
                this.hpcExpenseSelectionForm.get('isExpenseBtc').disable();
                this.hpcExpenseSelectionForm.get('expenseAmountExcludingTax').disable();
                this.hpcExpenseSelectionForm.get('expenseAmountIncludingTax').disable();
                //this.isAddNewHcpExpense=false;
            }
        }     
      });
      this.hpcExpenseSelectionForm.valueChanges.subscribe(
      changes => {
          // console.log(changes)
            const { isExpenseBtc, expenseAmountExcludingTax, expenseAmountIncludingTax } = this.hpcExpenseSelectionForm.value;
            if(expenseAmountExcludingTax && expenseAmountIncludingTax && isExpenseBtc && this.hpcExpenseSelectionForm.valid)
            {
                this.isAddNewHcpExpense=true;
            }
            else
            {
                this.isAddNewHcpExpense=false;
            }
      });
    this.expenseTotalSelectionForm.valueChanges.subscribe(
      changes => {

         // console.log('changes',this.eventInitiation4Other.valid,this.expenseTotalSelectionForm.valid,this.hpcTableDetails[this.hpcIndex]['hpcExpenses'],this.hpcIndex)
        if(this.eventInitiation4Other.valid && (this.expenseTotalSelectionForm.valid || this.hpcTableDetails[this.hpcIndex]['hpcExpenses'].length) )
        {
            this.isAddNewHcpPanel=true;
        }
        else
        {
            this.isAddNewHcpPanel=false;
        }
        // console.log('this.eventInitiation4Other.valid',this.eventInitiation4Other.valid,'this.expenseTotalSelectionForm.valid',this.expenseTotalSelectionForm.valid);
      });

        // Initialize the autocomplete for TrainerNames
        this.eventInitiation4Other.get('otherMisCode').valueChanges.subscribe((otherNameNew) => {

          // console.log('this.hpcnameEditing',this.hpcnameEditing)

          if(this.hpcnameEditing)
          {
            return;
          }          
          // console.log('otherNameNew',otherNameNew)
          this.filteredOthers = this._getFilteredOther(otherNameNew);

          // console.log('filteredOthers',this.filteredOthers);
          if (Boolean(this.filteredOthers)) {
            if (this.filteredOthers.length == 1) {
              this.hideOtherMisCode = true;
              this.hpcnameEditing=false;
              this.misCodeEditing=true;

              //this.otherSpeciality = this.filteredOthers[0].Speciality
              this.otherGoNonGo = this.filteredOthers[0]['HCP Type'];
              //this.otherTier = '';//this.filteredOthers[0]['Tier'];
              this.eventInitiation4Other.patchValue({otherName:this.filteredOthers[0].HCPName});
              this.aggregateHonorarium = this.filteredOthers[0]['Aggregate spend Honorarium'] || 0;
              this.aggregateAccomLCTravel = this.filteredOthers[0]['Aggregate spend on Accommodation'];
              this.AggregateSpentonMedicalUtility=(this.filteredOthers[0]['Aggregate Spent on Medical Utility']?parseInt(this.filteredOthers[0]['Aggregate Spent on Medical Utility']): 0);

              // if(this.AggregateSpentonMedicalUtility>100000)
              // {
              //   this.showAggregateSpentonMedicalUtility=true;
              // }
              // else
              // {
              //   this.showAggregateSpentonMedicalUtility=false;
              // }
              //this.getFCPADetails(this.otherMisCode + '');

              if(this.otherGoNonGo != 'NGO')
              {
                  this.eventInitiation4Other.get("rationale").enable();
                  this.eventInitiation4Other.get("FCPA").enable();
                  this.eventInitiation4Other.get("FCPAIssueDate").enable();
              }
              else
              {
                  this.eventInitiation4Other.get("rationale").disable();
                  this.eventInitiation4Other.get("FCPA").disable();
                  this.eventInitiation4Other.get("FCPAIssueDate").disable();
              }

            }
            else {
              this.hideOtherMisCode = false;
              this.filteredOthersByName = this.getHCPMasterInviteeWithName(otherNameNew);
              //this.otherSpeciality = '';
              this.otherGoNonGo = '';
              this.otherMisCode = '';
              //this.otherTier = '';
              this.eventInitiation4Other.get("rationale").disable();
              this.eventInitiation4Other.get("FCPA").disable();
              this.eventInitiation4Other.get("FCPAIssueDate").disable();
            }

            //  Logic to enable add speaker button
            if(this.filteredOthers.length == 0  && otherNameNew.length >= 5){
              this.showHCPAddButton = true;
            }
            else{
              this.showHCPAddButton = false;
            }
          }
      });    
        // Initialize the autocomplete for TrainerNames
        this.eventInitiation4Other.get('otherName').valueChanges.subscribe((otherNameNew) => {


          if(this.misCodeEditing)
          {
            return;
          }

          // console.log('otherNameNew',otherNameNew)
          this.filteredOthers = this.filterHCPMasterInvitees(otherNameNew);

          // console.log('filteredOthers',this.filteredOthers);
          if (Boolean(this.filteredOthers)) {
            if (this.filteredOthers.length == 1) {
              this.hideOtherMisCode = true;
              this.hpcnameEditing=true;
              this.misCodeEditing=false;

              //this.otherSpeciality = this.filteredOthers[0].Speciality
              this.otherGoNonGo = this.filteredOthers[0]['HCP Type'];
              //this.otherTier = '';//this.filteredOthers[0]['Tier'];
              this.otherMisCode = this.filteredOthers[0].MisCode;
              this.eventInitiation4Other.patchValue({otherMisCode:this.filteredOthers[0].MisCode});
              this.aggregateHonorarium = this.filteredOthers[0]['Aggregate spend Honorarium'] || 0;
              this.aggregateAccomLCTravel = this.filteredOthers[0]['Aggregate spend on Accommodation'];              
              this.AggregateSpentonMedicalUtility=this.filteredOthers[0]['Aggregate Spent on Medical Utility'] || 0;

              // if(this.AggregateSpentonMedicalUtility>100000)
              // {
              //   this.showAggregateSpentonMedicalUtility=true;
              // }
              // else
              // {
              //   this.showAggregateSpentonMedicalUtility=false;
              // }
              //this.getFCPADetails(this.otherMisCode + '');

              if(this.otherGoNonGo != 'NGO')
              {
                  this.eventInitiation4Other.get("rationale").enable();
                  this.eventInitiation4Other.get("FCPA").enable();
                  this.eventInitiation4Other.get("FCPAIssueDate").enable();
              }
              else
              {
                  this.eventInitiation4Other.get("rationale").disable();
                  this.eventInitiation4Other.get("FCPA").disable();
                  this.eventInitiation4Other.get("FCPAIssueDate").disable();
              }

            }
            else {
              this.hideOtherMisCode = false;
              this.filteredOthersByName = this.getHCPMasterInviteeWithName(otherNameNew);
              //this.otherSpeciality = '';
              this.otherGoNonGo = '';
              this.otherMisCode = '';
              //this.otherTier = '';
              this.eventInitiation4Other.get("rationale").disable();
              this.eventInitiation4Other.get("FCPA").disable();
              this.eventInitiation4Other.get("FCPAIssueDate").enable();
            }

            //  Logic to enable add speaker button
            if(this.filteredOthers.length == 0  && otherNameNew.length >= 5){
              this.showHCPAddButton = true;
            }
            else{
              this.showHCPAddButton = false;
            }
          }
      });
    this.eventInitiation4Other.valueChanges.subscribe(
      changes => {

        /*  console.log('changes',changes);
        if (changes.otherName) {
          console.log(changes.otherName)
          this.filteredOthers = this.filterHCPMasterInvitees(changes.otherName);

          console.log('filteredOthers',this.filteredOthers);
          if (Boolean(this.filteredOthers)) {
            if (this.filteredOthers.length == 1) {
              this.hideOtherMisCode = true;

              this.otherSpeciality = this.filteredOthers[0].Speciality
              this.otherGoNonGo = this.filteredOthers[0]['HCP Type'];
              this.otherTier = '';//this.filteredOthers[0]['Tier'];
              this.otherMisCode = this.filteredOthers[0].MisCode;
              this.aggregateHonorarium = this.filteredOthers[0]['Aggregate spend Honorarium'] || 0;
              this.aggregateAccomLCTravel = this.filteredOthers[0]['Aggregate spend on Accommodation'];
              //this.getFCPADetails(this.otherMisCode + '');

              if(this.otherGoNonGo != 'NGO')
              {
                  this.eventInitiation4Other.get("rationale").enable();
                  this.eventInitiation4Other.get("FCPA").enable();
              }
              else
              {
                  this.eventInitiation4Other.get("rationale").disable();
                  this.eventInitiation4Other.get("FCPA").disable();
              }

            }
            else {
              this.hideOtherMisCode = false;
              this.filteredOthersByName = this.getHCPMasterInviteeWithName(changes.otherName);
              this.otherSpeciality = '';
              this.otherGoNonGo = '';
              this.otherMisCode = '';
              this.otherTier = '';
              this.eventInitiation4Other.get("rationale").disable();
              this.eventInitiation4Other.get("FCPA").disable();
            }

          //  Logic to enable add speaker button
          if(this.filteredOthers.length == 0  && changes.otherName.length >= 5){
            this.showHCPAddButton = true;
          }
          else{
            this.showHCPAddButton = false;
          }
          }

          if (changes.otherMisCode) {
            if (!this.hideOtherMisCode) {
              console.log('this._getFilteredOther',this._getFilteredOther(changes.otherMisCode))
              const filteredOther = this._getFilteredOther(changes.otherMisCode);
              if (Boolean(filteredOther)) {
                this.otherSpeciality = filteredOther['Speciality']
                this.otherGoNonGo = filteredOther['HCP Type'];
                this.otherMisCode = changes.otherMisCode,
                this.aggregateHonorarium = filteredOther['Aggregate spend Honorarium'] || 0;
                this.aggregateAccomLCTravel = filteredOther['Aggregate spend on Accommodation'] || 0;

                this.getFCPADetails(this.otherMisCode + '');
              }

            }
          }

        }*/
        if (!this.otherGoNonGo.toLowerCase().includes('n')) {
          this.showRationale = true;
        }
        else this.showRationale = false;

        if(this.eventInitiation2.get('medicalUtilityType').value && this.eventInitiation2.get('medicalUtilityType').value.toString().toLowerCase().includes('other'))
        {
          this.medicalUtilityTypeName=this.eventInitiation2.get('medicalUtilityTypeOther').value.toString();
        }
        else 
        {
          this.medicalUtilityTypeName=this.eventInitiation2.get('medicalUtilityType').value.toString();
        }

        if(this.eventInitiation4Other.valid && this.expenseTotalSelectionForm.valid)
        {
            this.isAddNewHcpPanel=true;
        }
        else
        {
            this.isAddNewHcpPanel=false;
        }
        // console.log('this.eventInitiation4Other.valid',this.eventInitiation4Other.valid,'this.expenseTotalSelectionForm.valid',this.expenseTotalSelectionForm.valid);

      }
    );
      this.showOthersForm=true;

      this._getAllLegitimatesNeedData();
      this._getAllObjectiveCriteriasData();
      this.taxes=this._moduleService.getTaxes();

      this.addBlankHpc();
  }

  private _getAllLegitimatesNeedData() {
    this._moduleService.getAllLegitimatesNeedData()
      .subscribe(res => {
        // console.log(res);
        this.legitimatesNeed = res
      })
  }

  private _getAllObjectiveCriteriasData() {
    this._moduleService.getAllObjectiveCriteriasData()
      .subscribe(res => {
        // console.log(res);
        this.objectiveCriterias = res
      })
  }

  public addBlankHpc()
  {

      this.isAddNewHcpExpense=false;
      this.expenseTotalSelectionForm.get("totalAmountPerHCP").disable();
        const hpcDetail = {
          // For API
          EventId: ' ',
          otherName: '',
          otherMisCode: '',
          otherGoNonGo:'',
          rationale:'',
          FCPA: '',
          speciality:'',
          tier:'',
          FCPAFile: '',
          FCPAIssueDate:'',
          writtenRequest: '',
          writtenRequestFile:'',
          hcpRequestDate: '',
          invoiceBrochureQuotation: '',
          invoiceBrochureQuotationFile: '',
          legitimateNeed: '',
          objectiveCriteria: '',
          //medicalUtilityCostAmount: '',
          tax: '',
          calculateTotalExpense: '',
          totalAmountPerHCP: '',
          medicalUtilityCostAmount: '',
          uploadHcpExpenseDeviation: '',
          uploadHcpExpenseDeviationFile: '',
          hpcExpenses: [],
        };        
        this.hpcTableDetails.push(hpcDetail)
        // console.log('this.hpcTableDetails',this.hpcTableDetails);

        this.isAddNewHcpPanel=false;
        this.hpcIndex=this.hpcIndex+1;
  }
  public isHCPGo()
  {
      if(this.otherGoNonGo && this.otherGoNonGo=='GO')
      {
        return true;
      }

    return false;
  }
  private _getFilteredOther(misCode: string) {
    if (Boolean(misCode)) {
      return this.inviteesFromHCPMaster.filter(invitee => {
        if (invitee['MisCode']) {
          return invitee['MisCode'].toString().includes(misCode.toString().toLowerCase())
        }
      })
    }
  }



  filterHCPMasterInvitees(name: string) {
    // console.log("nam", Boolean(name))
    if (Boolean(name)) {
      return this.inviteesFromHCPMaster.filter(invitee => {
        if (invitee['HCPName']) {
          return invitee['HCPName'].toLowerCase().includes(name.toLowerCase())
        }
      });
    }
    // return this.inviteesFromHCPMaster.find(invitee => invitee['HCP Name'].includes(name))
  }

  getFilteredInvitee(misCode: string) {
    // console.log('mis', Boolean(misCode))
    if (Boolean(misCode)) {
      return this.inviteesFromHCPMaster.find(invitee => invitee['MISCode'] == misCode);
    }

  }

  getHCPMasterInviteeWithName(name: string) {
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
  // get FCPA details based on MIS Code
  showFcpaUpload : boolean = false;
  private getFCPADetails(misCode : string){
    /*console.log(misCode);
    this.utilityService.getFCPA(misCode).subscribe(
      res => {
        console.log('fcpa',res);
        if(res.fcpaValid == 'Yes'){
          this.showFcpaUpload = false;
        }
        else{
          this.showFcpaUpload = true;
        }
      }
    )*/
  }

  onFCPAFileSelected($event)
  {
        const fileInput = document.getElementById('FCPA') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.FCPAFileString = base64String.split(',')[1];
            // console.log(base64String);
            this.eventInitiation4Other.patchValue({
              FCPAFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }

  onWrittenRequestFileSelected($event)
  {

        const fileInput = document.getElementById('writtenRequest') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.writtenRequestFileString = base64String.split(',')[1];
            // console.log(base64String);
            this.eventInitiation4Other.patchValue({
              writtenRequestFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }
  onInvoiceBrochureQuotationSelected($event)
  {

        const fileInput = document.getElementById('invoiceBrochureQuotation') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.invoiceBrochureQuotationFileString = base64String.split(',')[1];
            // console.log(base64String);
            this.eventInitiation4Other.patchValue({
              invoiceBrochureQuotationFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }    

  onuploadHcpExpenseDeviationSelected($event)
  {

        const fileInput = document.getElementById('uploadHcpExpenseDeviation') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.uploadHcpExpenseDeviationFileString = base64String.split(',')[1];
            // console.log(base64String);
            this.expenseTotalSelectionForm.patchValue({
              uploadHcpExpenseDeviationFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }

  showHpcExpenseDeviation: boolean = false;
  hpcTableDetails: any = [];
  hpcExpenseTableDetails: any = [];

  private _aggregateLimitCheck: number = 0;

  hpcBTCTotalAmount: number = 0;
  hpcBTETotalAmount: number = 0;
  hpcBudgetAmount: number = 0;
  hpcIndex=-1;
  BTESummaryTable: any[] = [];
  BTCSummaryTable: any[] = [];
  addToHpcExpenseTable() {
    // console.log(this.AggregateSpentonMedicalUtility);
    // console.log(this.hpcExpenseSelectionForm.value.expenseAmountIncludingTax);

    this._aggregateLimitCheck += this.hpcExpenseSelectionForm.value.expenseAmountIncludingTax + this.AggregateSpentonMedicalUtility

    if(this._aggregateLimitCheck > 100000){
      this.showAggregateSpentonMedicalUtility = true;
    }
    else{
      this.showAggregateSpentonMedicalUtility = false
    }

    if (this.hpcExpenseSelectionForm.valid) {
      if (this.hpcExpenseSelectionForm.value.isExpenseBtc == 'BTC') {
        this.hpcBTCTotalAmount += this.hpcExpenseSelectionForm.value.expenseAmountIncludingTax;
      } else {
        this.hpcBTETotalAmount += this.hpcExpenseSelectionForm.value.expenseAmountIncludingTax;
      }

      this.hpcBudgetAmount = this.hpcBTCTotalAmount + this.hpcBTETotalAmount;

      const hpcExpense = {
        // For API
        EventId: ' ',
        hpcBtcAmount: this.hpcBTCTotalAmount + '',
        hpcBteAmount: this.hpcBTETotalAmount + '',
        hpcBudgetAmount: this.hpcBudgetAmount + '',

        // For Table
        Expense: this.hpcExpenseSelectionForm.value.expenseType,
        Amount: this.hpcExpenseSelectionForm.value.expenseAmountIncludingTax + '',
        AmountExcludingTax: this.hpcExpenseSelectionForm.value.expenseAmountExcludingTax,
        BtcorBte: this.hpcExpenseSelectionForm.value.isExpenseBtc,
        stallexpense: false,
      };
      // console.log('hcp expenses for bte or btc calculation',hpcExpense);

      // BTE summary 
      if(hpcExpense.BtcorBte == 'BTE'){
        this.BTESummaryTable.push(hpcExpense);
        // console.log('summary',this.BTESummaryTable);

      }
      else if(hpcExpense.BtcorBte == 'BTC'){
        this.BTCSummaryTable.push(hpcExpense);
      }
      // console.log(this.hpcIndex,this.hpcTableDetails[this.hpcIndex]);
      this.hpcExpenseTableDetails.push(hpcExpense);      
      this.hpcTableDetails[this.hpcIndex]['hpcExpenses'].push(hpcExpense);
      //this.isStep7Valid = this.expenseTableDetails.length > 0 ? true : false;

      //let advanceSelected = this.hpcExpenseSelectionForm.value.isAdvanceRequired;

      this.hpcExpenseSelectionForm.reset();
      this.hpcExpenseSelectionForm.get('isExpenseBtc').disable();
      this.hpcExpenseSelectionForm.get('expenseAmountExcludingTax').disable();
      this.hpcExpenseSelectionForm.get('expenseAmountIncludingTax').disable();
      this.isAddNewHcpExpense=false;

      let totalAmountPerHCP = this.getSumOfAmount(this.hpcTableDetails[this.hpcIndex]['hpcExpenses']);
      this.expenseTotalSelectionForm.get('totalAmountPerHCP').setValue(totalAmountPerHCP);
      this.hpcTableDetails[this.hpcIndex]['totalAmountPerHCP']=(totalAmountPerHCP);
      this.hpcTableDetails[this.hpcIndex]['medicalUtilityCostAmount']=(totalAmountPerHCP);
      //if(totalAmountPerHCP>)
      /*this.hpcExpenseSelectionForm.controls.isAdvanceRequired.setValue(
        advanceSelected
      );*/
      // console.log(this.hpcTableDetails);
    } else {
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_ALL,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }
  }

  addToHcpTable(){

      // console.log(this.uploadHcpExpenseDeviationFileString)
      if(this.showAggregateSpentonMedicalUtility && !Boolean(this.uploadHcpExpenseDeviationFileString)){
        this._snackBarService.showSnackBar(
          Config.MESSAGE.ERROR.FILE_UPLOAD,
          Config.SNACK_BAR.DELAY,
          Config.SNACK_BAR.ERROR
        );
      }
      else{
        this.hpcTableDetails[this.hpcIndex]['otherName']=this.eventInitiation4Other.get("otherName").value;
      this.hpcTableDetails[this.hpcIndex]['otherMisCode']=this.eventInitiation4Other.get("otherMisCode").value;
      this.hpcTableDetails[this.hpcIndex]['otherGoNonGo']=this.otherGoNonGo;
      this.hpcTableDetails[this.hpcIndex]['rationale']=this.eventInitiation4Other.get("rationale").value;
      this.hpcTableDetails[this.hpcIndex]['FCPA']=this.eventInitiation4Other.get("FCPAFile").value;
      this.hpcTableDetails[this.hpcIndex]['FCPAIssueDate']=this.eventInitiation4Other.get("FCPAIssueDate").value;
      //this.hpcTableDetails[this.hpcIndex]['FCPAFile']=this.eventInitiation4Other.get("FCPAFile").value;
      //this.hpcTableDetails[this.hpcIndex]['FCPAFileString']=this.eventInitiation4Other.get("FCPAFile").value;
      this.hpcTableDetails[this.hpcIndex]['writtenRequest']=this.eventInitiation4Other.get("writtenRequestFile").value;
      //this.hpcTableDetails[this.hpcIndex]['writtenRequestFile']=this.eventInitiation4Other.get("writtenRequestFile").value;
      //this.hpcTableDetails[this.hpcIndex]['writtenRequestFileString']=this.eventInitiation4Other.get("writtenRequestFile").value;
      this.hpcTableDetails[this.hpcIndex]['invoiceBrochureQuotation']=this.eventInitiation4Other.get("invoiceBrochureQuotationFile").value;
      //this.hpcTableDetails[this.hpcIndex]['invoiceBrochureQuotationFile']=this.eventInitiation4Other.get("invoiceBrochureQuotationFile").value;
      //this.hpcTableDetails[this.hpcIndex]['invoiceBrochureQuotationFileString']=this.eventInitiation4Other.get("invoiceBrochureQuotationFile").value;
      this.hpcTableDetails[this.hpcIndex]['hcpRequestDate']=this.eventInitiation4Other.get("hcpRequestDate").value;
      this.hpcTableDetails[this.hpcIndex]['legitimateNeed']=this.eventInitiation4Other.get("legitimateNeed").value;
      this.hpcTableDetails[this.hpcIndex]['objectiveCriteria']=this.eventInitiation4Other.get("objectiveCriteria").value;
      //this.hpcTableDetails[this.hpcIndex]['medicalUtilityCostAmount']=this.eventInitiation4Other.get("medicalUtilityCostAmount").value;
      //this.hpcTableDetails[this.hpcIndex]['tax']=this.eventInitiation4Other.get("tax").value;
      this.hpcTableDetails[this.hpcIndex]['calculateTotalExpense']=this.expenseTotalSelectionForm.get("calculateTotalExpense").value;
      this.hpcTableDetails[this.hpcIndex]['totalAmountPerHCP']=this.expenseTotalSelectionForm.get("totalAmountPerHCP").value;
      this.hpcTableDetails[this.hpcIndex]['medicalUtilityCostAmount']=this.expenseTotalSelectionForm.get("totalAmountPerHCP").value;
      this.hpcTableDetails[this.hpcIndex]['uploadHcpExpenseDeviation']=this.expenseTotalSelectionForm.get("uploadHcpExpenseDeviationFile").value;
      //this.hpcTableDetails[this.hpcIndex]['uploadHcpExpenseDeviationFile']=this.expenseTotalSelectionForm.get("uploadHcpExpenseDeviationFile").value;
      //this.hpcTableDetails[this.hpcIndex]['uploadHcpExpenseDeviationString']=this.expenseTotalSelectionForm.get("uploadHcpExpenseDeviationFile").value;

      //this.hpcTableDetails[this.hpcIndex]['speciality']=(this.otherSpeciality?this.otherSpeciality:"");
      //this.hpcTableDetails[this.hpcIndex]['tier']=(this.otherTier?this.otherTier:"");
      this.otherMisCode='';
      this.otherGoNonGo='';
      this.eventInitiation4Other.reset();
      this.expenseTotalSelectionForm.reset();
      this.isSubmitMedicalUtility=true;
      this.addBlankHpc();
      this.isStep4Valid=true;
      this.showAggregateSpentonMedicalUtility = false;
      this._aggregateLimitCheck = 0;
      }
  }

  openMaters(data) {
      const currentRoute =
        environment.APPLICATION_URL + '/#/master-list/hcp-master';
      window.open(currentRoute, '_blank');
  }
  getSumOfAmount(expenseArray:any): number {
    return expenseArray.reduce((sum, expense) => sum + parseFloat(expense.Amount), 0);
  }

  openHpcExpenseUpdateModal(hpcExpense: any) {
    // console.log(hpcExpense);
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: hpcExpense,
    });

    dialogRef.afterClosed().subscribe((res) => {
      // console.log(res);
      if (res !== 'closed') {
      }
    });
  }

  deleteHpcExpense(id: any) {
    this.hpcExpenseTableDetails.splice(id, 1);
    //this.isStep7Valid = this.expenseTableDetails.length > 0 ? true : false;
  }



}

  function MISValidator(control: AbstractControl): ValidationErrors | null {
    // console.log(control.value)
    if (control.value && control.value.startsWith('MS')) {
      // console.log("No")
      return null
    }
    else {
      // console.log("Yes")
      return { customError: true }
    }
  }  
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';

@Component({
  selector: 'app-stall-fabrication-event-request',
  templateUrl: './stall-fabrication-event-request.component.html',
  styleUrls: ['./stall-fabrication-event-request.component.css'],
})
export class StallFabricationEventRequestComponent implements OnInit {
  // Spinner
  loadingIndicator: boolean = false;
  eventInitiation1: FormGroup;
  eventInitiation2: FormGroup;
  eventInitiation3: FormGroup;
  eventInitiation4: FormGroup;
  expenseSelectionForm: FormGroup;
  // For Stepper Validation
  isLinear: boolean = true;
  orientation: string = 'horizontal';
  pageLoaded: boolean = false;

  today: string = new Date().toISOString().split('T')[0];

  // Upload Deviationn
  show30DaysUploaDeviation: boolean = false;
  show7DaysUploadDeviation: boolean = false;

  isStep1Valid: boolean = false;
  isStep2Valid: boolean = false;
  isStep3Valid: boolean = false;
  isStep4Valid: boolean = false;
  isStep7Valid: boolean = false;
  eventType: string = 'EVTC1';
  eventDate: string;

  // Event Initiation Form3 Control

  // Adding value to Brand Tables
  showBrandTable: boolean = false;
  brandTableDetails: any[] = [];

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

  private previewData;
  brouchureupload: any;
  invoiceUpload: any;
  brouchureFiles: string
  invoiceFiles: string

//** declearing the varible for summary purpose */
  BTCSummaryTable: any[] = [];
  BTESummaryTable: any[] = [];
  showexpensetax: boolean = false;
  constructor(
    private _snackBarService: SnackBarService,
    private utilityService: UtilityService,
    private dialog: MatDialog,
    private router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this._get30DaysPendingEventsCount();

    this.eventInitiation1 = new FormGroup({
      withIn30DaysDeviation: new FormControl(''),
      eventDate: new FormControl('', Validators.required),
      next7DaysDeviation: new FormControl(''),
    });

    this.eventInitiation2 = new FormGroup({
      startDate: new FormControl({value:'',disabled: true}, ),
      endDate: new FormControl('',Validators.required),
      eventTopic: new FormControl('', [Validators.required]),
      // startHours: new FormControl('', [Validators.required]),
      // startMinutes: new FormControl(''),
      // startAMPM: new FormControl('', [Validators.required]),
      // endHours: new FormControl('', [Validators.required]),
      // endMinutes: new FormControl(''),
      // EndAMPM: new FormControl('', [Validators.required]),
      class3EventCode: new FormControl('', Validators.required)
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
      expenseAmount: new FormControl('',),
      isExcludingTax: new FormControl('', ),
      isExpenseBtc: new FormControl('', Validators.required),
      uploadExpenseDeviation: new FormControl(''),

      
      localBTC: new FormControl('', ),
      localAmountWithoutTax: new FormControl(0),
      localAmountWithTax: new FormControl(0)
    });

    this.getBrand();
    this.getEvent();
    this.getExpense();
    this.event1FormPrepopulate();
    this._event2FormPrepopulate();
    this.event3FormPrepopulate();
    this.event4FormPrepopulate();
    this.expenseTaxFormPrePopulate()
  }

  getBrand() {
    this.utilityService.getBrandNames().subscribe(
      (res) => {
        this.brandNames = res;
        this.filterBrand();
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
       
        let expenseArr: any = res;
        let resArr: any[] = [];

        expenseArr.forEach(expense => {
          let allowedEvents = expense['Event Type'].split(',');

          allowedEvents.forEach(event => {
            if(event.trim() == 'Stall Fabrication'){
              // console.log(expense)
              resArr.push(expense);
            }
          })
        })
       this.expenseType = resArr;
      //  console.log(this.expenseType)
      });
  }

  filterBrand() {
    this.brandNames = this.brandNames.filter((brand) => {
      const name = brand.Name.split('_');
      return name[1] == 'Class I';
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
            // console.log(base64String,'base64String',base64String.split(',')[1])
            if (type == 'deviation') {
              if (control == 'withIn30DaysDeviation') {
                // this.thirtyDaysDeviationFile = base64String.split(',')[1];
                this.thirtyDaysDeviationFile = base64String.split(',')[1];
              } else if (control == 'next7DaysDeviation') {
                // this.thirtyDaysDeviationFile = base64String.split(',')[1];
                this.sevenDaysDeviationFile = base64String.split(',')[1];
              }
            }

            if (type == 'other') {
              if (control == 'brouchureupload') {
                // this.brouchureupload = base64String.split(',')[1];
                this.brouchureupload = base64String.split(',')[1];
              }
              else if (control == 'invoiceUpload') {
                // this.invoiceUpload = base64String.split(',')[1];
                this.invoiceUpload = base64String.split(',')[1]
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
      // console.log(this.totalPercent, 'this.totalPercent');
      if (this.totalPercent <= 100) {
        const brand = {
          BrandName: this.brandNames.find(
            (brand) => brand.BrandId == this.eventInitiation3.value.brandName
          ).BrandName,
          PercentAllocation: this.percentageAllocation + '',
          ProjectId: this.projectId,
        }; 
        this.brandTableDetails.push(brand);
        let index : number = -1;
        for(let i=0;i<this.brandNames.length;i++){
          if(this.brandNames[i].BrandName == brand.BrandName){
            index = i;
          }
        }
        this.deletedBrand.push(this.brandNames[index]);
        this.brandNames.splice(index,1);
        this.isStep3Valid = (this.totalPercent == 100) ? true : false;
        this.showBrandTable = true;
        this.eventInitiation3.reset();
        this.percentageAllocation = 0;
        this.projectId = '';
        this.eventCode = this.eventType;
        this.slideKitBrandMatch();
      } else {
        this.totalPercent=this.getTotalPercent();
        this.totalPercent = this.totalPercent - this.percentageAllocation;
        this._snackBarService.showSnackBar(
          Config.MESSAGE.ERROR.BRAND_PERCENT,
          Config.SNACK_BAR.DELAY,
          Config.SNACK_BAR.ERROR
        );
      }
    } else
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_ALL,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
  }
  getTotalPercent()
  {
      this.totalPercent=0;
      // console.log(this.brandTableDetails);
      this.brandTableDetails.forEach((brand) => {
        //  console.log(brand,brand.PercentAllocation);
          this.totalPercent+=parseFloat(brand.PercentAllocation);
      });
      return this.totalPercent;
  }

  openBrandUpdateModal(brand: any, id: number) {
    const originalBrand = brand.PercentAllocation;
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: brand,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== 'closed') {
        let updatedPercent: number = 0;
        this.brandTableDetails.forEach((brand) => {
          updatedPercent += parseInt(brand.PercentAllocation);
        });
        if (updatedPercent > 100) {
          this.brandTableDetails[id].PercentAllocation = originalBrand;
          this._snackBarService.showSnackBar(
            Config.MESSAGE.ERROR.BRAND_PERCENT,
            Config.SNACK_BAR.DELAY,
            Config.SNACK_BAR.ERROR
          );
        } else {
          this.totalPercent = updatedPercent;
          this.isStep3Valid = this.totalPercent == 100 ? true : false;

          // console.log('total', this.totalPercent);
        }
      }
    });
  }

  deleteBrand(brand, id) {
    // delete this.brandTableDetails[id];
    this.brandTableDetails.splice(id, 1);
    this.totalPercent -= +brand.PercentAllocation;

    this.isStep3Valid = (this.totalPercent == 100) ? true : false;

    // Logic to add brand that is deleted to dropdown
    this.brandNames.push(this.deletedBrand.find(br => brand.BrandName == br.BrandName));
    this.brandNames.sort((brand1, brand2) => {
      return  brand1.BrandName.localeCompare(brand2.BrandName);
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
    // this.eventInitiation1.valueChanges.subscribe((changes) => {
    //   if (changes.eventDate) {
    //     let today: any = new Date();
    //     let eventDate = new Date(changes.eventDate);

    //     let Difference_In_Time = eventDate.getTime() - today.getTime();

    //     let Difference_In_Days = Math.round(
    //       Difference_In_Time / (1000 * 3600 * 24)
    //     );

    //     this.eventDate = changes.eventDate;

    //     if (Difference_In_Days <= 7) {
    //       this.show7DaysUploadDeviation = true;
    //     } else this.show7DaysUploadDeviation = false;
    //   }
    //   let step1Validity = 0;

    //   if (
    //     this.eventInitiation1.valid &&
    //     !this.show7DaysUploadDeviation &&
    //     !this.show30DaysUploaDeviation
    //   ) {
    //     step1Validity = 0;
    //   }
    //   else{
    //     step1Validity++;
    //   }
    //   if (
    //     this.show7DaysUploadDeviation &&
    //     !Boolean(this.eventInitiation1.value.next7DaysDeviation)
    //   ) {
    //     step1Validity++;
    //   }
    //   if (
    //     this.show30DaysUploaDeviation &&
    //     !Boolean(this.eventInitiation1.value.withIn30DaysDeviation)
    //   ) {
    //     step1Validity++;
    //   }
    //   if (step1Validity == 0) {
    //     this.isStep1Valid = true;
    //   } else {
    //     this.isStep1Valid = false;
    //   }
    // });
    
    this.eventInitiation1.valueChanges.subscribe((changes) => {
      if (changes.eventDate) {
        // console.log(changes.eventDate)
        let today: any = new Date();
        let eventDate = new Date(changes.eventDate);

        let Difference_In_Time = eventDate.getTime() - today.getTime();

        let Difference_In_Days = Math.round(
          Difference_In_Time / (1000 * 3600 * 24)
        );

        this.eventDate = changes.eventDate;

        if (Difference_In_Days < 5) {
          this.show7DaysUploadDeviation = true;
        } else this.show7DaysUploadDeviation = false;
      }

      // console.log(this.eventInitiation1.value.withIn30DaysDeviation)
      let step1Validity = 0;

      if (!this.eventInitiation1.valid) {
        step1Validity++;

        // if(this.show7DaysUploadDeviation && Boolean(this.eventInitiation1.value.next7DaysDeviation)){
        //   this.isStep1Valid = true;
        // }
      }
      if (
        this.show7DaysUploadDeviation &&
        !Boolean(this.eventInitiation1.value.next7DaysDeviation)
      ) {
        // this.isStep1Valid = true;
        step1Validity++;
      }
      if (
        this.show30DaysUploaDeviation &&
        !Boolean(this.eventInitiation1.value.withIn30DaysDeviation)
      ) {
        // this.isStep1Valid = true;
        step1Validity++;
      }

      if (step1Validity == 0) {
        this.isStep1Valid = true;
      } else {
        this.isStep1Valid = false;
      }
      // else this.isStep1Valid = false;
    });
  }
  // Step2 Functionalities
  filteredCity: any;
  showVendorFields: boolean = false;

  private _event2FormPrepopulate() {
    this.eventInitiation2.valueChanges.subscribe((changes) => {
      let startTime: string;
      let endTime: string;
      let isEndTimeValid;

      if (
        Boolean(this.eventDate) &&
        Boolean(changes.startHours) &&
        Boolean(changes.startMinutes) &&
        Boolean(changes.startAMPM)
      ) {
        startTime =
          changes.startHours +
          ':' +
          changes.startMinutes +
          ' ' +
          changes.startAMPM;
      }
      if (
        Boolean(this.eventDate) &&
        Boolean(startTime) &&
        Boolean(changes.endHours) &&
        Boolean(changes.endMinutes) &&
        Boolean(changes.endAMPM)
      ) {
        endTime =
          changes.endHours + ':' + changes.endMinutes + ' ' + changes.endAMPM;
        isEndTimeValid = this._validateTime(startTime, endTime);
      }

      // Step2 Next Button Validation
      let step2Validity = 0;

      // console.log(this.eventInitiation2.value);
      // console.log(this.eventInitiation2.valid)
      if (this.eventInitiation2.valid) {
        step2Validity = 0;
      }
      else{
        step2Validity++;
      }

      // if (this.eventInitiation2.invalid) {
      //   step2Validity++;
      // }
      // if (!isEndTimeValid) {
      //   step2Validity++;
      // }
      // console.log(step2Validity);

      this.isStep2Valid = (step2Validity == 0)? true : false;
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
    return this.brandNames.find((brand) => brand.BrandId == brandId);
  }

  showExpenseDeviation: boolean = false;

  expenseTableDetails: any = [];

  BTCTotalAmount: number = 0;
  BTETotalAmount: number = 0;
  BudgetAmount: number = 0;

  addToExpenseTable() {
    // console.log(this.expenseSelectionForm.valid);
    // console.log(this.expenseSelectionForm.value)
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

    this._updateBTEBTESummary();
  }


  buildPayload() {
    // console.log(
    //   this.isStep1Valid,
    //   this.isStep2Valid,
    //   this.isStep3Valid,
    //   this.isStep4Valid,
    //   this.isStep7Valid
    // );
    this.changestartTime =
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

    if (!this.isStep7Valid) {
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
      this.isStep4Valid &&
      this.isStep7Valid
    ) {
      this.deviationFiles = [];
      this.otherFiles = [];
      let roleDetails = this._authService.decodeToken();

      // if (Boolean(this.thirtyDaysDeviationFile))
      //   this.deviationFiles.push(this.thirtyDaysDeviationFile);
      // if (Boolean(this.sevenDaysDeviationFile))
      //   this.deviationFiles.push(this.sevenDaysDeviationFile);
      //   if (Boolean(this.brouchureupload)) 
      //   this.brouchureFiles.push(this.brouchureupload);
      //   if (Boolean(this.invoiceUpload)) this.invoiceFiles.push(this.invoiceUpload);
      let class1EventData = {
        // EventTopic: this.eventInitiation2.value.eventTopic,
        // EventType: this.eventDetails.find(
        //   (event) => event.EventTypeId == this.eventCode
        // ).EventType,
        // EventDate: new Date(this.eventInitiation1.value.eventDate),
        // StartTime: this.changestartTime,
        // EndTime: this.changeendTime,
        // BrandName: ' ',
        // PercentAllocation: ' ',
        // ProjectId: ' ',
        // HcpRole: ' ',
       
        // EventOpen30days: this.show30DaysUploaDeviation ? 'Yes' : 'No',
        // EventWithin7days: this.show7DaysUploadDeviation ? 'Yes' : 'No',
        // FB_Expense_Excluding_Tax: " ",
        // RBMorBM: 'sabri.s@vsaasglobal.com',
        // Sales_Head: 'sabri.s@vsaasglobal.com',
        // Marketing_Head: 'sabri.s@vsaasglobal.com',
        // Finance: 'sabri.s@vsaasglobal.com',
        // InitiatorName: 'Sabri',
        // Initiator_Email: 'sabri.s@vsaasglobal.com',
        // Files: this.otherFiles,
       

        
        EventType: "Stall Fabrication",
        EventName: this.eventInitiation2.value.eventTopic,
        EventDate: new Date(this.eventInitiation1.value.eventDate),
        StartTime: this.changestartTime,
        EndTime: this.changeendTime,
        Class_III_EventCode: "string",
        RbMorBM: roleDetails['RBM_BM'] || ' ',
        Sales_Head: roleDetails.SalesHead,
        Marketing_Head:  roleDetails.MarketingHead || ' ',
        Finance:  roleDetails.FinanceTreasury || ' ',
        InitiatorName: roleDetails.unique_name || ' ',
        Initiator_Email: roleDetails.email || ' ',
        Role: roleDetails.role,
        TotalBudgetAmount: this.BTETotalAmount+'',
        EventWithin7daysUpload: this.sevenDaysDeviationFile || '',
        TableContainsDataUpload: this.thirtyDaysDeviationFile || '',
        EventBrouchereUpload: this.brouchureupload,
        Invoice_QuotationUpload: this.invoiceUpload,
        IsDeviationUpload: this.show30DaysUploaDeviation ? 'Yes' : 'No',
        IsAdvanceRequired: 'Yes',
        MedicalAffairsEmail: roleDetails.MedicalAffairsHead,
        ReportingManagerEmail: roleDetails.reportingmanager,
        FirstLevelEmail: roleDetails.firstLevelManager,
        ComplianceEmail: roleDetails.ComplianceHead,
        FinanceAccountsEmail: roleDetails.FinanceAccounts,
        SalesCoordinatorEmail: roleDetails.SalesCoordinator,
        StartDate: new Date(this.eventInitiation1.value.eventDate),
        EndDate : new Date(this.eventInitiation2.value.endDate),
        EventOpen30dayscount:this._event30DaysCount+''
      
      };
      const class1 = {
        StallFabrication: class1EventData,
        EventBrands: this.brandTableDetails,
        ExpenseSheets: this.expenseTableDetails, 
      };

      this.previewData = class1;
      // console.log('preview Data', this.previewData);
      return true;
    }
  }

  submitForm() {
    if (this.buildPayload()) {
      this.loadingIndicator = true;

      console.log(this.previewData);
      this.utilityService.stallfabPreEventRequest(this.previewData).subscribe(
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

  //expense code jasper

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
          // if (changes.expenseAmount / this.inviteeTableDetails.length > 1500) {
          //   this.showExpenseDeviation = true;
          // } else {
          //   this.showExpenseDeviation = false;
          // }
        } else {
          this.showExpenseDeviation = false;
        }
      }
    });
  }


  addToExpensetaxTable(){
    // console.log(this.expenseSelectionForm.valid);
    // console.log(this.expenseSelectionForm.value);
    let formValidity: number = 0;

    if(this.expenseSelectionForm.invalid){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++
    }

    if(this.expenseSelectionForm.value.localAmountWithTax == 0 || this.expenseSelectionForm.value.localAmountWithoutTax == 0 || 
      !Boolean(this.expenseSelectionForm.value.localAmountWithoutTax) || !Boolean(this.expenseSelectionForm.value.localAmountWithTax)){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++
    }

    if(this.expenseSelectionForm.value.localAmountWithTax < this.expenseSelectionForm.value.localAmountWithoutTax){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++
    }

    if(formValidity == 0){
      if (this.expenseSelectionForm.value.isExpenseBtc == 'BTC') {
        this.BTCTotalAmount += this.expenseSelectionForm.value.localAmountWithTax;
      } else {
        this.BTETotalAmount += this.expenseSelectionForm.value.localAmountWithTax;
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
        Amount: this.expenseSelectionForm.value.localAmountWithTax + '',
        AmountExcludingTax: this.expenseSelectionForm.value.localAmountWithoutTax+'' || '0',
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
            includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
            AmountExcludingTax :  (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
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
            includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
            AmountExcludingTax :  (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
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
      this.showexpensetax = false;
    }
      
  }


  private _updateBTEBTESummary(){
    this.BTCSummaryTable = [];
    this.BTESummaryTable = [];
    this.BTETotalAmount = 0;
    this.BTCTotalAmount = 0;

    this.expenseTableDetails.forEach(expense => {
      if(expense.BtcorBte == 'BTC'){
        if(this.BTCSummaryTable.length > 0){
          let expenseSummaryBTC = this.BTCSummaryTable.find(summ => summ.expense == expense.Expense);
          if (!expenseSummaryBTC) {
            this.BTCSummaryTable.push({
              expense: expense.Expense,
              amount: +expense.Amount,
              includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
              AmountExcludingTax :  (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
            })
          }
          else {
            expenseSummaryBTC.amount += +expense.Amount;
          }
        }
        else{
          this.BTCSummaryTable.push({
            expense: expense.Expense,
            amount: +expense.Amount,
            includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
            AmountExcludingTax :  (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
          })
        }

        this.BTCTotalAmount += +expense.Amount;
      }


      if(expense.BtcorBte == 'BTE'){
        if(this.BTESummaryTable.length > 0){
          let expenseSummaryBTE = this.BTESummaryTable.find(summ => summ.expense == expense.Expense);
          if (!expenseSummaryBTE) {
            this.BTESummaryTable.push({
              expense: expense.Expense,
              amount: +expense.Amount,
              includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
              AmountExcludingTax :  (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
            })
          }
          else {
            expenseSummaryBTE.amount += +expense.Amount;
          }
        }
        else{
          this.BTESummaryTable.push({
            expense: expense.Expense,
            amount: +expense.Amount,
            includingTax: (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
            AmountExcludingTax :  (expense.AmountExcludingTax == 'Yes') ? 'No' : 'Yes',
          })
        }
        this.BTETotalAmount += +expense.Amount;
      }
    })


  }


  private _event30DaysCount: number = 0;
  private _get30DaysPendingEventsCount(){
    this.utilityService.data.subscribe(data => {
      if(data.from == 'eventPending' && data.for == 'open30DaysCount'){
        this._event30DaysCount = data.eventOpen30DaysCount;
        if(this._event30DaysCount > 0){
          this.show30DaysUploaDeviation = true;
        }
        else{
          this.show30DaysUploaDeviation = false;
        }
      }
    })
  }
}

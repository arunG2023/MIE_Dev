import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-stall-posteventsettlement',
  templateUrl: './stall-posteventsettlement.component.html',
  styleUrls: ['./stall-posteventsettlement.component.css'],
})
export class StallPosteventsettlementComponent implements OnInit {
  after30DaysList: any[] = [];
  show30DaysUpload: boolean = false;
  loadingIndicator: boolean = false;
  allEventList: any;
  invitees: any;
  // allEventList: any;
  expenseType: any;
  expense: any;
  showEventSelect: boolean = false;
  expenseTabelDetails: any[] = [];
  selectedEventDetails: any;
  showPostEventContent: boolean = false;

  expenseFinalAmount: any;
  amountTableFinalAmount: any = 0;

  // Advance Table:
  advancedUtilized: any = 0;
  amountToPayForInitiator: any = 0;
  amountToPayForCompany: any = 0;

  deviationForm: FormGroup;

  // File Handling:
  private _allowedTypes: string[];
  allowedTypesForHTML: string;

  thirtyDaysUploadFile: string;

  deviationFiles: string[] = [];

  photosFiles: string;
  attendenceFiles: string;

  InvoiceFiles: string;
  otherFiles = [];

  private _userDetails: any;

  constructor(
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private _snackBarService: SnackBarService,
    private _router: Router,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this._authService.getUserDetails$.subscribe(value => this._userDetails = value)

    this.showEventSelect = true;
    this.deviationForm = new FormGroup({
      thirtyDaysUpload: new FormControl(''),
      uploadPhotos: new FormControl(''),
      uploadAttendence: new FormControl('')
    });

    this.geteventtype();
    this.getExpense();
    // Getting allowed file types
    this._allowedTypes = Config.FILE.ALLOWED;
    // Generating Allowed types for HTML
    this._allowedTypes.forEach((type) => {
      this.allowedTypesForHTML += '.' + type + ', ';
    });
  }

  geteventtype() {
    this.loadingIndicator = true
    this.utilityService.getEventListFromProcess().subscribe((res) => {
      this.loadingIndicator = false;
      this.allEventList = res;
      this.after30Days(this.allEventList);
    });
  }

  getExpense() {
  
    this.utilityService.getPostEventExpense().subscribe((res) => {
      
      this.expense = res;
    });
  }

  getTotalExpenseFinalAmount(eventId) {
    this.utilityService.getTotalExpenseFinalAmount(eventId).subscribe(
      (res) => {
        if (Boolean(res)) {
          this.expenseFinalAmount = res;
          this.amountTableFinalAmount += res;
          this.advancedUtilized += res;
        }
      },
      (err) => {
        this.expenseFinalAmount = 0;
        this.amountTableFinalAmount += 0;
        this.advancedUtilized += 0;
      }
    );
  }

  private after30Days(eventList: any) {
    if (Boolean(eventList)) {
      eventList.forEach((event) => {
        if (event.EventType == 'Stall Fabrication') {
          if(event['Initiator Email'] == this._userDetails.email){
            if(event['Event Request Status'] == 'Approved' || event['Event Request Status'] == 'Advance Approved'){
              if (Boolean(event.EventDate)) {
                let today: any = new Date();
                let eventDate = new Date(event.EventDate);
                let Difference_In_Time = eventDate.getTime() - today.getTime();
                let Difference_In_Days = Math.round(
                  Difference_In_Time / (1000 * 3600 * 24)
                );
    
                // if (Difference_In_Days <  -30) {
                this.after30DaysList.push(event);
                // }
              }
            }
          }
          
        }
      });
    }
    if (this.after30Days.length > 0) {
      this.show30DaysUpload = true;
    } else {
      this.show30DaysUpload = false;
    }
  }

  onEventSelect(eventId: any) {
    this.getTotalExpenseFinalAmount(eventId);
    this.showPostEventContent = true;
    this.expenseTabelDetails = [];
    this.selectedEventDetails = this.allEventList.find((eve) => {
      return eve['EventId/EventRequestId'] == eventId;
    });

    this.expense.forEach((exp) => {
      if (exp['EventId/EventRequestID'] == eventId) {
        const expense = {
          Amount: exp.Amount.toString(),
          Expense: exp.Expense,
          AmountExcludingTax: exp['AmountExcludingTax?'] || ' ',
          BtcorBte: exp['BTC/BTE'],

          // For API
          EventId: ' ',
          BtcAmount: ' ',
          BteAmount: ' ',
          BudgetAmount: ' ',
        };
        this.expenseTabelDetails.push(expense);
      }
    });

    this._filterBTEBTE(this.expenseTabelDetails)
  }
  expenseTableActualAmountInput: any[] = [];
  onExpenseActualAmountChanges(value: any, id: any) {
    if (Boolean(value)) {
      this.advancedUtilized = this.amountTableFinalAmount;
      this.advancedUtilized -= this.expenseTabelDetails[id].Amount;
      this.advancedUtilized += value;
      this.calculateAdvanceTableDetails();
    } else {
      // this.calculateAdvanceIfNoChange();
    }
  }

  private calculateAdvanceTableDetails() {
    if (this.amountTableFinalAmount < this.advancedUtilized) {
      this.amountToPayForCompany = 0;
      this.amountToPayForInitiator =
        this.advancedUtilized - this.amountTableFinalAmount;
    }

    if (this.amountTableFinalAmount > this.advancedUtilized) {
      this.amountToPayForInitiator = 0;
      this.amountToPayForCompany =
        this.amountTableFinalAmount - this.advancedUtilized;
    }

    if (this.amountTableFinalAmount == this.advancedUtilized) {
      this.amountToPayForCompany = 0;
      this.amountToPayForInitiator = 0;
    }
  }

  private _btcInvoiceFiles: string[] = [];
  private _bteInvoiceFile: string;
  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {
      if (
        file.size >= Config.FILE.MIN_SIZE &&
        file.size < Config.FILE.MAX_SIZE
      ) {
        const extension = file.name.split('.')[1];
        const reader = new FileReader();
        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;

            if (type == 'deviation') {
              if (control == 'thirtyDaysUpload') {
                // this.thirtyDaysUploadFile = base64String.split(',')[1];
                this.thirtyDaysUploadFile = "30DaysDeviationFile"+'.'+extension+':'+base64String.split(',')[1];
              }
            }
            if (type == 'other') {
              // if (control == 'attendanceUpload') {
              //   this.attendanceUploadFile = base64String.split(',')[1];
              // }
              if (control == 'uploadPhotos') {
                this.photosFiles = file.name+':'+base64String.split(',')[1];
              }
              if (control == 'uploadAttendence') {
                // this.attendenceFiles = base64String.split(',')[1];
                this.attendenceFiles = file.name+':'+base64String.split(',')[1]
              }
              if (control == 'InvoiceUpload') {
                // this.InvoiceFiles = base64String.split(',')[1];
                this.InvoiceFiles = file.name+':'+base64String.split(',')[1]
              }

              if(control == 'btcInvoice'){
                this._btcInvoiceFiles.push(file.name+':'+base64String.split(',')[1]);
              
              }
              if(control == 'bteInvoice'){
                // this._bteInvoiceFile = base64String.split(',')[1];
                this._bteInvoiceFile = file.name+':'+base64String.split(',')[1];
               
              }
            }
          };
        } else {
          this._snackBarService.showSnackBar(
            Config.MESSAGE.ERROR.FILE_TYPE,
            Config.SNACK_BAR.DELAY,
            Config.SNACK_BAR.ERROR
          );
          this._resetControl(control);
        }
      } else {
        this._snackBarService.showSnackBar(
          Config.MESSAGE.ERROR.FILE_SIZE,
          Config.SNACK_BAR.DELAY,
          Config.SNACK_BAR.ERROR
        );
        this._resetControl(control);
      }
    }
  }

  private _resetControl(control: string) {
    switch (control) {
      case 'thirtyDaysUpload':
        this.deviationForm.controls.thirtyDaysUpload.reset();
        break;

      case 'uploadPhotos':
        this.deviationForm.controls.uploadPhotos.reset();
        break;

      case 'uploadAttendence':
        this.deviationForm.controls.uploadAttendence.reset();

      // case 'inviteeDeviation':
      //   this.uploadForm.controls.inviteeDeviation.reset();
      //   break;
    }
  }

  postEventSubmit() {
    let formValidity = 0;

    if (
      this.show30DaysUpload &&
      !Boolean(this.deviationForm.value.thirtyDaysUpload) || !Boolean(this.deviationForm.value.uploadAttendence)) {
      formValidity++;
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILE_UPLOAD,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }

    if (formValidity == 0) {
      this.loadingIndicator = true;
      if (Boolean(this.thirtyDaysUploadFile)) {
        this.deviationFiles.push(this.thirtyDaysUploadFile);
      }
      if (Boolean(this.photosFiles)) {
        this.otherFiles.push(this.photosFiles);
      }
      if (Boolean(this.attendenceFiles)) {
        this.otherFiles.push(this.attendenceFiles)
      }
      // if (Boolean(this.InvoiceFiles)) {
      //   this.otherFiles.push(this.InvoiceFiles);
      // }

      let roleDetails = this._authService.decodeToken();

      const apiPayload = {
        // EventSettlement : eventSettlementInfo,
        Invitee: [
          {
            IinviteeName: ' ',
            MisCode: ' ',
            LocalConveyance: ' ',
            btcorBte: ' ',
            lcAmount: ' ',
          },
        ],
        ExpenseSheets: this.expenseTabelDetails,
        EventId: this.selectedEventDetails['EventId/EventRequestId'],
        EventTopic: this.selectedEventDetails['Event Topic'],
        EventType: this.selectedEventDetails.EventType,
        EventDate: this.selectedEventDetails.EventDate,
        StartTime: this.selectedEventDetails.StartTime || ' ',
        InitiatorName:
          this.selectedEventDetails.InitiatorName || roleDetails['unique_name'],
        EndTime: this.selectedEventDetails.EndTime || ' ',
        VenueName: ' ',
        State: ' ',
        City: ' ',
        Attended: ' ',
        InviteesParticipated: ' ',
        ExpenseParticipated: ' ',
        TotalExpense: ` Total Expense :${this.expenseFinalAmount} | Total Budget For The Event : ${this.amountTableFinalAmount}`,
        Advance: `Advance Provided : ${this.amountTableFinalAmount} | Advance Utilized For Event : ${this.advancedUtilized} | Pay Back Amount To Company  : ${this.amountToPayForCompany} | Additional Amount Needed To Pay For Initiator : ${this.amountToPayForInitiator}`,
        Brands: this.selectedEventDetails.Brands,
        SlideKits: ' ',
        Panalists: ' ',
        InitiatorEmail: roleDetails.email || ' ',
        RbMorBM: roleDetails['RBM_BM'] || ' ',
        SalesHead: roleDetails.SalesHead || ' ',
        MarkeringHead: roleDetails.MarketingHead || ' ',
        Compliance: 'sabri.s@vsaasglobal.com',
        FinanceAccounts: roleDetails.FinanceAccounts || ' ',
        FinanceTreasury: roleDetails.FinanceTreasury || ' ',
        MedicalAffairsHead:
          roleDetails.MedicalAffairsHead || 'sabri.s@vsaasglobal.com',
        FinanceHead: roleDetails.FinanceAccounts || 'sabri.s@vsaasglobal.com',
        EventOpen30Days: this.show30DaysUpload ? 'Yes' : 'No',
        EventLessThan5Days: 'Yes',
        PostEventSubmitted: 'Yes',
        IsAdvanceRequired: this.selectedEventDetails.IsAdvanceRequired || 'No',
        TotalInvitees: '' || '0',
        TotalAttendees: '' || '0',
        TotalTravelAndAccomodationSpend: (this.selectedEventDetails['Total Travel & Accomodation Spend'])? this.selectedEventDetails['Total Travel & Accomodation Spend'] + '' : '0',
        TotalHonorariumSpend: (this.selectedEventDetails['Total Honorarium Spend'])? this.selectedEventDetails['Total Honorarium Spend'] + '' : '0',
        TotalSpend: (this.selectedEventDetails['Total Spend'])? this.selectedEventDetails['Total Spend'] + '' : '0',
        TotalLocalConveyance: (this.selectedEventDetails['Total Local Conveyance'])? this.selectedEventDetails['Total Local Conveyance'] + '' : '0',
        TotalTravelSpend: (this.selectedEventDetails['Total Travel Spend'])? this.selectedEventDetails['Total Travel Spend'] + '' : '0',
        TotalAccomodationSpend: (this.selectedEventDetails['Total Accomodation Spend'])? this.selectedEventDetails['Total Accomodation Spend'] + '' : '0',
        TotalExpenses: (this.selectedEventDetails['Total Expense'])? this.selectedEventDetails['Total Expense'] + "" : "0",
        IsDeviationUpload: (this.show30DaysUpload)? 'Yes' : 'No',
        DeviationFiles: this.deviationFiles,
        Files: this.otherFiles,
        TotalActuals: this.amountTableFinalAmount  + '' ,
        AdvanceUtilizedForEvents: this.advancedUtilized + '',
        PayBackAmountToCompany: this.amountToPayForCompany + '',
        AdditionalAmountNeededToPayForInitiator: this.amountToPayForInitiator + '',
        ReportingManagerEmail: roleDetails.reportingmanager,
        FirstLevelEmail: roleDetails.firstLevelManager,
        FinanceTreasuryEmail: roleDetails.FinanceTreasury || ' ',
        SalesCoordinatorEmail: roleDetails.SalesCoordinator,
        Role: roleDetails.role,
      };

      console.log('apipayload',apiPayload)
      this.utilityService.postEventSettlementDetails(apiPayload).subscribe(
        (res) => {
          if (res.message == 'Data added successfully.') {
            this.loadingIndicator = false;
            this._snackBarService.showSnackBar(
              Config.MESSAGE.SUCCESS.ADD_POST_SETTLEMENT,
              Config.SNACK_BAR.DELAY,
              Config.SNACK_BAR.SUCCESS
            );
            this.showPostEventContent = false;
            this._router.navigate(['view-event-list']);
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
  }

  // BTC BTE Summary
  BTESummary: any[] =[];
  BTCSummary: any[] =[];
  BTESummaryTotal: number = 0;
  BTCSummaryTotal: number = 0;
  private _filterBTEBTE(expenseList:any){
    this.BTESummary = [];
    this.BTCSummary = [];
    this.BTESummaryTotal = 0;
    this.BTCSummaryTotal = 0;
    console.log(expenseList)
    if(expenseList.length > 0){
      expenseList.forEach(expense => {
        if(expense.BtcorBte.trim() == 'BTC'){
          let data = {
            expense: expense.Expense,
            amount: expense.Amount,
            invoiceFile: ''
          }
          this.BTCSummary.push(data);
          this.BTCSummaryTotal += +data.amount;
        }
  
        if(expense.BtcorBte.trim() == 'BTE'){
          let data = {
            expense: expense.Expense,
            amount: expense.Amount,
          }
          this.BTESummary.push(data);
          this.BTESummaryTotal += +data.amount;
        }
      })
      console.log(this.BTCSummary);
      console.log(this.BTESummary);
      console.log(this.BTESummaryTotal);
      console.log(this.BTCSummaryTotal)
    }
  }
}

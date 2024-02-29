import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-medical-utility-post-event-settlement',
  templateUrl: './medical-utility-post-event-settlement.component.html',
  styleUrls: ['./medical-utility-post-event-settlement.component.css']
})
export class MedicalUtilityPostEventSettlementComponent implements OnInit {
  // spinner
  loadingIndicator: boolean = false;

  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  // Data To Show
  eventTableDetails: any[] = [];
  selectedEventDetail: any;
  private selectedEventId: any;
  deviationForm: FormGroup;
  panelDetails: any;

  // Hide and Show Handling
  showNoData: boolean = false;
  showEventSettlementContent: boolean = false;

  // Expense Table Declaration
  expenseTableDetails: any[] = [];

  expenseTableActualAmountInput: any[] = [];
  changedActualAmount: any[] = [];
  totalBudget: number = 0;
  actualBudget: number = 0;
  payBackToCompany: number = 0;
  amountToPayForInitiator: number = 0;

  misBasedExpense: any[] = [];
  private allExpenseData: any;
  expenseColumnGenerateCount: number[] = [];

  private hcpAgreementLength: number = 0;
  private hcpAcknowledgementLength: number = 0;
  private hcpAcknowledgementFiles: string[] = [];
  private hcpAgreementFiles: string[] = [];

  // File Handling
  private _allowedTypes: string[];
  allowedTypesForHTML: string;

  private _userDetails: any;

  constructor(
    private _utilityService: UtilityService,
    private _activatedRoute: ActivatedRoute,
    private _snackBarService: SnackBarService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this._authService.getUserDetails$.subscribe(value => this._userDetails = value)
    this._getExpenseData();
    this.deviationForm = new FormGroup({

    })
    this._activatedRoute.queryParams.subscribe(params => {
      if (params.eventId && params.eventType) {
        this.loadingIndicator = true;
        this._utilityService.getEventListFromProcess()
          .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
          .subscribe(res => {
            this.loadingIndicator = false;
            res.forEach(event => {
              if (event['EventId/EventRequestId'] == params.eventId) {
                this.eventTableDetails.push(event)
              }
            })
          })
      }
      else {
        this._loadEventData();
      }
    })

    // Getting Allowed File Types
    this._allowedTypes = Config.FILE.ALLOWED;
    this._generateAllowedFileAcceptAttribute();
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }

  // To Show Event Table
  private _loadEventData(): void {
    this.loadingIndicator = true;
    this._utilityService.getEventListFromProcess()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.loadingIndicator = false;
        res.forEach(event => {
          if (event.EventType == 'Medical Utility') {
            if(event['Initiator Email'] == this._userDetails.email){
              if(event['Event Request Status'] == 'Approved' || event['Event Request Status'] == 'Advance Approved'){
                this.eventTableDetails.push(event)
              }
            }
          }
        })
        if (this.eventTableDetails.length < 1) {
          this.showNoData = true;
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
        }
        else {
          this.showNoData = false;
        }
      })
  }

  private _getExpenseData(): void {
    this._utilityService.honorariumDetails()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.panelDetails = res;
        console.log(this.panelDetails)
      })

    this._utilityService.getExpensesData()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.allExpenseData = res;
      })
  }

  // To Get Specific Event Details
  private _expenseBasedMisCode: any;
  public onEventSelect(eventId: string): void {
    this.totalBudget = 0;
    this.actualBudget = 0;
    this._expenseBasedMisCode = 0;
    this.amountToPayForInitiator = 0;
    this.payBackToCompany = 0;
    this.expenseTableDetails = [];
    this.expenseColumnGenerateCount = [];
    // eventId = 'RQID156';

    this.selectedEventId = eventId;

    this.selectedEventDetail = this.eventTableDetails.find(eve => eve['EventId/EventRequestId'] == eventId);
    console.log(this.selectedEventDetail)
    

    this.panelDetails.forEach(panel => {
      if (panel['EventId/EventRequestId'] == eventId) {
        this.expenseTableDetails.push(panel);
      }
    })
    // console.log(this.allExpenseData);
    if (this.expenseTableDetails.length > 0) {
      this.showNoData = false;
      this.showEventSettlementContent = true;
      let expenseBasedMisCode = this.allExpenseData.filter(expense => expense['EventId/EventRequestID'] == eventId);
      this._expenseBasedMisCode = expenseBasedMisCode;
      let columnToGenerate: number = 0;

      if (expenseBasedMisCode.length > 0) {
        console.log(expenseBasedMisCode)
        this.expenseTableDetails.forEach(expense => {
          let count = expenseBasedMisCode.filter(exp => exp.MisCode == expense.MISCode);
          // console.log(count)

          if (expense['Medical Utility Type'].trim() == 'Medical Book') {
            expense['showAcknowledgementUpload'] = true;
            this.hcpAcknowledgementLength++;
          }
          if (expense['HCP Type'] == 'GO' && expense.ActualAmount > 0) {
            expense['showAgreementUpload'] = true;
            this.hcpAgreementLength++;
          }

          expense['ActualAmount'] = 0;
          for (let i = 0; i < count.length; i++) {
            expense[`Expense ${i}`] = count[i].Amount;
            expense['ActualAmount'] += count[i].Amount;
          }

          this.totalBudget += expense['ActualAmount'];
          this.actualBudget = this.totalBudget;

          if (count.length > columnToGenerate) {
            columnToGenerate = count.length;
            for (let i = 0; i < columnToGenerate; i++) {
              this.expenseColumnGenerateCount.push(i)
            }
          }
          // console.log(this.totalBudget)
        })
      }
      else {

      }
    }
    else {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      // this.showNoData = true;
      this.showEventSettlementContent = false;
    }

    this._filterBTEBTE(this._expenseBasedMisCode)




  }

  // To Calculate actual amount
  public calculateActualAmount(value: any, index: number) {
    console.log(this._expenseBasedMisCode);
   if(this._expenseBasedMisCode.length > 0){
    this.actualBudget -= this.expenseTableDetails[index].ActualAmount;
    this.actualBudget += value;
    this._calculateActualBudget();
    console.log('kll')
   }

  }

  // Calculation of Payback to company and inititator
  private _calculateActualBudget() {
    if (this.totalBudget < this.actualBudget) {
      this.payBackToCompany = 0;
      this.amountToPayForInitiator = this.actualBudget - this.totalBudget;
    }

    if (this.totalBudget > this.actualBudget) {
      this.amountToPayForInitiator = 0;
      this.payBackToCompany = this.totalBudget - this.actualBudget;
    }

    if (this.totalBudget == this.actualBudget) {
      this.payBackToCompany = 0;
      this.amountToPayForInitiator = 0;
    }

  }


  // To Generate accept attribute for HTML
  private _generateAllowedFileAcceptAttribute() {
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', ';
    })
  }


  // To Handle File uploads
  private _btcInvoiceFiles: string[] = [];
  private _bteInvoiceFile: string;
  public onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];

    if (event.target.files.length > 0) {
      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE) {
        const extension = file.name.split('.')[1];
        const reader = new FileReader();

        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;
            if (type == 'other') {
              if (control == 'hcpAcknowledgement') {
                this.hcpAcknowledgementFiles.push(file.name+':'+base64String.split(',')[1]);
              }
              if (control == 'hcpAgreement') {
                this.hcpAgreementFiles.push(file.name+':'+base64String.split(',')[1]);
              }
              if(control == 'btcInvoice'){
                this._btcInvoiceFiles.push(file.name+':'+base64String.split(',')[1]);
              
              }
              if(control == 'bteInvoice'){
                // this._bteInvoiceFile = base64String.split(',')[1];
                this._bteInvoiceFile = file.name+':'+base64String.split(',')[1];
               
              }
            }
          }
        }
        else {
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_TYPE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          this._resetControl(control);
        }
      }
      else {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_SIZE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        this._resetControl(control);
      }
    }


  }

  private _resetControl(control: string) {
    switch (control) {

    }
  }

  public onSubmit() {
    if ((this.hcpAgreementFiles.length !== this.hcpAgreementLength) || (this.hcpAcknowledgementFiles.length !== this.hcpAcknowledgementLength)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    else if(this._btcInvoiceFiles.length < this.BTCSummary.length){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    else if(this.BTESummary.length > 0 && !Boolean(this._bteInvoiceFile)){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    else {
      this.loadingIndicator = true;
      let roleDetails = this._authService.decodeToken();

      const apiPayload = {
        // For API
        Invitee: [{
          EventIdOrEventRequestId: ' ',
          InviteeName: ' ',
          MisCode: ' ',
          LocalConveyance: ' ',
          BtcorBte: ' ',
          LcAmount: ' '
        }],
        ExpenseSheets: [{
          Amount: ' ',
          Expense: ' ',
          AmountExcludingTax: ' ',
          BtcorBte: ' ',


          EventId: ' ',
          BtcAmount: ' ',
          BteAmount: ' ',
          BudgetAmount: ' '
        }],
        EventId: this.selectedEventDetail['EventId/EventRequestId'],
        EventTopic: this.selectedEventDetail['Event Topic'],
        EventType: this.selectedEventDetail.EventType,
        EventDate: this.selectedEventDetail.EventDate || ' ',
        StartTime: this.selectedEventDetail.StartTime || ' ',
        InitiatorName: this.selectedEventDetail.InitiatorName || roleDetails['unique_name'],
        EndTime: this.selectedEventDetail.EndTime || ' ',
        VenueName: this.selectedEventDetail.VenueName || ' ',
        State: ' ',
        City: ' ',
        Attended: ' ',
        InviteesParticipated: ' ',
        ExpenseParticipated: this.eventTableDetails.length + '' || ' ',
        TotalExpense: `Total Panel Selection Final Amount: ${this.totalBudget} | Total Budget For The Event : ${this.totalBudget}`,
        Advance: `Advance Provided : ${this.totalBudget} | Advance Utilized For Event : ${this.actualBudget} | Pay Back Amount To Company  : ${this.payBackToCompany} | Additional Amount Needed To Pay For Initiator : ${this.amountToPayForInitiator}`,
        Brands: this.selectedEventDetail.Brands || ' ',
        SlideKits: this.selectedEventDetail.SlideKits || ' ',
        Panalists: this.selectedEventDetail.Panelists || ' ',
        InitiatorEmail: roleDetails.email || ' ',
        RbMorBM: roleDetails['RBM_BM'] || ' ',
        SalesHead: roleDetails.SalesHead || ' ',
        MarkeringHead: roleDetails.MarketingHead || ' ',
        Compliance: roleDetails.ComplianceHead || "sabri.s@vsaasglobal.com",
        FinanceAccounts: roleDetails.FinanceAccounts || ' ',
        FinanceTreasury: roleDetails.FinanceTreasury || ' ',
        MedicalAffairsHead: roleDetails.MedicalAffairsHead || "sabri.s@vsaasglobal.com",
        FinanceHead: roleDetails.FinanceAccounts || "sabri.s@vsaasglobal.com",
        EventOpen30Days: 'No',
        EventLessThan5Days: 'No',
        PostEventSubmitted: "Yes",
        IsAdvanceRequired: this.selectedEventDetail.IsAdvanceRequired || "No",
        TotalInvitees: '0',
        TotalAttendees: '0',
        TotalTravelAndAccomodationSpend: (this.selectedEventDetail['Total Travel & Accomodation Spend'])? this.selectedEventDetail['Total Travel & Accomodation Spend'] + '' : '0',
        TotalHonorariumSpend: (this.selectedEventDetail['Total Honorarium Spend'])? this.selectedEventDetail['Total Honorarium Spend'] + '' : '0',
        TotalSpend: (this.selectedEventDetail['Total Spend'])? this.selectedEventDetail['Total Spend'] + '' : '0',
        TotalLocalConveyance: (this.selectedEventDetail['Total Local Conveyance'])? this.selectedEventDetail['Total Local Conveyance'] + '' : '0',
        TotalTravelSpend: (this.selectedEventDetail['Total Travel Spend'])? this.selectedEventDetail['Total Travel Spend'] + '' : '0',
        TotalAccomodationSpend: (this.selectedEventDetail['Total Accomodation Spend'])? this.selectedEventDetail['Total Accomodation Spend'] + '' : '0',
        TotalExpenses: (this.selectedEventDetail['Total Expense'])? this.selectedEventDetail['Total Expense'] + "" : "0",
        IsDeviationUpload: 'No',
        DeviationFiles: [' '],
        Files: this.hcpAgreementFiles.concat(this.hcpAcknowledgementFiles),
        TotalActuals: this.totalBudget  + '',
        AdvanceUtilizedForEvents: this.actualBudget + '',
        PayBackAmountToCompany: this.payBackToCompany + '',
        AdditionalAmountNeededToPayForInitiator: this.amountToPayForInitiator + '',
        ReportingManagerEmail: roleDetails.reportingmanager,
        FirstLevelEmail: roleDetails.firstLevelManager,
        FinanceTreasuryEmail: roleDetails.FinanceTreasury || ' ',
        SalesCoordinatorEmail: roleDetails.SalesCoordinator,
        Role: roleDetails.role,
      }

      this._utilityService.postEventSettlementDetails(apiPayload)
        .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
        .subscribe(res => {
          if (res.message == "Data added successfully.") {
            this.loadingIndicator = false;
            // alert("Event Settlement Submitted Successfully")
            this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_POST_SETTLEMENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
            this.showEventSettlementContent = false;
            // this._router.navigate(['view-event-list'])
          }
        },
          err => {
            this.loadingIndicator = false;
            this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          }
        )

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
         if(expense['BTC/BTE'].trim() == 'BTC'){
           let data = {
             expense: expense.Expense,
             amount: expense.Amount,
             invoiceFile: ''
           }
           this.BTCSummary.push(data);
           this.BTCSummaryTotal += +data.amount;
         }
   
         if(expense['BTC/BTE'].trim() == 'BTE'){
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

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-hcp-post-event-settlement',
  templateUrl: './hcp-post-event-settlement.component.html',
  styleUrls: ['./hcp-post-event-settlement.component.css']
})
export class HcpPostEventSettlementComponent implements OnInit {
  // spinner
  loadingIndicator: boolean = false;
  private _isPanelDetailsLoaded: boolean = false;

  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  // Data From Sheet
  panelDetails: any;
  private _expenseDetails: any;



  // Data To Show
  eventTableDetails: any[] = [];
  selectedEventDetail: any[] = [];
  selectedEvent: any;
  deviationForm: FormGroup;
  allEventDetails: any;
  selectedEvendId: string;
  selectedEventDetails: any;

  // Expense Table Declaration
  expenseTableDetails: any[] = [];
  expenseTableActualAmountInput: any[] = [];
  changedActualAmount: any[] = [];
  totalBudget: number = 0;
  actualBudget: number = 0;
  payBackToCompany: number = 0;
  amountToPayForInitiator: number = 0;

  // Hide and Show Handling
  showNoData: boolean = false;
  showEventSettlementContent: boolean = false;
  showAggregateSpendDeviation: boolean = false;
  showEventSelectDropdown: boolean = false;
  showFiftyPercentUploadDeviation: boolean = false;

  // File Handling
  private _allowedTypes: string[];
  allowedTypesForHTML: string;

  private aggregateDeviationFile: string;
  private fiftyPercentDeviationFile: string;
  private signedAgreementFile: string[] = [];
  private invoiceFile: string[] = [];

  private _userDetails: any;

  constructor(
    private _utilityService: UtilityService,
    private _activatedRoute: ActivatedRoute,
    private _snackBarService: SnackBarService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._authService.getUserDetails$.subscribe(value => this._userDetails = value)
    // Data From Sheet
    this._getExpenseData();
    // this._loadEventData();
    this.deviationForm = new FormGroup({
      aggregateDeviation: new FormControl(''),
      fiftyPercentDeviation: new FormControl('')
    })



    this._activatedRoute.queryParams.subscribe(params => {
      if (params.eventId && params.eventType) {

        this.loadingIndicator = true;
        this._utilityService.honorariumDetails()
          .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
          .subscribe(res => {

            this.panelDetails = res;
            this._utilityService.getEventListFromProcess()
              .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
              .subscribe(res => {
                
                this.showEventSelectDropdown = false;
                this.allEventDetails = res;

                res.forEach(event => {
                  if (event['EventId/EventRequestId'] == params.eventId) {
                    this.eventTableDetails.push(event);
                    this.loadingIndicator = false; 
                  }
                })

                this.onEventSelect(params.eventId);
                
              })
          })



      }
      else {
        this.showEventSelectDropdown = true;
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
        this.allEventDetails = res;
        res.forEach(event => {
          if (event.EventType == 'HCP Consultants') {
            if(event['Initiator Email'] == this._userDetails.email){
              if(event['Event Request Status'] == 'Approved' || event['Event Request Status'] == 'Advance Approved'){
                this.eventTableDetails.push(event);
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
    // this.loadingIndicator = true;
    this._utilityService.honorariumDetails()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this._isPanelDetailsLoaded = true;
        // this.loadingIndicator = false;
        this.panelDetails = res;
        console.log(this.panelDetails)

      })

    let data:any
    this._utilityService.getExpensesData()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this._expenseDetails = res;
      })
  }

  



  // To Get Specific Event Details
  public onEventSelect(eventId: string): void {
    this.BTCSummary = [];
    this.BTCSummary = [];
    this.BTESummaryTotal = 0;
    this.BTCSummaryTotal = 0;
   
    this.expenseTableDetails = [];

    // eventId = 'RQID80'
    this.selectedEventDetails = this.allEventDetails.find(eve => eve['EventId/EventRequestId'] == eventId)
    console.log(this.selectedEventDetails)
    this.selectedEvendId = eventId;


    this.panelDetails.forEach(panel => {
      if (panel['EventId/EventRequestId'] == eventId) {
        panel.actualTravel = +panel.Travel;
        panel.actualAccomodation = +panel.Accomodation;
        panel.actualLocal = +panel.LocalConveyance;
        panel.actualRegistartion = +panel['Registration Amount'];
        panel.actualTotal = panel.actualTravel + panel.actualAccomodation + panel.actualLocal + panel.actualRegistartion;
        panel.TotalSpend = +panel.Travel + +panel.Accomodation + +panel.LocalConveyance + +panel['Registration Amount'];
        this.totalBudget += panel.TotalSpend;
        this.expenseTableDetails.push(panel);
      }
    })

    
    let expenseData: any[] = [];
    this._expenseDetails.forEach(expense => {
      if(expense['EventId/EventRequestID'] == eventId){
        expenseData.push(expense);
      }
    })

    if(expenseData.length > 0){
      this._filterBTCBTE(expenseData)
    }

    this.actualBudget = this.totalBudget;

    if (this.expenseTableDetails.length > 0) {
      this.showEventSettlementContent = true;
      this._checkAggregateDeviation();
      for (let i = 0; i < this.expenseTableDetails.length; i++) {
        this.expenseTableActualAmountInput.push(i);
      }
    }
    else {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      this.showEventSettlementContent = false;
    }




  }

  private _checkAggregateDeviation() {
    if (this.totalBudget > 500000 || this.actualBudget > 500000) {
      this.showAggregateSpendDeviation = true;
    }
    else {
      this.showAggregateSpendDeviation = false;
    }
  }

  private _checkBudgetExceedsDeviation(actualAmount: number) {
    let fiftyPercent = +(this.totalBudget / 2).toFixed(2);

    if (actualAmount > this.totalBudget + fiftyPercent) {
      this.showFiftyPercentUploadDeviation = true;
    }
    else {
      this.showFiftyPercentUploadDeviation = false;
    }
  }

  public onActualsChanges(value: number, index: number, panel: any, type: string) {
    if (type == 'Travel') {
      panel.actualTravel = value;
    }
    else if (type == 'Accomodation') {
      panel.actualAccomodation = value;
    }
    else if (type == 'Local') {
      panel.actualLocal = value;
    }
    else {
      panel.actualRegistartion = value;
    }
    panel.actualTotal = panel.actualTravel + panel.actualAccomodation + panel.actualLocal + panel.actualRegistartion;
    this.onExpenseActualAmountChanges(panel.actualTotal, index);
    this._checkBudgetExceedsDeviation(panel.actualTotal);
  }

  // Tracking the changing actual amount
  public onExpenseActualAmountChanges(value: number, index: number) {
    this.actualBudget = this.totalBudget;
    this.actualBudget -= +this.expenseTableDetails[index].TotalSpend;

    let changedVal = this.changedActualAmount.find(change => change.index == index);

    if (!changedVal) {
      this.changedActualAmount.push({
        index: index,
        amount: value
      })
    }
    else {
      changedVal.amount = value;
    }

    for (let i = 0; i < this.changedActualAmount.length; i++) {
      this.actualBudget += this.changedActualAmount[i].amount;
    }
    this._calculateActualBudget();
  }

  private _calculateActualBudget() {
    this._checkAggregateDeviation();
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

            if (type == 'deviation') {
              if (control == 'aggregateDeviation') {
                // this.aggregateDeviationFile = base64String.split(',')[1];
                this.aggregateDeviationFile = 'HCP5lacksDeviation'+'.'+extension+':'+base64String.split(',')[1];
                // console.log(this.aggregateDeviationFile);
              }
              if (control == 'fiftyPercentDeviation') {
                // this.fiftyPercentDeviationFile = base64String.split(',')[1];
                this.fiftyPercentDeviationFile = 'ActualAmountGreaterThanFiftyPercent'+'.'+extension+':'+base64String.split(',')[1];
              }
            }
            if (type == 'other') {
              if (control == 'signedAgreement') {
                this.signedAgreementFile.push(file.name+':'+base64String.split(',')[1]);
                console.log(this.signedAgreementFile)
              }
              // if (control == 'invoice') {
              //   this.invoiceFile.push(base64String.split(',')[1]);
              //   console.log(this.invoiceFile)
              // }
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
      case 'aggregateDeviation':
        this.deviationForm.controls.aggregateDeviation.reset();
        this.aggregateDeviationFile = '';
        console.log(this.aggregateDeviationFile)
        break;

      case 'fiftyPercentDeviation':
        this.deviationForm.controls.fiftyPercentDeviation.reset();
        break;
    }
  }


  // Submit
  public onSubmit() {

    if ((this.showAggregateSpendDeviation && !Boolean(this.deviationForm.value.aggregateDeviation)) 
        || (this.showFiftyPercentUploadDeviation && !Boolean(this.deviationForm.value.fiftyPercentDeviation)) 
          || (this.signedAgreementFile.length < this.expenseTableDetails.length)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    else if(this._btcInvoiceFiles.length < this.BTCSummary.length || (this.BTESummary.length > 0 && !Boolean(this._bteInvoiceFile))){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    else {
      let otherFiles: any[] = this.invoiceFile.concat(this.signedAgreementFile);
      if(this.BTCSummary.length > 0){
        this._btcInvoiceFiles.forEach(file => otherFiles.push(file));
      }
      if(this.BTESummary.length > 0){
        otherFiles.push(this._bteInvoiceFile);
      }

      console.log(otherFiles);
      this.loadingIndicator = true;
      let roleDetails = this._authService.decodeToken();
      console.log(this.selectedEventDetails)
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
        EventId: this.selectedEvendId,
        EventTopic: this.selectedEventDetails['Event Topic'],
        EventType: this.selectedEventDetails.EventType,
        EventDate: this.selectedEventDetails.EventDate,
        StartTime: this.selectedEventDetails.StartTime,
        InitiatorName: this.selectedEventDetails.InitiatorName || roleDetails['unique_name'],
        EndTime: this.selectedEventDetails.EndTime,
        VenueName: this.selectedEventDetails.VenueName,
        State: ' ',
        City: ' ',
        Attended: ' ',
        InviteesParticipated: ' ',
        ExpenseParticipated: this.eventTableDetails.length + '' || ' ',
        TotalExpense: `Total Panel Selection Final Amount: ${this.totalBudget} | Total Budget For The Event : ${this.totalBudget}`,
        Advance: `Advance Provided : ${this.totalBudget} | Advance Utilized For Event : ${this.actualBudget} | Pay Back Amount To Company  : ${this.payBackToCompany} | Additional Amount Needed To Pay For Initiator : ${this.amountToPayForInitiator}`,
        Brands: this.selectedEventDetails.Brands || ' ',
        SlideKits: this.selectedEventDetails.SlideKits || ' ',
        Panalists: this.selectedEventDetails.Panelists || ' ',
        InitiatorEmail: roleDetails.email || ' ',
        RbMorBM: roleDetails['RBM_BM'] || ' ',
        SalesHead: roleDetails.SalesHead || ' ',
        MarkeringHead: roleDetails.MarketingHead || ' ',
        Compliance: roleDetails.ComplianceHead || "sabri.s@vsaasglobal.com",
        FinanceAccounts: roleDetails.FinanceAccounts || ' ',
        FinanceTreasury: roleDetails.FinanceTreasury || ' ',
        MedicalAffairsHead: roleDetails.MedicalAffairsHead || "sabri.s@vsaasglobal.com",
        FinanceHead: roleDetails.FinanceAccounts || "sabri.s@vsaasglobal.com",
        ReportingManagerEmail: roleDetails.reportingmanager,
        FirstLevelEmail: roleDetails.firstLevelManager,
        FinanceTreasuryEmail: roleDetails.FinanceTreasury || ' ',
        SalesCoordinatorEmail: roleDetails.SalesCoordinator,
        EventOpen30Days: 'No',
        EventLessThan5Days: 'No',
        PostEventSubmitted: "Yes",
        IsAdvanceRequired: this.selectedEventDetails.IsAdvanceRequired || "No",
        TotalInvitees: '0',
        TotalAttendees: '0',
        TotalTravelAndAccomodationSpend: (this.selectedEventDetails['Total Travel & Accomodation Spend'])? this.selectedEventDetails['Total Travel & Accomodation Spend'] + '' : '0',
        TotalHonorariumSpend: (this.selectedEventDetails['Total Honorarium Spend'])? this.selectedEventDetails['Total Honorarium Spend'] + '' : '0',
        TotalSpend: (this.selectedEventDetails['Total Spend'])? this.selectedEventDetails['Total Spend'] + '' : '0',
        TotalLocalConveyance: (this.selectedEventDetails['Total Local Conveyance'])? this.selectedEventDetails['Total Local Conveyance'] + '' : '0',
        TotalTravelSpend: (this.selectedEventDetails['Total Travel Spend'])? this.selectedEventDetails['Total Travel Spend'] + '' : '0',
        TotalAccomodationSpend: (this.selectedEventDetails['Total Accomodation Spend'])? this.selectedEventDetails['Total Accomodation Spend'] + '' : '0',
        TotalExpenses: (this.selectedEventDetails['Total Expense'])? this.selectedEventDetails['Total Expense'] + "" : "0",
        TotalActuals: this.totalBudget + '',
        AdvanceUtilizedForEvents: this.actualBudget + '',
        PayBackAmountToCompany: this.payBackToCompany + '',
        AdditionalAmountNeededToPayForInitiator: this.amountToPayForInitiator + '',
        IsDeviationUpload: 'No',
        Role: roleDetails.role,
        DeviationFiles: [' '],
        Files: otherFiles
      }
      // console.log(apiPayload)

      this._utilityService.postEventSettlementDetails(apiPayload)
        .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
        .subscribe(res => {
          if (res.message == "Data added successfully.") {
            this.loadingIndicator = false;
            // alert("Event Settlement Submitted Successfully")
            this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_POST_SETTLEMENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
            this.showEventSettlementContent = false;
            this._router.navigate(['view-event-list'])
          }
        },
          err => {
            this.loadingIndicator = false;
            this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          }
        )
    }
  }


  // BTE BTC Summary
  BTESummary: any[] =[];
  BTCSummary: any[] =[];
  BTESummaryTotal: number = 0;
  BTCSummaryTotal: number = 0;
  private _filterBTCBTE(expenseList: any){
    console.log(expenseList)
    this.BTESummary= [];
    this.BTCSummary = [];
    this.BTESummaryTotal = 0;
    this.BTCSummaryTotal = 0;

    expenseList.forEach(expense => {
      if(expense['BTC/BTE'].trim() == 'BTC'){
        let data = {
          expense: expense.Expense,
          amount: expense['Registration Amount'],
          invoiceFile: ''
        }
        this.BTCSummary.push(data);
        this.BTCSummaryTotal += +data.amount;
      }

      if(expense['BTC/BTE'].trim() == 'BTE'){
        let data = {
          expense: expense.Expense,
          amount: expense['Registration Amount'],
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

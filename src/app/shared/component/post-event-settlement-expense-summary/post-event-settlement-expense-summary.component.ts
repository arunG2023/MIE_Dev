import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/event-utility/utility-service.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Config } from '../../config/common-config';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
import { data } from 'jquery';

@Component({
  selector: 'app-post-event-settlement-expense-summary',
  templateUrl: './post-event-settlement-expense-summary.component.html',
  styleUrls: ['./post-event-settlement-expense-summary.component.css']
})
export class PostEventSettlementExpenseSummaryComponent implements OnInit {
  // Spinner
  public loadingIndicator: boolean = false;

  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  public expenseTabelDetails: any[] = [];

  public expenseForm: FormGroup;
  public showExpenseForm: boolean = false;

  private _inviteeList: any;

  
  // File Handling:
  private _allowedTypes: string[];
  public allowedTypesForHTML: string;

  constructor(private _utilityService: UtilityService,
            private _snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this._getExpenseTypesForDropdown();
    this._getExpense();
    this._getInviteesExpenseData();

    this.expenseForm = new FormGroup({
      expenseType: new FormControl('',Validators.required),
      expenseBTC: new FormControl('',Validators.required),
      amountExcludingTax: new FormControl(0,Validators.required),
      amountIncludingTax: new FormControl(0,Validators.required),
      expenseDeviation: new FormControl('',),
    })

     // Getting allowed file types
     this._allowedTypes = Config.FILE.ALLOWED;

     // Generating Allowed types for HTML
     this._allowedTypes.forEach(type => {
       this.allowedTypesForHTML += '.' + type + ', '
     })
    
  }

  public expenseType: any;
  private _getExpenseTypesForDropdown(){
    this._utilityService.getExpenseType()
    .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
    .subscribe(
      res => this.expenseType = res
    );
  }


  public totalInviteesCount: number = 0;
  private _getExpense(){
    this._utilityService.expenseData
    .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
    .subscribe(data => {
      // console.log('expense Receive', data);
      if (data.from == 'eventSettlementExpense') {
        // console.log(data)
        this.expenseTabelDetails = data.data;
        this.totalInviteesCount = data.totalInviteesCount;
        this._inviteeList = data.invitees
        this.selectedEventId = data.eventId
      
        this._filterBTEBTC(this.expenseTabelDetails, data.invitees);
        this._calculateOtherExpenseTotal();
      }
    })
  }

  public addExpenseRadio: string;

  public onAddExpenseRadioChange(value:string){
    // console.log(value);
    if(value == 'Yes'){
      this.showExpenseForm = true;
    }
    else{
      this.showExpenseForm = false;
    }
  }


  public showExpenseDeviation: boolean = false;
  public onExpenseAmountChanges(value: string){
    // console.log(value)
    if(this.expenseForm.value.expenseType.toLowerCase().includes('food & beverages')){
      // console.log(+(this.expenseForm.value.amountExcludingTax/this.totalInviteesCount).toFixed(2))
      // console.log(+(this.expenseForm.value.amountExcludingTax/this.totalInviteesCount).toFixed(2) > 1500)
      if(+(this.expenseForm.value.amountExcludingTax/this.totalInviteesCount).toFixed(2) > 1500){
        this.showExpenseDeviation = true;
      }
      else{
        this.showExpenseDeviation = false;
      }
    }
  }

  public addToExpenseTable(){
    let formValidity: number = 0;

    if(this.expenseForm.value.amountExcludingTax > this.expenseForm.value.amountIncludingTax){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if(this.expenseForm.invalid){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if(this.showExpenseDeviation && !Boolean(this._expenseDeviationFile)){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }



    if(formValidity == 0){
      // console.log('Valid');
      const expense = {
        Amount: this.expenseForm.value.amountIncludingTax + '',
        Expense: this.expenseForm.value.expenseType + '',
        AmountExcludingTax: (this.expenseForm.value.amountExcludingTax > 0)? 'Yes' : 'No',
        BtcorBte: this.expenseForm.value.expenseBTC,
        actualExpense: this.expenseForm.value.amountIncludingTax,

        // For API
        EventId: ' ',
        BtcAmount: ' ',
        BteAmount: ' ',
        BudgetAmount: ' '
      }
      this.expenseTabelDetails.push(expense);
      this._calculateTotalExpense();
      this.expenseForm.reset();
      this.showExpenseDeviation = false;
      this.showExpenseForm = false;
    }
  }

  // Calculating actual amount:
  private _calculateTotalExpense(){
    this._totalExpenseActualAmount = 0;
    this.expenseTabelDetails.forEach(expense => this._totalExpenseActualAmount += +expense.actualExpense);
    this._calculateAdvanceTableDetails();
  }
  
  private _totalExpenseActualAmount: number = 0;

  public onExpenseAmountActualAmountChanges(value: number, expense:any){
    this._totalExpenseActualAmount = 0;

    expense.actualExpense = value;

    this._calculateTotalExpense();

    // console.log(this._totalExpenseActualAmount)
  }


  private _expenseDeviationFile: string;
  private _btcInvoiceFiles: string[] = [];
  private _bteInvoiceFile: string;
  onFileSelected(event: any, type: string, control: string) {
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
              if(control == 'expenseDeviation'){
                // this._expenseDeviationFile = base64String.split(',')[1];
                this._expenseDeviationFile = file.name+':'+base64String.split(',')[1];
              }
            }
            if (type == 'other') {
              if(control == 'btcInvoice'){
                this._btcInvoiceFiles.push(file.name+':'+base64String.split(',')[1]);
                this._sendPayloadData();
              }
              if(control == 'bteInvoice'){
                // this._bteInvoiceFile = base64String.split(',')[1];
                this._bteInvoiceFile = file.name+':'+base64String.split(',')[1];
                this._sendPayloadData();
              }

            }


          }

          // console.log(this.photosFile)
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
     case 'expenseDeviation':
      this.expenseForm.controls.expenseDeviation.reset();
      break;

    }
  }

  // Amount Calculation
  public selectedEventId: string;
  public panelSelectionFinalAmount: number = 0;
  public inviteesFinalAmount: number = 0;
  public expenseFinalAmount: number = 0;
  public totalBudget: number = 0;
  public advancedUtilized: number = 0;
  public advanceProvided: number = 0;
  public amountToPayForCompany: number = 0;
  public amountToPayForInitiator: number = 0;

  private _calculateOtherExpenseTotal(){
    this.totalBudget = 0;
    this.advancedUtilized = 0;
    this.panelSelectionFinalAmount = 0;
    this.inviteesFinalAmount = 0;
    this.expenseFinalAmount = 0;

    this.loadingIndicator = true;
    this._utilityService.getPanelSelectionFinalAmount(this.selectedEventId)
    .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
    .subscribe(
      res => {
        this.loadingIndicator = false;
        if (Boolean(res)) {
          this.panelSelectionFinalAmount = +res;
          this.totalBudget +=  this.panelSelectionFinalAmount
          this.advancedUtilized +=  this.panelSelectionFinalAmount

          
        }
      },
      err => {
        this.loadingIndicator = false
        // console.log(err);
        this.panelSelectionFinalAmount = 0;
        this.totalBudget +=  this.panelSelectionFinalAmount
        this.advancedUtilized +=  this.panelSelectionFinalAmount;
        this._calculateTotalExpense();
        

      })
    this.expenseTabelDetails.forEach(expense => this.expenseFinalAmount += +expense.Amount )
    this._inviteeList.forEach(invitee => this.inviteesFinalAmount += +invitee.LcAmount)

    this.totalBudget = this.inviteesFinalAmount + this.expenseFinalAmount;
    this.advancedUtilized = this.inviteesFinalAmount + this.expenseFinalAmount;
    this._inviteesActualAmount = this.inviteesFinalAmount;
  }

   // Get Expense Data
   private _inviteesActualAmount: number = 0;
   private _getInviteesExpenseData(){
    this._utilityService.advanceData.subscribe(result => {

      if(result.for == 'actualCalculation' && result.from == 'inviteeSummary'){
        // console.log(result)
        this._inviteesActualAmount = result.actualInviteeAmount;
        // this.advancedUtilized += result.actualInviteeAmount
        this._calculateTotalExpense();
      }
    })
  }


  private _calculateAdvanceTableDetails() {
    // console.log('Exp',this._totalExpenseActualAmount);
    // console.log('Pan',this.panelSelectionFinalAmount)
    // console.log('Inv',this._inviteesActualAmount)
    this.advancedUtilized = this._totalExpenseActualAmount + this._inviteesActualAmount + this.panelSelectionFinalAmount

    if (this.totalBudget < this.advancedUtilized) {
      this.amountToPayForCompany = 0;
      this.amountToPayForInitiator = this.advancedUtilized - this.totalBudget;
    }

    if (this.totalBudget > this.advancedUtilized) {
      this.amountToPayForInitiator = 0;
      this.amountToPayForCompany = this.totalBudget - this.advancedUtilized;
    }

    if (this.totalBudget == this.advancedUtilized) {
      this.amountToPayForCompany = 0;
      this.amountToPayForInitiator = 0;
      // console.log(this.amountToPayForInitiator)
    }

    this._sendPayloadData();
  }


  // Expense Summary
  public BTESummary: any[] = [];
  public BTCSummary: any[] = [];
  public BTCSummaryTotal: number = 0;
  public BTESummaryTotal: number = 0;
  private _filterBTEBTC(expenseList: any, inviteeList: any){
    this.BTESummary = [];
    this.BTCSummary = [];
    this.BTCSummaryTotal = 0;
    this.BTESummaryTotal = 0;
    // console.log('aaa',inviteeList)
    expenseList.forEach(expense => {
      if(expense.BtcorBte == 'BTC'){
        let data = {
          expense: expense.Expense,
          amount: +expense.Amount,
          invoiceFile: ''
        }
        this.BTCSummaryTotal += data.amount;
        this.BTCSummary.push(data)
      }
      else if(expense.BtcorBte == 'BTE'){
        let data = {
          expense: expense.Expense,
          amount: +expense.Amount,
        }
        this.BTESummaryTotal += data.amount;
        this.BTESummary.push(data)
      }
    })

    inviteeList.forEach(invitee => {
      // console.log(invitee)
      if(invitee.BtcorBte.trim() == 'BTC'){
        let data = {
          expense: "Local Conveyance",
          amount: +invitee.LcAmount,
          invoiceFile: ''
        }
        this.BTCSummaryTotal += data.amount;
        this.BTCSummary.push(data)
      }
      else if(invitee.BtcorBte.trim() == 'BTE'){
        let data = {
          expense: "Local Conveyance",
          amount: +invitee.LcAmount,
        }
        this.BTESummaryTotal += data.amount;
        this.BTESummary.push(data)
      }
    })

    // console.log('se',this.BTESummary);
    // console.log('se1',this.BTCSummary)
  }


  private _sendPayloadData(){
    let payLoadData: any = {
      from: 'expenseSummary',
      for: 'apiPayload',
      expenseDetails: this.expenseTabelDetails,
      totalExpenseCount: this.expenseTabelDetails.length,
      panelTotalAmount: this.panelSelectionFinalAmount,
      inviteeTotalAmount: this.inviteesFinalAmount,
      expenseTotalAmount: this.expenseFinalAmount,
      advanceProvided: this.BTESummaryTotal,
      advanceUtilized: this.advancedUtilized,
      paybackToCompany: this.amountToPayForCompany,
      paybackToInitiator: this.amountToPayForInitiator,
      btcSummaryCount: this.BTCSummary.length,
      btcInvoiceFiles: this._btcInvoiceFiles,
      bteInvoiceFile: this._bteInvoiceFile,
      bteSummaryCount: this.BTESummary.length
    }

    this._utilityService.sendData(payLoadData);
  }


}

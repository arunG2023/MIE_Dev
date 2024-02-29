import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { EventPendingComponent } from 'src/app/shared/component/event-pending/event-pending.component';
import { Config } from 'src/app/shared/config/common-config';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-finance-treasury',
  templateUrl: './finance-treasury.component.html',
  styleUrls: ['./finance-treasury.component.css']
})
export class FinanceTreasuryComponent implements OnInit {
  // Spinner
  loadingIndicator: boolean = false;

  // Pagenation
  public pageRowLimit: number = 5;
  public page: number = 1

  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  // Form
  financeTreasuryForm: FormGroup;
  bteSummaryForm: FormGroup;

  processSheetData: any;
  public allEventList: any;
  public allPanelData: any;
  public allExpenseData: any;

  showPreEventForm: boolean = false;
  showPanelTable: boolean = false;
  showExpenseTable: boolean = false;


  selectedEventDetails: any;
  panelTableDetails: any[] = [];
  btcSummaryTableDetails: any[] = [];
  btcSummaryTotal: number = 0;
  btcActualTotal: number = 0;

  bteSummaryTableDetails: any[] = [];
  bteSummaryTotal: number = 0;
  bteActualTotal: number = 0;
  


  constructor(
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this._loadProcessSheetData();
    this._loadPanelSheetData();
    this._loadExpenseSheetDate();
    this.getData();

    this.financeTreasuryForm = new FormGroup({
      totalAdvanceAmount: new FormControl(''),
      advacneVoucherNumber: new FormControl(''),
      advanceVoucherDate: new FormControl(''),
      bankReferenceNumber: new FormControl(''),
      bankReferenceDate: new FormControl('')
    })

    this.bteSummaryForm = new FormGroup({
      btePvNumber: new FormControl('',Validators.required),
      btePvDate: new FormControl('',Validators.required),
      btebankNumber: new FormControl('',Validators.required),
      btebankDate: new FormControl('',Validators.required)
    })


  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }


  public pageChanged(thisPage) {
    this.page = thisPage
  }

  private _loadProcessSheetData() {
    this._utilityService.getEventListFromProcess()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.allEventList = res;
        // console.log(this.allEventList)
      })
  }

  private _loadPanelSheetData() {
    this._utilityService.honorariumDetails()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        // console.log(res);
        this.allPanelData = res;
      })
  }

  private _loadExpenseSheetDate() {
    this._utilityService.getPostEventExpense()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        // console.log(res);
        this.allExpenseData = res;
      })
  }

  public onPreEventClick(value: any) {
    // console.log(value)
    this.selectedEventDetails = value;
    this.showPreEventForm = true;
    this.showPanelTable = false;
  }

  getData() {
    this._utilityService.data.subscribe(response => {
      // console.log(response);  // you will receive the data from sender component here.
      if (response.for == 'Pre Event') {
        this.selectedEventDetails = response;
        this.showPreEventForm = true;
        this.showPanelTable = false;
        this.showExpenseTable = false;
      }
      else if (response.for == 'Honorarium') {
        this._filterPanelDetails(response);
      }
      else if (response.for == 'Post Settlement') {
        this._filterExpenseDetails(response)
      }
    });
  }

  private _filterPanelDetails(value: any) {
    this.panelTableDetails = [];
    this.showPreEventForm = false;
    this.showExpenseTable = false;
    this.selectedEventDetails = value;
    // console.log(value)
    this.allPanelData.forEach(panel => {
      if (panel['EventId/EventRequestId'] == this.selectedEventDetails['EventId/EventRequestId']) {
        panel.pvNumber = panel['PV Number'];
        panel.pvDate = panel['PV Date'];
        panel.bankNumber = panel['Bank Reference Number'];
        panel.bankDate = panel['Bank Reference Date'];
        this.panelTableDetails.push(panel)
      }
    })

    // console.log(this.panelTableDetails)
    if(this.panelTableDetails.length > 0){
      this.showPanelTable = true;
    }
    else{
      this.showPanelTable = false;
      this._snackBarService.showSnackBar( Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.ERROR);
    }
  }

  public close(){
    this.showPanelTable = false;
    this.showExpenseTable = false;
    this.showPreEventForm = false;
  }


  private _filterExpenseDetails(value: any) {
    this.bteSummaryTableDetails = [];
    this.btcSummaryTableDetails = [];
    this.showPreEventForm = false;
    this.showPanelTable = false;
    this.selectedEventDetails = value;

    this.allExpenseData.forEach(expense => {
      if(expense['EventId/EventRequestID'] == this.selectedEventDetails['EventId/EventRequestId']){
        console.log(expense)
        if(expense['BTC/BTE'] == 'BTC'){
          this.btcSummaryTableDetails.push(expense);
          this.btcSummaryTotal += expense.BTCAmount;
          this.btcActualTotal += expense.Amount;
          
        }
        else if(expense['BTC/BTE'] == 'BTE'){
          console.log('BTE', expense)
          this.bteSummaryTableDetails.push(expense);
          this.bteSummaryTotal += expense.BTEAmount;
          this.bteActualTotal += expense.Amount;
          
        }

      }
      
    })

    if(this.bteSummaryTableDetails.length > 0 || this.btcSummaryTableDetails.length > 0){
      this.showExpenseTable = true;
    }
    else{
      this.showExpenseTable = false;
      this._snackBarService.showSnackBar( Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.ERROR);
    }
  }

 

  public onHonorariumSubmit() {
    // console.log(this.panelTableDetails)


    const payLoad: any[] = [];

    this.panelTableDetails.forEach(panel => {
      let data = {
        Id: panel['Panelist ID'],
        HcpName: panel.HCPName || ' ',
        MisCode: panel.MISCode+'' || '0',
        PvNumber: panel.pvNumber + '' || '0',
        PvDate: new Date(panel.pvDate),
        BankReferenceNumber: panel.bankNumber + '' || '0',
        BankReferenceDate: new Date(panel.bankDate) || ' '  
      }
      payLoad.push(data);
    })

    this.loadingIndicator = true;
    this._utilityService.putFinanceTreasuryHonorarium(payLoad).subscribe(
      res => {
       
        if(res.message == 'Data Updated successfully.'){
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar( Config.MESSAGE.SUCCESS.FINANCE_TREASURY, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.SUCCESS);
          this.showPanelTable = false;

        }
        else{
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar( Config.MESSAGE.SUCCESS.FINANCE_TREASURY, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.SUCCESS);
          this.showPanelTable = false;
        }
       
      },
      err =>{
        this.loadingIndicator = false;
        this._snackBarService.showSnackBar( Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.ERROR);
      }
    )
  }

  public onEvenstSettlementSubmit(){
    let apiPayLoad: any[] = [];
    let validity: number = 0;
    if(this.bteSummaryTableDetails.length > 0 && !this.bteSummaryForm.valid){
      validity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.ERROR);
      // console.log(this.bteSummaryTableDetails)
    }
    else{
      if(this.bteSummaryTableDetails.length > 0){
        this.bteSummaryTableDetails.forEach(expense =>{
          let data = {
            Id: expense['Expenses ID'],
            HcpName: " ",
            MisCode: " ",
            PvNumber: this.bteSummaryForm.value.btePvNumber+'' || '0',
            PvDate: new Date(this.bteSummaryForm.value.btePvDate) || ' ',
            BankReferenceNumber: this.bteSummaryForm.value.btebankNumber+'' || '0',
            BankReferenceDate: new Date(this.bteSummaryForm.value.btebankDate) || ' '
          }
          apiPayLoad.push(data)
        })
      }
      if(this.btcSummaryTableDetails.length > 0){
        this.btcSummaryTableDetails.forEach(expense => {
          let data = {
            Id: expense['Expenses ID'],
            HcpName: " ",
            MisCode: " ",
            PvNumber: expense['PV Number']+'' || '0',
            PvDate: new Date(expense['PV Date']) || ' ',
            BankReferenceNumber: expense['Bank Reference Number']+'' || '0',
            BankReferenceDate: new Date(expense['Bank Reference Date']) || ' '
          }
          apiPayLoad.push(data)
        })
      }
      console.log(apiPayLoad)
      this.loadingIndicator = true;
      this._utilityService.putFinanceTreasuryEventSettlement(apiPayLoad).subscribe(
        res => {
          // console.log(res);
          if(res.message == 'Data Updated successfully.'){
            this.loadingIndicator = false;
            this._snackBarService.showSnackBar( Config.MESSAGE.SUCCESS.FINANCE_TREASURY, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.SUCCESS);
            this.showExpenseTable = false;
  
          }
          else{
            this.loadingIndicator = false;
            this._snackBarService.showSnackBar( Config.MESSAGE.SUCCESS.FINANCE_TREASURY, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.SUCCESS);
            this.showExpenseTable = false;
          }
        },
        err =>{
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar( Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY,Config.SNACK_BAR.ERROR);
        }
      )
    
    }
  }
}

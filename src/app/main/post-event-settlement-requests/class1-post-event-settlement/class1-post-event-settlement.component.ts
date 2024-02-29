import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { data, event } from 'jquery';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { DeleteInviteeConfirmationModalComponent } from 'src/app/main/general-modules/add-delete-invitees/delete-invitee-confirmation-modal.component';
import { AddInviteeModalComponent } from 'src/app/main/general-modules/add-delete-invitees/add-invitee-modal.component';

@Component({
  selector: 'app-class1-post-event-settlement',
  templateUrl: './class1-post-event-settlement.component.html',
  styleUrls: ['./class1-post-event-settlement.component.css']
})
export class Class1PostEventSettlementComponent implements OnInit {
  // Spinner
  loadingIndicator: boolean = false;

  PostEventSettlement: FormGroup;

  addExpenseForm: FormGroup;
  uploadForm: FormGroup;
  deviationForm: FormGroup;


  stepper: any;
  isUploadShows: boolean = false;
  isUploadGST: boolean = false;
  show30DaysUpload: boolean = false;

  invitees: any;
  inviteeTableIsPresentCheckBox: any[] = [];
  totalAttendance: number = 0;

  showInviteeDeviation: boolean = false;
  showEventSelect: boolean = false;

  expense: any;

  selectedEvent: any;
  showPostEventContent: boolean = false;
  inviteeTableDetails: any[] = [];
  expenseTabelDetails: any[] = [];

  expenseTableDetailCopy: any[] = [];
  inviteeTableDetailsCopy: any[] = []


  allEventList: any;
  expenseType: any;


  // Amount Table 
  panelSelectionFinalAmount: any;
  inviteesFinalAmount: any;
  expenseFinalAmount: any;
  amountTableFinalAmount: any = 0;

  // Advance Table:
  advancedUtilized: any = 0;
  amountToPayForInitiator: any = 0;
  amountToPayForCompany: any = 0;

  showGstTextBox: boolean = false;
  showNoData: boolean = false;

  private _userDetails:any;

  constructor(private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private _dialog: MatDialog,
    private _snackBarService: SnackBarService,
    private _router: Router,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this._authService.getUserDetails$.subscribe(value => this._userDetails = value)

    this._getPayloadData();


    this.utilityService.getInviteesFast().subscribe(res => {
      this.invitees = res

    });

    this.utilityService.getExpenseType().subscribe(
      res => this.expenseType = res
    );

    this.utilityService.getPostEventExpense().subscribe(
      res => {
        // console.log(res);
        this.expense = res;

      }
    )

    this.activatedRoute.queryParams.subscribe(params => {

      if (params.eventId && params.eventType) {
        this.loadingIndicator = true;

        this.utilityService.getInviteesFast().subscribe(res => {
          this.invitees = res;
          this.utilityService.getPostEventExpense().subscribe(
            res => {
              this.expense = res;
              this.utilityService.getEventListFromProcess().subscribe(res => {

                this.allEventList = res;
                this.after30DaysList.push(res.find(eve => eve['EventId/EventRequestId'] == params.eventId));
                this.show30DaysUpload = this.isAfter30Days(this.after30DaysList[0].EventDate);
               
      
                
                // console.log('invitees', this.invitees);
                // console.log('expense', this.expense)
                this.loadingIndicator = false;
                this.onEventSelect(params.eventId)
      
      
              })
      
            }
          )
        });

        

      }
      else {
        this.showEventSelect = true;
        this.loadingIndicator = true;
        this.utilityService.getEventListFromProcess().subscribe(res => {
          this.loadingIndicator = false;
          this.allEventList = res;
          this.after30Days(this.allEventList);
        })



      }
    })

    this.uploadForm = new FormGroup({
      attendanceUpload: new FormControl(''),
      inviteeDeviation: new FormControl('')
    })

    this.deviationForm = new FormGroup({
      thirtyDaysUpload: new FormControl('')
    })

    this.addExpenseForm = new FormGroup({
      expenseType: new FormControl('', Validators.required),
      expenseAmountWithoutGST: new FormControl(0,),
      gstAmount: new FormControl(0,),
      expenseBTC: new FormControl('', Validators.required),
    })


    this.addExpenseFormPrePopulate();

    // Getting allowed file types
    this._allowedTypes = Config.FILE.ALLOWED;

    // Generating Allowed types for HTML
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', '
    })

  }




  inviteePresent(value: any) {

    if (value) {
      this.totalAttendance++;
    }
    else {
      this.totalAttendance--;
    }

    if (this.totalAttendance < 5) {
      this.showInviteeDeviation = true;
    }
    else this.showInviteeDeviation = false;
  }


  // Expense Table Controls
  expenseTableActualAmountInput: any[] = [];
  changedExpenseActualAmount: number = 0;
  changesExpenseTableExpenses: any[] = [];

  onExpenseActualAmountChanges(value: any, id: any) {


    this.advancedUtilized = (this.changedInviteeLC !== 0) ? this.changedInviteeLC : this.amountTableFinalAmount;


    // console.log('before', this.advancedUtilized)

    let changedVal = this.changesExpenseTableExpenses.find(change => change.index == id);

    if (!changedVal) {
      this.changesExpenseTableExpenses.push({
        index: id,
        amount: value
      })
    }
    else {
      changedVal.amount = value;
    }

    // console.log(this.changesExpenseTableExpenses)

    for (let i = 0; i < this.changesExpenseTableExpenses.length; i++) {
      this.advancedUtilized -= this.expenseTabelDetails[i].Amount;
      this.advancedUtilized += this.changesExpenseTableExpenses[i].amount;
    }
    // console.log('after', this.advancedUtilized);
    this.changedExpenseActualAmount = this.advancedUtilized;
    this.calculateAdvanceTableDetails();



  }



  changedInviteeLC: number = 0;
  changedInviteeExpenses: any[] = [];
  onInviteeLcAmountChanges(value: any, id: any) {
    // if (Boolean(value)) {
    //   this.advancedUtilized = (this.amountTableFinalAmount !== this.changedExpenseActualAmount && this.changedExpenseActualAmount !== 0) ? this.changedExpenseActualAmount : this.amountTableFinalAmount;
    //   // console.log('advan', this.advancedUtilized);

    //   // console.log(this.inviteeTableDetails)

    //   this.advancedUtilized -= +this.inviteeTableDetails[id].LcAmount;

    //   // console.log('afterchan', this.advancedUtilized);

    //   this.advancedUtilized += value;
    //   this.changedInviteeLC = this.advancedUtilized;
    //   this.calculateAdvanceTableDetails();
    // }
    // else {
    //   this.calculateAdvanceIfNoChange();
    // }

    this.advancedUtilized = (this.changedExpenseActualAmount !== 0) ? this.changedExpenseActualAmount : this.amountTableFinalAmount;
    // console.log('aa', this.advancedUtilized)
    let changedVal = this.changedInviteeExpenses.find(change => change.index == id);

    if (!changedVal) {
      this.changedInviteeExpenses.push({
        index: id,
        amount: value
      })
    }
    else {
      changedVal.amount = value;
    }

    // console.log(this.changedInviteeExpenses)

    for (let i = 0; i < this.changedInviteeExpenses.length; i++) {
      this.advancedUtilized -= this.inviteeTableDetails[i].LcAmount;
      this.advancedUtilized += this.changedInviteeExpenses[i].amount;
    }
    this.changedInviteeLC = this.advancedUtilized;
    // console.log(this.advancedUtilized);
    this.calculateAdvanceTableDetails();
  }





  selectedEventDetails: any;
  selectedEventId: any;

  onEventSelect(eventId: any) {
    this.selectedEventId = eventId;
    // console.log(eventId)
    this.inviteeTableDetails = [];
    this.expenseTabelDetails = [];
    this.inviteeTableDetailsCopy = [];
    this.expenseTableDetailCopy = [];
    this.amountTableFinalAmount = 0;
    this.advancedUtilized = 0;
    this.amountToPayForCompany = 0;
    this.amountToPayForInitiator = 0;
    this.panelSelectionFinalAmount = 0;
    this.expenseFinalAmount = 0;
    this.inviteesFinalAmount = 0;


    this.selectedEventDetails = this.allEventList.find(eve => {
      return eve['EventId/EventRequestId'] == eventId
    })

    // console.log('Evvv', this.selectedEventDetails)

    if (Boolean(this.invitees)) {
      this.invitees.forEach(invitee => {
        if (invitee['EventId/EventRequestId'] == eventId) {

          // console.log(invitee)
          const data = {
            EventIdOrEventRequestId: invitee['EventId/EventRequestId'],
            INV: invitee.INV || ' ',
            InviteeName: invitee.HCPName || ' ',
            MisCode: invitee.MISCode+' ',
            LocalConveyance: invitee.LocalConveyance || '0',
            BtcorBte: invitee['BTC/BTE']+' ' || ' ',
            LcAmount: invitee.LcAmount+' ' || '0',
            actualExpense: invitee.LcAmount,
            inviteeSource: invitee['Invitee Source'],
            isPresent: false,
            speciality: invitee.Speciality || ' ',
            hcpType: invitee['HCP Type'] || ' '
            
          };
          this.inviteeTableDetails.push(data);
          // this.inviteeTableDetailsCopy.push(invitee);
        }
      })

    }

    if (Boolean(this.expense)) {
      this.expense.forEach(exp => {

        // console.log('aaa', exp)
        if (exp['EventId/EventRequestID'] == eventId) {
          const expense = {
            Amount: exp.Amount + '',
            Expense: exp.Expense + '',
            AmountExcludingTax: exp['AmountExcludingTax?'],
            BtcorBte: exp['BTC/BTE'],
            actualExpense: exp.Amount,

            // For API
            EventId: ' ',
            BtcAmount: ' ',
            BteAmount: ' ',
            BudgetAmount: ' '
          }
          this.expenseTabelDetails.push(expense);
          // this.expenseTableDetailCopy.push(expense);
        }
        // console.log('Expense Details', this.expenseTabelDetails)


      })
    }

    // for (let i = 0; i < this.expenseTabelDetails.length; i++) {
    //   this.expenseTableActualAmountInput.push(i)
    // }

    // this.utilityService.getPanelSelectionFinalAmount(eventId).subscribe(
    //   res => {
    //     if (Boolean(res)) {
    //       this.panelSelectionFinalAmount = res
    //       this.amountTableFinalAmount += res
    //       this.advancedUtilized += res
    //     }
    //   },
    //   err => {
    //     // console.log(err);
    //     this.panelSelectionFinalAmount = 0
    //     this.amountTableFinalAmount += 0
    //     this.advancedUtilized += 0
    //   }
    // )

    // this.utilityService.getTotalInviteesFinalAmount(eventId).subscribe(
    //   res => {
    //     if (Boolean(res)) {
    //       this.inviteesFinalAmount = res;
    //       this.amountTableFinalAmount += res;
    //       this.advancedUtilized += res
    //     }
    //   },
    //   err => {
    //     // console.log(err);
    //     this.inviteesFinalAmount = 0;
    //     this.amountTableFinalAmount += 0;
    //     this.advancedUtilized += 0;
    //   }
    // )

    // this.utilityService.getTotalExpenseFinalAmount(eventId).subscribe(
    //   res => {

    //     if (Boolean(res)) {
    //       this.expenseFinalAmount = res;
    //       this.amountTableFinalAmount += res;
    //       this.advancedUtilized += res
    //     }

    //     // this.amountTableFinalAmount = parseInt(this.expenseFinalAmount) + parseInt(this.inviteesFinalAmount) + parseInt(this.panelSelectionFinalAmount);
    //   },
    //   err => {
    //     // console.log(err)
    //     this.expenseFinalAmount = 0;
    //     this.amountTableFinalAmount += 0;
    //     this.advancedUtilized += 0;
    //   }
    // )

    // console.log('Expense Table',this.expenseTabelDetails.length);
    // console.log('Invitees', this.inviteeTableDetails);




    if (this.inviteeTableDetails.length > 0 || this.expenseTabelDetails.length > 0) {
      this.showPostEventContent = true;
      this._sendExpense(this.expenseTabelDetails);
      this._sendInvitees(this.inviteeTableDetails);
    }
    else {
      this.showPostEventContent = false;
      // alert('This Event has no associated data')
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }





  }

  addExpenseRadio: String;
  showAddExpense: boolean = false;

  onAddExpenseRadioChange(value: String) {
    // console.log(value)
    if (value == 'Yes') {
      this.showAddExpense = true;
    } else {
      this.showAddExpense = false;
    }
  }

  addExpenseFormPrePopulate() {
    /**
     * Expense
     * Amount
     * BTC/BTE
     * AmountExcluding
     */

    this.addExpenseForm.valueChanges.subscribe(
      changes => {
        // console.log(this.expenseTabelDetails)
        // console.log(changes)
        if (Boolean(changes.expenseType)) {
          if (changes.expenseType.indexOf('Food & Beverages') > -1 || changes.expenseType == "Honorarium") {
            // console.log('aa')
            this.showGstTextBox = true;
          }
          else {
            this.showGstTextBox = false
          }
        }


      }
    )
  }

  expenseTabelDetails2: any[] = [];

  addToExpenseTable() {

    if (this.addExpenseForm.valid && this.addExpenseForm.value.expenseAmountWithoutGST > 0) {


      const expense = {
        Amount: (this.addExpenseForm.value.expenseAmountWithoutGST + this.addExpenseForm.value.gstAmount) + ' ',
        Expense: this.addExpenseForm.value.expenseType || ' ',
        AmountExcludingTax: (this.addExpenseForm.value.gstAmount > 0) ? 'No' : 'Yes',
        BtcorBte: this.addExpenseForm.value.expenseBTC || ' ',
        actualExpense: (this.addExpenseForm.value.expenseAmountWithoutGST + this.addExpenseForm.value.gstAmount) + 0,

        // For API
        EventId: ' ',
        BtcAmount: ' ',
        BteAmount: ' ',
        BudgetAmount: ' '

      }

      this.amountTableFinalAmount += +expense.Amount;
      this.advancedUtilized += expense.actualExpense;
      this.expenseTabelDetails2.push(expense);
      this.calculateAdvanceTableDetails();

      this.addExpenseForm.reset();
      this.addExpenseForm.controls.expenseAmountWithoutGST.setValue(0);
      this.addExpenseForm.controls.gstAmount.setValue(0);

    }
    else {
      // alert("Fill All Fields")
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);

    }
  }




  after30DaysList: any[] = [];
  private after30Days(eventList: any) {
    // console.log('Event List', eventList)
    if (Boolean(eventList)) {
      eventList.forEach(event => {
        if (event.EventType == "Class I") {
          if(event['Initiator Email'] == this._userDetails.email){
            if (event['Honorarium Request Status'] == "Honorarium approved") {
              if (Boolean(event.EventDate)) {
                // if (this.isAfter30Days(event.EventDate)) {
                this.after30DaysList.push(event);
                this.show30DaysUpload = this.isAfter30Days(event.EventDate);
                // }
              }
            }
          }
         

        }
      }


      )
    }
    if (this.after30DaysList.length > 0) {
      // this.show30DaysUpload = true;
    }
    else {
      this.show30DaysUpload = false;
      this.showNoData = true;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
  }

  private isAfter30Days(date: string): boolean {
  
    let today: any = new Date();
    let eventDate = new Date(date);

    let Difference_In_Time = eventDate.getTime() - today.getTime();

    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

    if (Difference_In_Days < -30) {
      return true;
    }
    else {
      return false;
    }
  }


  private calculateAdvanceIfNoChange() {
    this.advancedUtilized = this.amountTableFinalAmount;
    this.amountToPayForCompany = 0;
    this.amountToPayForInitiator = 0;

  }


  private calculateAdvanceTableDetails() {

    if (this.amountTableFinalAmount < this.advancedUtilized) {
      this.amountToPayForCompany = 0;
      this.amountToPayForInitiator = this.advancedUtilized - this.amountTableFinalAmount;
    }

    if (this.amountTableFinalAmount > this.advancedUtilized) {
      this.amountToPayForInitiator = 0;
      this.amountToPayForCompany = this.amountTableFinalAmount - this.advancedUtilized;
    }

    if (this.amountTableFinalAmount == this.advancedUtilized) {
      this.amountToPayForCompany = 0;
      this.amountToPayForInitiator = 0;
      // console.log(this.amountToPayForInitiator)
    }
  }

  // File Handling:
  private _allowedTypes: string[];
  allowedTypesForHTML: string;



  thirtyDaysUploadFile: string;
  attendanceUploadFile: string;
  inviteeDeviationFile: string;
  invoiceUploadFile: string;

  deviationFiles: string[] = [];
  otherFiles: string[] = [];


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
              if (control == 'thirtyDaysUpload') {
                // this.thirtyDaysUploadFile = base64String.split(',')[1];
                this.thirtyDaysUploadFile = "30DaysDeviationFile."+extension+':'+base64String.split(',')[1];
              }
              if (control == 'inviteeDeviation') {
                // this.inviteeDeviationFile = base64String.split(',')[1];
                this.inviteeDeviationFile =  "InviteeslessThan5."+extension+':'+base64String.split(',')[1];
              }
            }
            if (type == 'other') {
              if (control == 'attendanceUpload') {
                this.attendanceUploadFile = base64String.split(',')[1];
              }
              if (control == 'invoiceUpload') {
                this.invoiceUploadFile = base64String.split(',')[1];
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
      case 'thirtyDaysUpload':
        this.deviationForm.controls.thirtyDaysUpload.reset();
        break;

      case 'attendanceUpload':
        this.uploadForm.controls.attendanceUpload.reset();
        break;

      case 'inviteeDeviation':
        this.uploadForm.controls.inviteeDeviation.reset();
        break;

    }
  }

  private _otherFiles: string[] = []
  postEventSubmit() {


    let formValidity = 0;

    if ((this.show30DaysUpload && !Boolean(this.deviationForm.value.thirtyDaysUpload))) {
      formValidity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if ((this.totalAttendance > 0 && this.totalAttendance < 5) && !Boolean(this.inviteeDeviationFile)) {
      formValidity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if(this._btcInvoiceFiles.length < this._btcSummaryCount){
      formValidity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if(this._bteSummaryCount > 0 && !Boolean(this._bteInvoiceFile)){
      formValidity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }

    if (formValidity == 0) {
      this.loadingIndicator = true
      if (Boolean(this.thirtyDaysUploadFile)) {
        this.deviationFiles.push(this.thirtyDaysUploadFile)
      }

      if (Boolean(this.inviteeDeviationFile)) {
        this.deviationFiles.push(this.inviteeDeviationFile)
      }

     
      if(this._btcInvoiceFiles.length > 0){
        this._btcInvoiceFiles.forEach(file => this._otherFiles.push(file));
      }
      if(Boolean(this._bteInvoiceFile)){
        this._otherFiles.push(this._bteInvoiceFile)
      }
      // console.log(this._otherFiles);

      let roleDetails = this._authService.decodeToken();

      const apiPayload = {
        // EventSettlement : eventSettlementInfo,
        Invitee: this.inviteeTableDetails,
        ExpenseSheets: this.expenseTabelDetails,
        EventId: this.selectedEventDetails['EventId/EventRequestId'],
        EventTopic: this.selectedEventDetails['Event Topic'],
        EventType: this.selectedEventDetails.EventType,
        EventDate: this.selectedEventDetails.EventDate,
        StartTime: this.selectedEventDetails.StartTime,
        InitiatorName: this.selectedEventDetails.InitiatorName || roleDetails['unique_name'],
        EndTime: this.selectedEventDetails.EndTime,
        VenueName: this.selectedEventDetails.VenueName || ' ',
        State: this.selectedEventDetails.State || ' ',
        City: this.selectedEventDetails.City || ' ',
        Attended: this.totalAttendance + '',
        InviteesParticipated: this.inviteeTableDetails.length + '',
        ExpenseParticipated: this.expenseTabelDetails.length+'',
        TotalExpense: `Total Panel Selection Final Amount: ${this.panelSelectionFinalAmount} | Total Invitees Final Amount : ${this.inviteesFinalAmount} | Total Expense :${this.expenseFinalAmount} | Total Budget For The Event : ${this.amountTableFinalAmount}`,
        Advance: `Advance Provided : ${this.amountTableFinalAmount} | Advance Utilized For Event : ${this.advancedUtilized} | Pay Back Amount To Company  : ${this.amountToPayForCompany} | Additional Amount Needed To Pay For Initiator : ${this.amountToPayForInitiator}`,
        Brands: this.selectedEventDetails.Brands,
        SlideKits: this.selectedEventDetails.SlideKits,
        Panalists: this.selectedEventDetails.Panelists,
        InitiatorEmail: roleDetails.email || ' ',
        RbMorBM: roleDetails['RBM_BM'] || ' ',
        SalesHead: roleDetails.SalesHead || ' ',
        MarkeringHead: roleDetails.MarketingHead || ' ',
        Compliance: roleDetails['ComplianceHead'] || "sabri.s@vsaasglobal.com",
        FinanceAccounts: roleDetails.FinanceAccounts || ' ',
        FinanceTreasury: roleDetails.FinanceTreasury || ' ',
        MedicalAffairsHead: roleDetails.MedicalAffairsHead || "sabri.s@vsaasglobal.com",
        FinanceHead: roleDetails.FinanceAccounts || "sabri.s@vsaasglobal.com",
        EventOpen30Days: (this.show30DaysUpload) ? 'Yes' : 'No',
        EventLessThan5Days: (Boolean(this.inviteeDeviationFile)) ? 'Yes' : 'No',
        PostEventSubmitted: "Yes",
        IsAdvanceRequired: this.selectedEventDetails.IsAdvanceRequired || "No",
        TotalInvitees: this.inviteeTableDetails.length + '' || '0',
        TotalAttendees: this.totalAttendance + '' || '0',
        TotalTravelAndAccomodationSpend: this.selectedEventDetails['Total Travel & Accommodation Amount'] + '' || '0',
        TotalHonorariumSpend: this.selectedEventDetails['Total Honorarium Amount'] + '' || '0',
        TotalSpend: this.selectedEventDetails['Total Budget'] + '' || '0',
        TotalLocalConveyance: this.selectedEventDetails['Total Local Conveyance'] + '' || '0',
        TotalTravelSpend: this.selectedEventDetails['Total Travel Amount'] + '' || '0',
        TotalAccomodationSpend: this.selectedEventDetails['Total Accomodation Amount'] + '' || '0',
        TotalExpenses: this.selectedEventDetails['Total Expense'] + "" || "0",
        TotalActuals: this.advancedUtilized+'',
        AdvanceUtilizedForEvents: this.advancedUtilized+'',
        PayBackAmountToCompany: this.amountToPayForCompany+'',
        AdditionalAmountNeededToPayForInitiator: this.amountToPayForInitiator+'',
        IsDeviationUpload: (Boolean(this.inviteeDeviationFile)) ? 'Yes' : 'No',
        DeviationFiles: this.deviationFiles,
        Files: this._otherFiles,
        MedicalAffairsEmail: roleDetails.MedicalAffairsHead,
        ReportingManagerEmail: roleDetails.reportingmanager,
        FirstLevelEmail: roleDetails.firstLevelManager,
        ComplianceEmail: roleDetails.ComplianceHead,
        FinanceAccountsEmail: roleDetails.FinanceAccounts,
        SalesCoordinatorEmail: roleDetails.SalesCoordinator,
        Role: roleDetails.role
      }

      this.utilityService.postEventSettlementDetails(apiPayload).subscribe(
        res => {
          // console.log(res);
          if (res.message == "Data added successfully.") {
            this.loadingIndicator = false;
            // alert("Event Settlement Submitted Successfully")
            this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_POST_SETTLEMENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
            this.showPostEventContent = false;
            this._router.navigate(['view-event-list'])
          }
        },
        err => {
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        }
      )

      console.log(apiPayload)
    }
  }


  openAddInviteeModal(): void {
    // console.log(this.selectedEventDetails['EventId/EventRequestId']);
    const dialogRef = this._dialog.open(AddInviteeModalComponent, {
      width: '80%', // Adjust the width as needed
      data: { eventId: this.selectedEventDetails['EventId/EventRequestId'] },
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("ADD Invitee CLOSED");
      this.reloadInvitees();
      // Handle the result if needed
    });
  }

  openDeleteInviteeConfirmationModal(invitee): void {
    const dialogRef = this._dialog.open(DeleteInviteeConfirmationModalComponent, {
      width: '300px', // Adjust the width as needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        // console.log(result, "deleteInvitee");
        // User confirmed deletion, call your deleteInvitee function
        this.deleteInvitee(invitee);
      }
    });
  }

  deleteInvitee(invitee): void {
    // console.log(invitee);

    this.loadingIndicator = true;
    this.utilityService.deleteInvitees(invitee.INV).subscribe(
      res => {
        // console.log(res);

        this.loadingIndicator = false;
        this._snackBarService.showSnackBar(
          Config.MESSAGE.SUCCESS.DELETE_INVITEE,
          Config.SNACK_BAR.DELAY,
          Config.SNACK_BAR.SUCCESS
        );
        this.reloadInvitees();
      }
    );
    // Implement your logic to delete the invitee
    // Call your inviteeService or perform any other necessary actions
  }

  reloadInvitees() {
    this.loadingIndicator = true;
    this.utilityService.getInviteesFast().subscribe(res => {
      this.invitees = res;
      this.onEventSelect(this.selectedEventDetails['EventId/EventRequestId']);
      this.loadingIndicator = false;
    });
  }

  // Changes Started 21/02/2024
  private _sendInvitees(inviteesList:any){
    // console.log('inv send',inviteesList)
    let dataToSend: any = {
      from : 'eventSettlementInvitees',
      data : inviteesList,
      eventId : this.selectedEventId
    }
    
    this.utilityService.sendData(dataToSend);
  }

  private _sendExpense(expenseList: any){
    // console.log('exp send',expenseList)
    let dataToSend: any = {
      from : 'eventSettlementExpense',
      data : expenseList,
      invitees : this.inviteeTableDetails,
      eventId : this.selectedEventId,
      eventType: this.selectedEventDetails.EventType,
      totalInviteesCount : this.inviteeTableDetails.length
    }
    
    this.utilityService.sendExpenseData(dataToSend);
  }

  public totalExpenseCount: number = 0;
  private _btcSummaryCount: number = 0;
  private _bteSummaryCount: number = 0;
  private _btcInvoiceFiles: string[] = [];
  private _bteInvoiceFile: string;
  private _getPayloadData() {
    this.utilityService.data.subscribe(res => {
      if (res.from == 'inviteeSummary' && res.for == 'apiPayload') {
        // console.log(res)
        this.totalAttendance = res.attendedInviteesCount;

        if (Boolean(res.attendanceDeviation)) {
          this.inviteeDeviationFile = res.attendanceDeviation;
        }
      }

      if (res.from == 'expenseSummary' && res.for == 'apiPayload') {
        this.expenseTabelDetails = res.expenseDetails;
        this.panelSelectionFinalAmount = res.panelTotalAmount;
        this.inviteesFinalAmount = res.inviteeTotalAmount;
        this.expenseFinalAmount = res.expenseTotalAmount;
        this.amountTableFinalAmount = res.advanceProvided;
        this.advancedUtilized = res.advanceUtilized;
        this.amountToPayForInitiator = res.paybackToInitiator;
        this.amountToPayForCompany = res.paybackToCompany;
        this._btcSummaryCount = res.btcSummaryCount;
        this._btcInvoiceFiles = res.btcInvoiceFiles;
        this._bteInvoiceFile = res.bteInvoiceFile;
        this._bteSummaryCount = res.bteSummaryCount;
      }
    })
  }
}

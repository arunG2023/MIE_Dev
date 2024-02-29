import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Config } from 'src/app/shared/config/common-config';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FinanceposteventComponent } from '../financepostevent/financepostevent.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FinanceaccountService } from 'src/app/shared/services/financeaccount/financeaccount.service';

@Component({
  selector: 'app-honararium-payment',
  templateUrl: './honararium-payment.component.html',
  styleUrls: ['./honararium-payment.component.css'],
})
export class HonarariumPaymentComponent implements OnInit {
  // Spinner
  loadingIndicator: boolean = false;

  honorarDetails: any;
  honortableDetails: any[] = [];

  honorarium: FormGroup;
  showHonarariumContent: Boolean = false;

  showexpense: boolean = false;
  honorariumevntid: any;
  // payload = [];

  account: any;

  accountpayload = [];
  expense: any;
  expenseTabelDetails: any[] = [];

  expensesummary: FormGroup;
  expensesheet: any[] = [];
  expensedetails: any;

  btcTabelDetails: any[] = [];
  bteTabelDetails: any[] = [];

  selectedEventDetails: any;

  btcSummaryTableDetails: any[] = [];
  btcSummaryTotal: number = 0;
  btcActualTotal: number = 0;

  bteSummaryTableDetails: any[] = [];
  bteSummaryTotal: number = 0;
  bteActualTotal: number = 0;

  showPreEventForm: boolean = false;
  showPanelTable: boolean = false;
  showExpenseTable: boolean = false;

  public allExpenseData: any;
  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();
  constructor(
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private finace: FinanceaccountService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._gethonorarium();
    this._loadExpenseSheet();
    this.honorarium = new FormGroup({
      EventId: new FormControl(''),
      jvDate: new FormControl(''),
      jvNumber: new FormControl(''),
    });
    this.expensesummary = new FormGroup({
      EventId: new FormControl(''),
      jvDate: new FormControl(''),
      jvNumber: new FormControl(''),
    });
  }

  private _gethonorarium() {
    this._utilityService
      .honorariumDetails()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe((honorDetails: any) => {
        this.loadingIndicator = false;
        this.honorarDetails = honorDetails;
      });
  }
  private _loadExpenseSheet() {
    this._utilityService
      .getPostEventExpense()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe((res) => {
        this.allExpenseData = res;
      });
  }

  _filterHonor(eventId: any) {
    this.honortableDetails = [];
    if (Boolean(this.honorarDetails)) {
      this.honorarDetails.forEach((data) => {
        if (data['EventId/EventRequestId'] == eventId) {
          data.jvDate = data['JV Date'];
          data.jvNumber = data['JV Number'];
          this.honortableDetails.push(data);
        }
      });
    }
    if (this.honortableDetails.length > 0) {
      this.showHonarariumContent = true;
    } else {
      this.showHonarariumContent = false;
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.NO_DATA,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }
  }

  private _filterExpenseDetails(value: any) {
    this.bteSummaryTableDetails = [];
    this.btcSummaryTableDetails = [];
    this.showHonarariumContent = false;
    this.selectedEventDetails = value;
    this.allExpenseData.forEach((expense) => {
      if (
        expense['EventId/EventRequestID'] ==
        this.selectedEventDetails['EventId/EventRequestId']
      ) {
        if (expense['BTC/BTE'] == 'BTC') {
          this.btcSummaryTableDetails.push(expense);
          this.btcSummaryTotal += expense.BTCAmount;
          this.btcActualTotal += expense.Amount;
        } else if (expense['BTC/BTE'] == 'BTE') {
          this.bteSummaryTableDetails.push(expense);
          this.bteSummaryTotal += expense.BTEAmount;
          this.bteActualTotal += expense.Amount;
        }
      }
    });
    if (
      this.bteSummaryTableDetails.length > 0 ||
      this.btcSummaryTableDetails.length > 0
    ) {
      this.showexpense = true;
    } else {
      this.showexpense = false;
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.NO_DATA,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
    }
  }
  getpostData(data) {
    this.showexpense = true;
    this._filterExpenseDetails(data);
  }

  gethonorariumdetails(data) {
    this.honorariumevntid = data['EventId/EventRequestId'];
    this._filterHonor(data['EventId/EventRequestId']);
  }

  updatefinanceaccount() {
    this.honortableDetails.forEach((data) => {
      this.account = {
        Id: data['Panelist ID'],
        JvNumber: this.honorarium.value.jvNumber.toString() || '0',
        JvDate: new Date(this.honorarium.value.jvDate) || ' ',
        HcpName: data['HCPName'] || ' ',
        MisCode: data.MISCode.toString() || ' ',
      };
      this.accountpayload.push(this.account);
    });
    this.loadingIndicator = true;
    this.finace.updatefinanceaccount(this.accountpayload).subscribe(
      (res) => {
        if (res.message == 'Data Updated successfully.') {
          this.loadingIndicator = false;
          this.showHonarariumContent = false;
          this._snackBarService.showSnackBar(
            Config.MESSAGE.SUCCESS.FINANCE_ACCOUNTS,
            Config.SNACK_BAR.DELAY,
            Config.SNACK_BAR.SUCCESS
          );
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

  updatefinanceexpese() {
    if (this.bteSummaryTableDetails.length > 0) {
      this.bteSummaryTableDetails.forEach((data) => {
        this.account = {
          Id: data['Expenses ID'],
          JvNumber: this.expensesummary.value.jvNumber.toString(),
          JvDate: new Date(this.expensesummary.value.jvDate),
          HcpName: ' ',
          MisCode: ' ',
        };
        this.expensesheet.push(this.account);
      });
    }

    if (this.btcSummaryTableDetails.length > 0) {
      this.btcSummaryTableDetails.forEach((data) => {
        this.account = {
          Id: data['Expenses ID'],
          JvNumber: this.expensesummary.value.jvNumber.toString(),
          JvDate: new Date(this.expensesummary.value.jvDate),
          HcpName: ' ',
          MisCode: ' ',
        };
        this.expensesheet.push(this.account);
      });
    }
    this.loadingIndicator = true;
    this.finace.UpdateFinanceAccountExpenseSheet(this.expensesheet).subscribe(
      (res) => {
        if (res.message == 'Data Updated successfully.') {
          this.loadingIndicator = false;
          this.showexpense = false;
          this._gethonorarium();
          this._snackBarService.showSnackBar(
            Config.MESSAGE.SUCCESS.FINANCE_ACCOUNTS,
            Config.SNACK_BAR.DELAY,
            Config.SNACK_BAR.SUCCESS
          );
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

  cancel() {
    this.showexpense = false;
    this.showHonarariumContent = false;
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }
}

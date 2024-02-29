import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '../../services/event-utility/utility-service.service';
import { Subject, take, takeUntil } from 'rxjs';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
import { Config } from '../../config/common-config';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { data } from 'jquery';

@Component({
  selector: 'app-invitee-selection',
  templateUrl: './invitee-selection.component.html',
  styleUrls: ['./invitee-selection.component.css']
})
export class InviteeSelectionComponent implements OnInit {
  // Spinner
  public loadingIndicator: boolean = false;
  private _isHcpMasterLoaded: boolean = false;

  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  // selection of invitees
  public isInviteeSelect: string;
  public isLocalConvenyence: string = 'No';

  // declearing variables
  // 1) for storing data from hcp master
  private _hcpDataFromHcpMaster: any;
  public hcpFilteredByMisCode: any[] = [];
  private _filteredInvitee: any;

  //form group for name and some details 
  hcpMasterForm: FormGroup;
  menariniForm: FormGroup;
  nonHcpForm: FormGroup;
  uploadFilesForm: FormGroup;

  // form group for showing local convenyence details
  inviteeLCFormForHcp: FormGroup;
  inviteeLCFormForMenarini: FormGroup;
  inviteeLCFormForNonHcp: FormGroup;

  // form group for asking yes or no
  localForHcpForm: FormGroup;
  localForMenarini: FormGroup;
  localForNonHcp: FormGroup;


  MisCode: string;
  EmployeeId: string;

  // show and hide form based on select
  showHcpForm: boolean = false;
  showMenariniForm: boolean = false;
  showNonHcpForm: boolean = false;
  showLCFormForHcp: boolean = false;
  showLCFormMenarini: boolean = false;
  showLCFormNonHcp: boolean = false;

  // declaring variables for table data stoaring
  inviteeTableDetailsForHcp: any[] = [];
  inviteeTableDetailsForMenarini: any[] = [];
  inviteeTableDetailsForNonHcp: any[] = [];


  // declaring the variable for API 
  inviteeData: any[] = [];

  EmployeeData: any;


  constructor(private _utilityService: UtilityService, private _snackBarService: SnackBarService, private _dialog: MatDialog,) { }

  ngOnInit(): void {

    // Getting allowed file types
    this._allowedTypes = Config.FILE.ALLOWED;

    // Generating Allowed types for HTML
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', '
    })

    // form controls
    this.hcpMasterForm = new FormGroup({
      inviteeName: new FormControl({ value: '', disabled: true })
    })

    this.menariniForm = new FormGroup({
      // employeeCode: new FormControl('', Validators.required),
      employeeName: new FormControl({ value: '', disabled: true })
    })

    this.nonHcpForm = new FormGroup({
      hcpName: new FormControl({ value: '', disabled: false }),
      speacility: new FormControl({ value: '', disabled: false }),
      hcpType: new FormControl({ value: '', disabled: false })
    })

    this.inviteeLCFormForHcp = new FormGroup({
      inviteeBTC: new FormControl({ value: '', disabled: false }),
      inviteeLocalConveyanceAmountExcludingTax: new FormControl({ value: '', disabled: false }),
      inviteeLocalConveyanceAmountIncludingTax: new FormControl({ value: '', disabled: false })
    })

    this.inviteeLCFormForMenarini = new FormGroup({
      inviteeBTCForMenarini: new FormControl({ value: '', disabled: false }),
      inviteeLocalConveyanceAmountExcludingTaxForMenarini: new FormControl({ value: '', disabled: false }),
      inviteeLocalConveyanceAmountIncludingTaxForMeanrini: new FormControl({ value: '', disabled: false })
    })

    this.inviteeLCFormForNonHcp = new FormGroup({
      inviteeBTCForNonHcp: new FormControl({ value: '', disabled: false }),
      inviteeLocalConveyanceAmountExcludingTaxForNonHcp: new FormControl({ value: '', disabled: false }),
      inviteeLocalConveyanceAmountIncludingTaxForNonHcp: new FormControl({ value: '', disabled: false })

    })
    this.localForHcpForm = new FormGroup({
      localYesorNoForHcp: new FormControl('', Validators.required)
    })
    this.localForMenarini = new FormGroup({
      localYesorNoForMenarini: new FormControl('', Validators.required)
    })
    this.localForNonHcp = new FormGroup({
      localYesorNoForNonHcp: new FormControl('', Validators.required)
    })
    this.uploadFilesForm = new FormGroup({
      agendaUpload: new FormControl('', Validators.required),
      invitationUploadFile: new FormControl('', Validators.required)
    })
    // api calls
    this._isHcpMasterLoaded = false;
    this._utilityService.getEmployeesFromHCPMaster().pipe(takeUntil(this._ngUnSubscribe.asObservable())).subscribe(res => {
      this._isHcpMasterLoaded = true;
      this.loadingIndicator = false;
      this._hcpDataFromHcpMaster = res;
      this._hcpDataFromHcpMaster.splice(1000);
    })

    // employee filter
    this._utilityService.employeeSearch().pipe(takeUntil(this._ngUnSubscribe.asObservable())).subscribe( res=>{
      console.log('employee datas',res);
      this.EmployeeData = res;
    })



  }

  private _filterEmployee(employeeId: string){
    console.log('employee Id',employeeId)
    if (Boolean(employeeId)) {
      let arr: any= [];
       this.EmployeeData.forEach((employee) => {
          if (employee['EmployeeId']) {
            if(employee['EmployeeId'].toString().toLowerCase().includes(employeeId.toString().toLowerCase())){
              arr.push(employee);
            }
          }
      });
      return arr;
    }
  }

  // declearing the variable for autocomplte 
  hcpFilteredByEmployeeId: any[] = [];
  public employeeCodeChange(value:string){
    console.log('employee value',value);
    this.hcpFilteredByEmployeeId = this._filterEmployee(value);
    console.log('cecking value',this._filterEmployee(value));
    if(this.hcpFilteredByEmployeeId.length == 1){
      this.menariniForm.controls.employeeName.setValue(this._filterEmployee(value)[0].FirstName+' '+this._filterEmployee(value)[0].LastName);
    }
  }

  public onInviteeValueChange(type: string) {
    if (type == 'HCP Master') {
      if (!this._isHcpMasterLoaded) {
        this.loadingIndicator = true;
      }
      else {
        this.loadingIndicator = false;
      }
      this.showHcpForm = true;
      this._localHcpFormChecking();
    }
    else if (type == 'Menarini Employees') {
      this.showMenariniForm = true;
      this._localMenariniFormChecking();

    }
    else if (type == 'Others') {
      this.showNonHcpForm = true;
      this._localNonHcpFormChecking();
    }
    else {
      this.showHcpForm = false;
      this.showMenariniForm = false;
      this.showNonHcpForm = false;
    }
  }


  public misCodeChange(value: string) {
    this.hcpFilteredByMisCode = this._filterHCPMasterInvitees(value);
    console.log(this._getFilteredInvitee(value))
    if (this.hcpFilteredByMisCode.length == 1) {
      this.hcpMasterForm.controls.inviteeName.setValue(this._getFilteredInvitee(value).HCPName)
    }
  
  }

  private _filterHCPMasterInvitees(name: string) {
    console.log('nam', Boolean(name));
    if (Boolean(name)) {
      return this._hcpDataFromHcpMaster.filter((invitee) => {
        if (invitee['MisCode']) {
          return invitee['MisCode'].toString().toLowerCase().includes(name.toString().toLowerCase());
        }
      });
    }
  }

  private _getFilteredInvitee(misCode: string) {
    console.log('mis', Boolean(misCode));
    if (Boolean(misCode)) {
      return this._hcpDataFromHcpMaster.find(
        (invitee) => invitee['MisCode'] == misCode
      );
    }
  }
  public onLcChange(value: string) {
    if (value == 'Yes') {
      this.showLCFormForHcp = true;
    }
    else {
      this.showLCFormForHcp = false
    }
  }

  private _localHcpFormChecking() {
    this.localForHcpForm.valueChanges.subscribe(changes => {
      if (changes.localYesorNoForHcp == 'Yes') {
        this.showLCFormForHcp = true;
      }
      else {
        this.showLCFormForHcp = false;
        this.inviteeLCFormForHcp.reset();
      }
    })
  }

  private _localMenariniFormChecking() {
    this.localForMenarini.valueChanges.subscribe(changes => {
      if (changes.localYesorNoForMenarini == 'Yes') {
        this.showLCFormMenarini = true;
      }
      else {
        this.showLCFormMenarini = false;
        this.inviteeLCFormForMenarini.reset();
      }
    })
  }

  private _localNonHcpFormChecking() {
    this.localForNonHcp.valueChanges.subscribe(changes => {
      if (changes.localYesorNoForNonHcp == 'Yes') {
        this.showLCFormNonHcp = true;
      }
      else {
        this.showLCFormNonHcp = false;
        this.inviteeLCFormForNonHcp.reset();
      }
    })
  }

  addedInviteesInHcp: any[] = [];
  addedInviteesInMenarini: any[] = [];
  addedInviteesInNonHcp: any[] = [];
  public btcSummary: any[] = [];
  public btcTotal: number = 0;
  public bteTotal: number = 0;
  public bteSummary: any[] = [];

  public addToInviteeTableForHcp() {
    console.log('this.hcpMasterForm.value.inviteeName',Boolean(this.hcpMasterForm.value.inviteeName))
    let formValidity: number = 0;
    if (this.MisCode == null) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.MIS_CODE_NOT_PICKED, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (!this.localForHcpForm.valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.LOCALCONVENYENCESELECT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (!this.showLCFormForHcp && !this.inviteeLCFormForHcp.valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.LOCALCONVENYENCESELECT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if(this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountIncludingTax < this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountExcludingTax){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if(!Boolean(this.hcpMasterForm.value.inviteeName)){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.MIS_CODE_NOT_PICKED, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    
    console.log('form validity', formValidity)
    if (formValidity == 0) {
      let dataForHcp = {
        hcpName: this.hcpMasterForm.value.inviteeName || '',
        misCode: this.MisCode + '' || '',
        localConvenyence: (this.showLCFormForHcp) ? 'Yes' : 'No',
        btcBte: (this.showLCFormForHcp) ? this.inviteeLCFormForHcp.value.inviteeBTC : "N/A",
        localAmountIncludingtax: ( this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountIncludingTax > 0 )?this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountIncludingTax + '':'0',
        localAmountExcludingTax: (this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountExcludingTax > 0)?this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountExcludingTax + '' :'0',
        forHcp: true
      }
      this.inviteeTableDetailsForHcp.push(dataForHcp);

      if (dataForHcp.btcBte == 'BTE') {
        let summaryBTE = {
          expense: (this.showLCFormForHcp) ? 'Local Convenyence' : 'Nil',
          includingTax: (+dataForHcp.localAmountIncludingtax > 0) ? 'Yes' : 'No',
          amount: (this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountIncludingTax > 0)?this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountIncludingTax + '' :'0',
          localAmountExcludingTax: (this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountExcludingTax > 0)?this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountExcludingTax + '' :'0',
        }
        this.bteSummary.push(summaryBTE);
        this.bteTotal += +summaryBTE.amount;

      }
      else if (dataForHcp.btcBte == 'BTC') {
        let summaryBTC = {
          expense: (this.showLCFormForHcp) ? 'Local Convenyence' : 'Nil',
          includingTax: (+dataForHcp.localAmountIncludingtax > 0) ? 'Yes' : 'No',
          amount:( this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountIncludingTax > 0)? this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountIncludingTax + '' :'0',
          localAmountExcludingTax: (this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountExcludingTax > 0)?this.inviteeLCFormForHcp.value.inviteeLocalConveyanceAmountExcludingTax + '':'0',
        }
        this.btcSummary.push(summaryBTC);
        this.btcTotal += +summaryBTC.amount;
      }

      this.inviteeTableDetailsForHcp.forEach(hcp => {
        console.log(hcp);
        let DataHcp = {
          "EventIdOrEventRequestId": ' ',
          "MisCode": hcp.misCode,
          "LocalConveyance": hcp.localConvenyence,
          "BtcorBte": hcp.btcBte,
          "LcAmount": hcp.localAmountIncludingtax + '' || 0,
          "InviteedFrom": (this.showLCFormForHcp) ? 'HCP Master' : '',
          "InviteeName": hcp.hcpName,
          "Speciality": hcp.speciality || ' ',
          "HcpType": hcp.hcpType || ' '
        }
        this.inviteeData.push(DataHcp);
      })
      this.clicksNext();
      console.log('for hcp data ', this.inviteeData);


      console.log('bte', this.bteSummary);
      console.log('btc', this.btcSummary)

      this.hcpMasterForm.reset();
      this.inviteeLCFormForHcp.reset();
      this.localForHcpForm.reset();
      this.MisCode = '';

    }


  }

  public openInviteeUpdateModalForHcp(inviteeForHcp: any) {
    console.log('invitee dafe', inviteeForHcp)
    const dialogRef = this._dialog.open(ModalComponent, {
      width: '500px',
      height: '400px',
      data: inviteeForHcp,
    });
  }

  public deleteInviteeForHcp(id: number, invitee: any) {
    this.inviteeTableDetailsForHcp.splice(id, 1);
    // this.isStep6Valid = (this.inviteeTableDetailsForHcp.length > 0) ? true : false;

    this._hcpDataFromHcpMaster.push(this.addedInviteesInHcp.find(inv => invitee.MisCode == inv.MisCode));
    this._hcpDataFromHcpMaster.sort((inv1, inv2) => {
      return inv1.HCPName.localeCompare(inv2.HCPName)
    })

  }

  public addToInviteeTableForMenarini() {
    let formValidity: number = 0;
    if (this.showMenariniForm && this.EmployeeId == '') {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.MENARINI_EMPLOYEE_CODE_MISSING, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (!this.localForMenarini.valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.LOCALCONVENYENCESELECT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (!this.inviteeLCFormForMenarini) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.LOCALCONVENYENCESELECT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if(this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountIncludingTaxForMeanrini < this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountExcludingTaxForMenarini ){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if(!Boolean(this.menariniForm.value.employeeName)){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.MIS_CODE_NOT_PICKED, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (formValidity == 0) {
      let dataForMenarini = {
        empolyeeName: this.menariniForm.value.employeeName,
        employeeCode: this.EmployeeId,
        localConvenyence: (this.showLCFormMenarini) ? 'Yes' : 'No',
        btcBte: (this.showLCFormMenarini) ? this.inviteeLCFormForMenarini.value.inviteeBTCForMenarini : "N/A",
        localAmountIncludingtax: (this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountIncludingTaxForMeanrini > 0)?this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountIncludingTaxForMeanrini + '':'0',
        localAmountExcludingTax: (this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountExcludingTaxForMenarini > 0)?this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountExcludingTaxForMenarini + '' :'0',
        forMenariniData: true
      }
      this.inviteeTableDetailsForMenarini.push(dataForMenarini);

      if (dataForMenarini.btcBte == 'BTE') {
        let summaryBTE = {
          expense: (this.showLCFormMenarini) ? 'Local Convenyence' : 'Nil',
          includingTax: (+dataForMenarini.localAmountIncludingtax > 0) ? 'Yes' : 'No',
          amount: (this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountIncludingTaxForMeanrini > 0)?this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountIncludingTaxForMeanrini + '' :'0',
          localAmountExcludingTax: (this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountExcludingTaxForMenarini > 0)?this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountExcludingTaxForMenarini + '' : '0',
        }
        this.bteSummary.push(summaryBTE);
        this.bteTotal += +summaryBTE.amount;

      }
      else if (dataForMenarini.btcBte == 'BTC') {
        let summaryBTC = {
          expense: (this.showLCFormMenarini) ? 'Local Convenyence' : 'Nil',
          includingTax: (+dataForMenarini.localAmountIncludingtax > 0) ? 'Yes' : 'No',
          amount: (this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountIncludingTaxForMeanrini > 0)?this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountIncludingTaxForMeanrini + '': '0',
          localAmountExcludingTax:( this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountExcludingTaxForMenarini > 0) ?this.inviteeLCFormForMenarini.value.inviteeLocalConveyanceAmountExcludingTaxForMenarini + '' : '0',
        }
        this.btcSummary.push(summaryBTC);
        this.btcTotal += +summaryBTC.amount;

      }
      this.menariniForm.reset();
      this.inviteeLCFormForMenarini.reset();
      this.localForMenarini.reset();
      this.EmployeeId = ''

      this.inviteeTableDetailsForMenarini.forEach(menarini => {
        console.log(menarini);
        let DataMenarini = {
          "EventIdOrEventRequestId": ' ',
          "MisCode": menarini.employeeCode,
          "LocalConveyance": menarini.localConvenyence,
          "BtcorBte": menarini.btcBte,
          "LcAmount": menarini.localAmountIncludingtax + '' || 0,
          "InviteedFrom": (this.showLCFormMenarini) ? 'Menarini Employees' : ' ',
          "InviteeName": menarini.empolyeeName,
          "Speciality": menarini.speciality || ' ',
          "HcpType": menarini.hcpType || ' '
        }
        this.inviteeData.push(DataMenarini);
      })
      this.clicksNext();


      console.log('bte', this.bteSummary);
      console.log('btc', this.btcSummary)
    }

  }

  public openInviteeUpdateModalForMenarini(inviteeForMenarini: any) {
    console.log('from menarini ', inviteeForMenarini)
    const dialogRef = this._dialog.open(ModalComponent, {
      width: '500px',
      height: '400px',
      data: inviteeForMenarini,
    });
  }

  public deleteInviteeForMenarini(id: number, invitee: any) {
    this.inviteeTableDetailsForMenarini.splice(id, 1);
    // this.isStep6Valid = (this.inviteeTableDetailsForHcp.length > 0) ? true : false;

    this._hcpDataFromHcpMaster.push(this.addedInviteesInMenarini.find(inv => invitee.MisCode == inv.MisCode));
    this._hcpDataFromHcpMaster.sort((inv1, inv2) => {
      return inv1.HCPName.localeCompare(inv2.HCPName)
    })

  }


  public addToInviteeTableForNonHcp() {
    let formValidity: number = 0;
    if (this.showLCFormNonHcp && !this.localForNonHcp.valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.ENTERS_OTHERS_INVITEE_NAME, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (!this.localForNonHcp.valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.LOCALCONVENYENCESELECT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (!this.inviteeLCFormForNonHcp.valid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.LOCALCONVENYENCESELECT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if(this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp < this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountExcludingTaxForNonHcp){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if(!Boolean(this.nonHcpForm.value.hcpName)){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.MIS_CODE_NOT_PICKED, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }
    if (formValidity == 0) {
      let dataForNonHcp = {
        hcpName: this.nonHcpForm.value.hcpName,
        speciality: this.nonHcpForm.value.speacility,
        hcpType: this.nonHcpForm.value.hcpType,
        localConvenyence: (this.showLCFormNonHcp) ? 'Yes' : 'No',
        btcBte: (this.showLCFormNonHcp) ? this.inviteeLCFormForNonHcp.value.inviteeBTCForNonHcp : "N/A",
        localAmountIncludingtax: (this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp > 0)?this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp + '' :'0',
        localAmountExcludingTax: (this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountExcludingTaxForNonHcp > 0)?this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountExcludingTaxForNonHcp + '' : '0',
        forNonHcpData: true
      }
      this.inviteeTableDetailsForNonHcp.push(dataForNonHcp);

      if (dataForNonHcp.btcBte == 'BTE') {
        let summaryBTE = {
          hcpName: dataForNonHcp.hcpName,
          expense: (this.showLCFormNonHcp) ? 'Local Convenyence' : 'Nil',
          includingTax: (+dataForNonHcp.localAmountIncludingtax > 0) ? 'Yes' : 'No',
          amount: (this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp > 0)?this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp + '' : '0',
          localAmountExcludingTax: (this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountExcludingTaxForNonHcp > 0)?this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountExcludingTaxForNonHcp + '' : '0',
        }
        this.bteSummary.push(summaryBTE);
        this.bteTotal += +this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp;

      }
      else if (dataForNonHcp.btcBte == 'BTC') {
        let summaryBTC = {
          expense: (this.showLCFormNonHcp) ? 'Local Convenyence' : 'Nil',
          includingTax: (+dataForNonHcp.localAmountIncludingtax > 0) ? 'Yes' : 'No',
          amount: (this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp > 0 )?this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp + '' : '0',
          localAmountExcludingTax: (this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountExcludingTaxForNonHcp > 0)?this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountExcludingTaxForNonHcp + '' : '0',
        }
        this.btcSummary.push(summaryBTC);
        this.btcTotal += +this.inviteeLCFormForNonHcp.value.inviteeLocalConveyanceAmountIncludingTaxForNonHcp;

      }

      this.inviteeTableDetailsForNonHcp.forEach(nonhcp => {
        console.log('non hcp data', nonhcp)
        let Data = {
          "EventIdOrEventRequestId": ' ',
          "MisCode": ' ',
          "LocalConveyance": nonhcp.localConvenyence,
          "BtcorBte": nonhcp.btcBte,
          "LcAmount": nonhcp.localAmountIncludingtax + '' || 0,
          "InviteedFrom": (this.showLCFormNonHcp) ? 'Others' : '',
          "InviteeName": nonhcp.hcpName,
          "Speciality": nonhcp.speciality,
          "HcpType": nonhcp.hcpType
        }
        this.inviteeData.push(Data);
      })
      this.clicksNext();

      console.log('for api payload', this.inviteeData);
      console.log('bte', this.bteSummary);
      console.log('btc', this.btcSummary)
      this.nonHcpForm.reset();
      this.localForNonHcp.reset();
      this.inviteeLCFormForNonHcp.reset();
    }

   

  }

  public openInviteeUpdateModalForNonHcp(inviteeForNonHcp: any) {
    console.log('form non hcp master', inviteeForNonHcp)
    const dialogRef = this._dialog.open(ModalComponent, {
      width: '500px',
      height: '400px',
      data: inviteeForNonHcp,
    });
  }

  public deleteInviteeForNonHcp(id: number, invitee: any) {
    this.inviteeTableDetailsForNonHcp.splice(id, 1);
    // this.isStep6Valid = (this.inviteeTableDetailsForHcp.length > 0) ? true : false;

    this._hcpDataFromHcpMaster.push(this.addedInviteesInNonHcp.find(inv => invitee.MisCode == inv.MisCode));
    this._hcpDataFromHcpMaster.sort((inv1, inv2) => {
      return inv1.HCPName.localeCompare(inv2.HCPName)
    })
    console.log('deleted invitee', invitee)
    //     this.bteSummary.forEach(remove=>{
    //       if(remove.hcpName == invitee.hcpName){
    //         this.bteSummary.splice(invitee.hcpName,0);
    // console.log('afer deelleted',this.bteSummary)      }
    //     })

  }

  private _sendDataToParent(data: any) {
    this._utilityService.sendData(data);
  }
  private clicksNext() {
    let dataToSend = {
      from: 'inviteeComponent',
      eventRequestInvitees: this.inviteeData,
      otherFiles: [this._agendaUploadFile, this._invitationUploadFile],
      bteSummary: this.bteSummary,
      btcSummary: this.btcSummary,
      btctotal: this.btcTotal,
      btetotal: this.bteTotal
    }

    this._sendDataToParent(dataToSend);
    console.log('final data ', dataToSend);

    let summary = {
      summaryOfBTC: this.btcSummary,
      summaryOfBTE: this.bteSummary
    }
    console.log('final summary', summary)


  }

  private _agendaUploadFile: string;
  private _invitationUploadFile: string;

  // File Handling
  private _allowedTypes: string[];
  public allowedTypesForHTML: string;
  private _otherFiles: any[] = []
    ;
  // File Handling
  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {

      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE) {

        const extension = file.name.split('.')[1];

        const reader = new FileReader();

        console.log('extension', this._allowedTypes.includes(extension))
        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;

            if (type == 'other') {
              if (control == 'agendaUpload') {
                // this._agendaUploadFile = base64String.split(',')[1];
                this._agendaUploadFile = file.name + ':' + base64String.split(',')[1];
                this.clicksNext();
              }
              else if (control == 'invitationUploadFile') {
                // this._invitationUploadFile = base64String.split(',')[1];
                this._invitationUploadFile = file.name + ':' + base64String.split(',')[1];
                this.clicksNext();
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
      case 'nocUpload':
        this.uploadFilesForm.controls.agendaUpload.reset();
        break;

      case 'fcpaUpload':
        this.uploadFilesForm.controls.invitationUploadFile.reset();
        break;
    }
  }





}

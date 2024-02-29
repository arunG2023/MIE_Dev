import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddEmployeesComponent } from 'src/app/main/add-employees/add-employees.component';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';



@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  // Spinner
  public loadingIndicator: boolean = false;

  updateForm: FormGroup;

  // Data From Sheet
  roleDetails: any;

  // Update Fields
  firstName: string;
  lastName: string;
  userName: string;
  roleName: string;
  roleId: string;

  text: string = "closed";

  // Brand Details
  brandUpdateForm: FormGroup;
  showBrandForm: boolean = false;

  brandDetails: any;
  brandName: string;
  percentageAllocation: number;
  projectId: string;

  // HCP Update
  showHCPForm: boolean = false;

  hcpUpdateForm: FormGroup;


  private hcpRole: string;
  private hcpName: string;
  private misCode: string;
  private goNonGo: string;
  private honarariumAmount: string;
  private travelAmount: string;
  private localconveyanceAount: string;
  private accomAmount: string;



  // Invitee Update
  showInviteeForm: boolean = false;


  inviteeUpdateFormForHcp: FormGroup;

  forHcpHcpName: string;
  ForHcpmisCode: string;
  ForHcplocalConveyance: string;
  ForHcpbtc: string;
  ForHcplcAmountForIncludingTax: string;
  ForHcplcAmountForExcludingTax: string;


  // Expense Update
  showExpenseForm: boolean = false;

  expenseUpdateForm: FormGroup;

  private expenseType: string;
  private expenseAmount: string;
  private isExcludingTax: string;
  private isExpenseBtc: string;


  //honorarium update form
  showhonorariumForm: boolean = false;

  honorariumUpdateForm: FormGroup;

  hcprole: any;
  hcpname: string;
  miscode: number;
  GONGO: string;
  isExclucingTax: string;

  // summary preview 
  summaryPreview: boolean = false;
  class1PreviewData: any;
  class1OrWebinarEventData: any;

  stallfabricationUpdateForm: FormGroup
  showstallExpenseForm: boolean = false;
  // Hcp expense update form
  hcpExpenseUpdate: FormGroup;

  // expense details in HCP selection
  expenseValue: string;
  RegistrationAmount: number;
  expenseBtc: string;
  HcpUpdateExpense: boolean = false;

  // hcp update form 
  hcpupdate: FormGroup;
  hcpupdatedetails: boolean = false;

  hcpnameforHCPconsultant: string;
  miscodeforHCPconsultant: string;
  hcptypeforHCPconsultant: string;
  travelAmountforHCPconsultant: string;
  accAmountforHCPconsultant: string;
  lcAmountforHCPconsultant: string;
  registrationAmountforHCPconsultant: string;
  budgetAmountforHCPconsultant: string;


  // hcp consultant preview 
  HCPpreview: FormGroup;
  showHcpPreview: boolean = false;
  HcpConsultantsData: any;

  // menarini employee update form
  inviteeUpdateFormForMenarini: FormGroup;

  employeeNameForMenarini: string;
  localConveyanceForMenarini: string;
  lcAmountForIncludingTaxForMenarini: string;
  lcAmountForExcludingTaxForMenarini: string;
  btcForMenarini: string;
  employeeCodeForMenarini: string;

  public inviteeUpdateForMenarini: boolean = false;
  //for non hcp form group 
  inviteeUpdateFormForNonHcp: FormGroup;

  hcpnameForNonHcp: string;
  specialityForNonHcp: string;
  hcpTypeForNonHcp: string;
  localConveyanceForNonHcp: string;
  lcAmountForIncludingTaxForNonHcp: string;
  lcAmountForExcludingTaxForNonHcp: string;
  btcForNonHcp: string

  showInviteeFormForNonHcp: boolean = false;

  // Benificiary Update
  private _initiatorDetails: any;
  public showBenificiaryUpdateForm: boolean = false;
  public internationalBenificiaryForm: FormGroup;
  public showInternationalBenificiaryUpdateForm: boolean = false;

  public benificiaryForm: FormGroup;

  private _vendorDetails: any

  private _benificiaryName: string;
  private _bankAccountNumber: string;
  private _nameAsPerPAN: string;
  private _panCardNumber: string;
  private _ifscCode: string;
  private _emailId: string;
  private _vendorId: string;
  private _swiftCode: string;
  private _ibnNumber: string;

  constructor(public dialogRef: MatDialogRef<AddEmployeesComponent>,
    private _snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data,
    private utilityService: UtilityService,
    private _authService: AuthService) {

    utilityService.getRoles().subscribe(
      res => {
        this.roleDetails = res
        console.log(this.roleDetails)
      },
      err => {
        alert("Unexpected Error Happened")
      }
    )

    // this.fName = data.name


    // console.log(data);
    if (data.BrandName) {
      console.log(data);
      this.brandDetails = data;
      this.showBrandForm = true;
      this.brandName = data.BrandName;
      this.percentageAllocation = data.PercentAllocation;
      this.projectId = data.ProjectId;
    }
    else if (data.HcpRole) {
      this.showHCPForm = true;
      this.hcpRole = data.HcpRole;
      this.hcpName = data.HcpName;
      this.misCode = data.MisCode
      this.goNonGo = data.GOorNGO;
      this.honarariumAmount = data.HonarariumAmount;
      this.localconveyanceAount = data.Travel;
      this.travelAmount = data.LocalConveyance;
      this.accomAmount = data.Accomdation;
    }
    else if (data.forHcp) {
      this.showInviteeForm = true;
      this.forHcpHcpName = data.hcpName;
      // this.localConveyanceForHcp = data.LocalConveyance;
      // this.btcForHcp = data.btcBte;
      // this.lcAmountForIncludingTaxForHcp = data.localAmountIncludingtax,
      // this.lcAmountForExcludingTaxForHcp = data.localAmountExcludingTax,
      // this.misCodeForHcp = data.misCode
    }
    else if (data.forMenariniData) {
      this.inviteeUpdateForMenarini = true;
      this.employeeNameForMenarini = data.empolyeeName,
        this.employeeCodeForMenarini = data.employeeCode,
        this.btcForMenarini = data.btcBte,
        this.localConveyanceForMenarini = data.localConvenyence,
        this.lcAmountForExcludingTaxForMenarini = data.localAmountExcludingTax,
        this.lcAmountForIncludingTaxForMenarini = data.localAmountIncludingtax
      console.log('from model component for menarini master', data.inviteeForMenarini)

    }
    else if (data.forNonHcpData) {
      this.showInviteeFormForNonHcp = true;
      this.hcpTypeForNonHcp = data.hcpType,
        this.hcpnameForNonHcp = data.hcpName,
        this.specialityForNonHcp = data.speciality,
        this.localConveyanceForNonHcp = data.localConvenyence,
        this.lcAmountForExcludingTaxForNonHcp = data.localAmountExcludingTax,
        this.lcAmountForIncludingTaxForNonHcp = data.localAmountIncludingtax,
        this.btcForNonHcp = data.btcBte
      console.log('from model component for Non Hcp master', data.inviteeForNonHcp)


    }
    else if (data.stallexpense == true) {
      this.showstallExpenseForm = true;

      this.expenseType = data.Expense;
      this.expenseAmount = data.Amount;
      this.isExpenseBtc = data.AmountExcludingTax;
      // this.isExcludingTax = data.BtcorBte;
    }
    else if (data.Expense) {
      this.showExpenseForm = true;
console.log('data from expense',data)
      this.expenseType = data.Expense;
      this.expenseAmount = data.RegstAmount;
      this.isExpenseBtc = data['BTC_BTE'];
      this.isExcludingTax = data.AmountExcludingTax;
    }

    else if (data.forHonararium) {
      this.showhonorariumForm = true;
    }
    else if (data.Class1 || data.Webinar) {
      this.summaryPreview = true;
      this.class1PreviewData = data;
      if (data.Class1) {
        this.class1OrWebinarEventData = data.Class1;
      }
      else {
        this.class1OrWebinarEventData = data.Webinar
      }
      this.slidekitPreview();
      console.log('classI/webinar', this.class1PreviewData)
    }
    else if (data.forHCPConsultants) {
      this.HcpUpdateExpense = true;
      this.expenseValue = data.expenseType,
        this.RegistrationAmount = data.RegistrationAmount,
        this.expenseBtc = data.isExpenseBtc
    }
    else if (data.Hcpupdate) {
      this.hcpupdatedetails = true;
      this.hcpnameforHCPconsultant = data.HcpName,
        this.miscodeforHCPconsultant = data.MisCode,
        this.hcptypeforHCPconsultant = data.HcpType,
        this.lcAmountforHCPconsultant = data.LcAmount,
        this.accAmountforHCPconsultant = data.AccomAmount,
        this.budgetAmountforHCPconsultant = data.BudgetAmount,
        this.travelAmountforHCPconsultant = data.TravelAmount,
        this.registrationAmountforHCPconsultant = data.RegistrationAmount
      console.log(data)
    }
    else if (data.HcpConsultant) {
      this.showHcpPreview = true;
      this.HcpConsultantsData = data;
      console.log('from modal', this.HcpConsultantsData);
    }

    // Benificiary Update
    else if (data.for == 'NormalBenificiaryUpdate') {
      this.showBenificiaryUpdateForm = true;
      this._vendorDetails = data;
      this._bankAccountNumber = data.BankAccountNumber;
      this._benificiaryName = data.BeneficiaryName;
      this._panCardNumber = data.PanNumber;
      this._nameAsPerPAN = data.PanCardName;
      this._ifscCode = data.IfscCode;
      this._emailId = data['"Email "'];
      this._vendorId = data.VendorId;

    }
    else if (data.for == 'InternationalBenificiaryUpdate') {
      this.showInternationalBenificiaryUpdateForm = true;
      this._vendorDetails = data;
      this._bankAccountNumber = data.BankAccountNumber;
      this._benificiaryName = data.BeneficiaryName;
      this._emailId = data['"Email "'];
      this._vendorId = data.VendorId;
      this._swiftCode = data['Swift Code'];
      this._ibnNumber = data['IBN Number']
    }
    else {
      this.showBrandForm = false;
      this.showHCPForm = false;
      this.showInviteeForm = false;
      this.showExpenseForm = false;
      this.showhonorariumForm = false;
      this.roleId = data.RoleId;
      this.firstName = data.FirstName;
      this.lastName = data.LastName;
      this.userName = data.CreatedBy;
      this.roleName = data.RoleName;
      this.showstallExpenseForm = false;
      this.showBenificiaryUpdateForm = false;
      this.showInternationalBenificiaryUpdateForm = false;
    }

    this.brandUpdateForm = new FormGroup({
      brandName: new FormControl({ value: this.brandName, disabled: true }),
      percentageAllocation: new FormControl(this.percentageAllocation),
      projectId: new FormControl({ value: this.projectId, disabled: true })
    })

    this.hcpUpdateForm = new FormGroup({
      hcpRole: new FormControl({ value: this.hcpRole, disabled: true }),
      hcpName: new FormControl({ value: this.hcpName, disabled: true }),
      misCode: new FormControl({ value: this.misCode, disabled: true }),
      goNonGo: new FormControl({ value: this.goNonGo, disabled: true }),
      honarariumAmount: new FormControl({ value: this.honarariumAmount, disabled: true }),
      travelAmount: new FormControl({ value: this.travelAmount, disabled: true }),
      localConAmount: new FormControl({ value: this.localconveyanceAount, disabled: true }),
      accomAmount: new FormControl({ value: this.accomAmount, disabled: true })
    })

    this.inviteeUpdateFormForHcp = new FormGroup({
      hcpNameForHcpForm: new FormControl({ value: this.forHcpHcpName, disabled: true }),
      misCodeForHcp: new FormControl({ value: this.ForHcpmisCode, disabled: true }),
      isLocalConveyanceForHcp: new FormControl({ value: this.ForHcplocalConveyance, disabled: true }),
      btcForHcp: new FormControl({ value: this.ForHcpbtc, disabled: true }),
      lcAmountForHcpInculdingTaxForHcp: new FormControl({ value: this.ForHcplcAmountForIncludingTax, disabled: true }),
      lcAmountForHcpExculdingTaxForHcp: new FormControl({ value: this.ForHcplcAmountForExcludingTax, disabled: true }),
    })

    this.inviteeUpdateFormForMenarini = new FormGroup({
      employeeName: new FormControl({ value: this.employeeNameForMenarini, disabled: true }),
      employeeCode: new FormControl({ value: this.employeeCodeForMenarini, disabled: true }),
      isLocalConveyance: new FormControl({ value: this.localConveyanceForMenarini, disabled: true }),
      btc: new FormControl({ value: this.btcForMenarini, disabled: true }),
      lcAmountForHcpInculdingTax: new FormControl({ value: this.lcAmountForIncludingTaxForMenarini, disabled: true }),
      lcAmountForHcpExculdingTax: new FormControl({ value: this.lcAmountForExcludingTaxForMenarini, disabled: true }),
    })


    this.inviteeUpdateFormForNonHcp = new FormGroup({
      hcpNameForNonHcp: new FormControl({ value: this.hcpnameForNonHcp, disabled: true }),
      specialityForNonHcp: new FormControl({ value: this.specialityForNonHcp, disabled: true }),
      hcpTypeForNonHcp: new FormControl({ value: this.hcpTypeForNonHcp, disabled: true }),
      isLocalConveyanceForNonHcp: new FormControl({ value: this.localConveyanceForNonHcp, disabled: true }),
      btcForNonHcp: new FormControl({ value: this.btcForNonHcp, disabled: true }),
      lcAmountForHcpInculdingTaxForNonHcp: new FormControl({ value: this.lcAmountForIncludingTaxForNonHcp, disabled: true }),
      lcAmountForHcpExculdingTaxForNonHcp: new FormControl({ value: this.lcAmountForExcludingTaxForNonHcp, disabled: true }),
    })

    this.expenseUpdateForm = new FormGroup({
      expenseType: new FormControl({ value: this.expenseType, disabled: true }),
      expenseAmount: new FormControl({ value: this.expenseAmount, disabled: true }),
      isExclucingTax: new FormControl({ value: this.isExcludingTax, disabled: true }),
      isExpenseBtc: new FormControl({ value: this.isExpenseBtc, disabled: true })
    })

    this.updateForm = new FormGroup({
      firstName: new FormControl(this.firstName, [Validators.required]),
      lastName: new FormControl(this.lastName, [Validators.required]),
      userName: new FormControl(this.userName, [Validators.required]),
      roleName: new FormControl(this.roleId, [Validators.required])
    })

    this.honorariumUpdateForm = new FormGroup({
      hcprole: new FormControl(this.hcpName, [Validators.required]),
      hcpname: new FormControl(this.hcpName, [Validators.required]),
      miscode: new FormControl(this.misCode, [Validators.required]),
      GONGO: new FormControl(this.GONGO, [Validators.required]),
      isExclucingTax: new FormControl(this.isExclucingTax, [Validators.required])
    })


    this.stallfabricationUpdateForm = new FormGroup({
      expenseType: new FormControl({ value: this.expenseType, disabled: true }),
      expenseAmount: new FormControl({ value: this.expenseAmount, disabled: false }),

      isExpenseBtc: new FormControl({ value: this.isExpenseBtc, disabled: true })
    })


    this.hcpExpenseUpdate = new FormGroup({
      expenseType: new FormControl({ value: this.expenseValue, disabled: true }),
      registrationAmount: new FormControl({ value: this.RegistrationAmount, disabled: true }),
      expenseBtc: new FormControl({ value: this.expenseBtc, disabled: true })
    })

    this.hcpupdate = new FormGroup({
      hcpnamehcp: new FormControl({ value: this.hcpnameforHCPconsultant, disabled: true }),
      miscodehcp: new FormControl({ value: this.miscodeforHCPconsultant, disabled: true }),
      hcptypehcp: new FormControl({ value: this.hcptypeforHCPconsultant, disabled: true }),
      travelAmounthcp: new FormControl({ value: this.travelAmountforHCPconsultant, disabled: true }),
      accAmounthcp: new FormControl({ value: this.accAmountforHCPconsultant, disabled: true }),
      lcAmounthcp: new FormControl({ value: this.lcAmountforHCPconsultant, disabled: true }),
      registrationAmounthcp: new FormControl({ value: this.registrationAmountforHCPconsultant, disabled: true }),
      budgetAmounthcp: new FormControl({ value: this.budgetAmountforHCPconsultant, disabled: true })

    })

    this.benificiaryForm = new FormGroup({
      benificiaryName: new FormControl(this._benificiaryName, Validators.required),
      bankAccountNumber: new FormControl({ value: this._bankAccountNumber, disabled: false }, Validators.required),
      //  bankName: new FormControl({ value: '', disabled: false },Validators.required),
      nameAsPerPAN: new FormControl({ value: this._nameAsPerPAN, disabled: false }, Validators.required),
      panCardNumber: new FormControl({ value: this._panCardNumber, disabled: false }, Validators.required),
      ifscCode: new FormControl({ value: this._ifscCode, disabled: false }, Validators.required),
      uploadPAN: new FormControl('', ),
      emailId: new FormControl(this._emailId),
      uploadCheque: new FormControl('', ),
    })

    this.internationalBenificiaryForm = new FormGroup({
      benificiaryNameForInternational: new FormControl(this._benificiaryName, Validators.required),
      // bankAccountNameForInternational: new FormControl('', Validators.required),
      bankAccountNumberForInternational: new FormControl(this._bankAccountNumber, Validators.required),
      swiftCode: new FormControl({ value: this._swiftCode, disabled: false }, Validators.required),
      ibnNumber: new FormControl({ value: this._ibnNumber, disabled: false }, Validators.required),
      emailIdForInternational: new FormControl({ value: this._emailId, disabled: false }),
      uploadTaxResidenceCertificate: new FormControl('',),
      taxResidenceCertificateDate: new FormControl('', ),
      // totalAmountForEachHCPInternational: new FormControl({value:'',disabled:true})
    })
  }

  close() {
    this.dialogRef.close(this.text)
  }

  panelDetails: any[] = [];
  private slidekitPreview() {
    console.log(this.class1PreviewData.EventRequestHcpRole);
    console.log(this.class1PreviewData.EventRequestHCPSlideKits);
    for (let i = 0; i < this.class1PreviewData.EventRequestHcpRole.length; i++) {
      const panelData = {
        hcpName: this.class1PreviewData.EventRequestHcpRole[i].HcpName,
        hcpRole: this.class1PreviewData.EventRequestHcpRole[i].HcpRole,
        misCode: this.class1PreviewData.EventRequestHcpRole[i].MisCode,
        hcpType: this.class1PreviewData.EventRequestHcpRole[i].GOorNGO,
        slideKitSelection: this.class1PreviewData.EventRequestHCPSlideKits[i].SlideKitType
      }
      this.panelDetails.push(panelData);
      console.log('form modal', this.panelDetails);

    }


  }

  updatedData: any;

  submit() {
    if (this.updateForm.valid) {
      // console.log(this.updateForm.value)
      this.data.FirstName = this.updateForm.value.firstName;
      this.data.LastName = this.updateForm.value.lastName;
      this.data.CreatedBy = this.updateForm.value.userName;
      this.data.RoleName = this._getRoleName(this.updateForm.value.roleName).RoleName;
      this.data.RoleId = this.updateForm.value.roleName;
      console.log(this.data)
      this.utilityService.updateEmployees(this.data).subscribe(
        res => {
          console.log(res);
        },
        err => {
          alert("Unexpected Error Happened")
        }
      )

      this.dialogRef.close(this.data)
    }

  }

  updateBrand() {
    if (this.brandUpdateForm.valid) {
      this.brandDetails.PercentAllocation = this.brandUpdateForm.controls.percentageAllocation.value + '';

      this.dialogRef.close(this.brandDetails)
    }

  }

  updateHCP() {

  }

  updateInvitee() {
    this.dialogRef.close(this.text)
  }

  updateExpense() {

  }

  updateStallExpense() {
    if (this.stallfabricationUpdateForm.valid) {
      this.brandDetails.PercentAllocation = this.stallfabricationUpdateForm.controls.expenseAmount.value + '';

      this.dialogRef.close(this.stallfabricationUpdateForm)
    }
  }

  ngOnInit(): void {
    this._initiatorDetails = this._authService.decodeToken();
    
    // Getting allowed file types
    this._allowedTypes = Config.FILE.ALLOWED;

    // Generating Allowed types for HTML
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', '
    })

  }



  public updateBenificiaryDetails() {
    if (this.benificiaryForm.valid) {

      let apiPayLoad = {
        VendorId: this._vendorId,
        InitiatorNameName: this._initiatorDetails['unique_name'],
        InitiatorEmail: this._initiatorDetails.email,
        VendorAccount: this._vendorDetails.VendorAccount+'' || ' ',
        MisCode: " ",
        BenificiaryName: this.benificiaryForm.value.benificiaryName,
        PanCardName: this.benificiaryForm.value.nameAsPerPAN,
        PanNumber: this.benificiaryForm.value.panCardNumber+'',
        BankAccountNumber: this.benificiaryForm.value.bankAccountNumber+'',
        IfscCode: this.benificiaryForm.value.ifscCode+'',
        SwiftCode: " ",
        IbnNumber: " ",
        Email: this.benificiaryForm.value.emailId || ' ',
        PanCardDocument: this._panCardFile,
        ChequeDocument: this._chequeFile,
        TaxResidenceCertificate: "",
        TaxResidenceCertificateDate: "2024-02-21T05:22:59.918Z",
      }
      console.log(apiPayLoad)
      
      this.loadingIndicator = true;
      this.utilityService.putVendorDetails(apiPayLoad).subscribe(res => {
        this.loadingIndicator = false;
        if(res.message == 'Data Updated successfully.'){
          this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.BENIFICIARY_UPDATE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
          this.close();
        }

      },
      err => {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      })
    }
    else {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
  }

  public updateInternationalBenificiaryDetails(){
    let formValidity: number = 0;

    if(this.internationalBenificiaryForm.invalid){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if(this._taxResidenceCertificate && !Boolean(this.internationalBenificiaryForm.value.taxResidenceCertificateDate)){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (formValidity == 0) {
      let apiPayLoad = {
        VendorId: this._vendorId,
        InitiatorNameName: this._initiatorDetails['unique_name'],
        InitiatorEmail: this._initiatorDetails.email,
        VendorAccount: this._vendorDetails.VendorAccount+'' || ' ',
        MisCode: "NA",
        BenificiaryName: this.internationalBenificiaryForm.value.benificiaryNameForInternational,
        PanCardName:" ",
        PanNumber: " ",
        BankAccountNumber: this.internationalBenificiaryForm.value.bankAccountNumberForInternational+'',
        IfscCode: " " ,
        SwiftCode: this.internationalBenificiaryForm.value.swiftCode+'' || ' ' ,
        IbnNumber: this.internationalBenificiaryForm.value.ibnNumber+'' || ' ',
        Email: this.internationalBenificiaryForm.value.emailIdForInternational || ' ',
        PanCardDocument: "",
        ChequeDocument: "",
        TaxResidenceCertificate: this._taxResidenceCertificate || '',
        TaxResidenceCertificateDate: (Boolean(new Date(this.internationalBenificiaryForm.value.taxResidenceCertificateDate)))? new Date(this.internationalBenificiaryForm.value.taxResidenceCertificateDate) :  "2024-02-21T05:22:59.918Z",
      }
      console.log(apiPayLoad)

      this.loadingIndicator = true;
      this.utilityService.putVendorDetails(apiPayLoad).subscribe(res => {
        this.loadingIndicator = false;
        if(res.message == 'Data Updated successfully.'){
          this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.BENIFICIARY_UPDATE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
          this.close();
        }

      },
      err => {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        
      })
    }
    // else {
    //   this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    // }
  }

  // Get Corresponding Role Name:
  _getRoleName(id) {
    return this.roleDetails.find(role => {
      return id == role.RoleId
    })
  }

  // File Handling
  private _allowedTypes: string[];
  public allowedTypesForHTML: string;
  private _panCardFile: string;
  private _chequeFile: string;
  private _taxResidenceCertificate: string;

  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {

      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE) {

        const extension = file.name.split('.')[1];

        const reader = new FileReader();

        // console.log('extension', this._allowedTypes.includes(extension))
        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;

            if (type == 'other') {
              if (control == 'uploadPAN') {
                this._panCardFile = base64String.split(',')[1];
                // this._panCardFile = file.name + ':' + base64String.split(',')[1];
              }
              else if (control == 'uploadCheque') {
                this._chequeFile = base64String.split(',')[1];
                // this._chequeFile = file.name + ':' + base64String.split(',')[1];
              }
              else if(control == 'uploadTaxResidenceCertificate'){
                this._taxResidenceCertificate = base64String.split(',')[1];
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
      case 'uploadPAN':
        this.benificiaryForm.controls.uploadPAN.reset();
        break;

      case 'uploadCheque':
        this.benificiaryForm.controls.uploadCheque.reset();
        break;
      
      case 'uploadTaxResidenceCertificate':
        this.internationalBenificiaryForm.controls.uploadTaxResidenceCertificate.reset();
        break;
    }
  }
}

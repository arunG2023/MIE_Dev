import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

import { Subject, takeUntil } from 'rxjs';
import { Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import { Config } from 'src/app/shared/config/common-config';
import { ModuleService } from 'src/app/shared/services/event-utility/module.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css']
})
export class AddVendorComponent implements OnInit {
   

   public loadingIndicator = false;
   vendors: any[] = [];
   divisions: any;
   vendorTypes:Array<string> = [];
   countries:Array<string> = [];
   cities:any;
   states:any;
   specialities:Array<string> = [];
   vendorCriterias:Array<string> = [];
   vendorBrands:any;
   vendorNameSelected: string = '';
   // Form group name
   addVendorCodeCreationForm : FormGroup;
   vendorPanCardFileString: string = '';
   vendorChequeFileString: string = '';
   vendorTaxResidenceCertificateFileString: string = '';
  
    brands:any;
   
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  _filteredMISCodes: Observable<string[]>;
  _filteredVendorNames: Observable<string[]>;

   constructor(private _http : HttpClient,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _moduleService: ModuleService,
    private _router: Router,
    private _authService: AuthService
             ) 
   { 


   }

  ngOnInit(): void {

    

     this.addVendorCodeCreationForm = this._formBuilder.group({
       misCode : new FormControl('', Validators.required),
       vendorAccount : new FormControl('', Validators.required),
       benificiaryName : new FormControl('', Validators.required),
       panCardName : new FormControl(),
       bankAccountNumber : new FormControl('', Validators.required),
       ifscCode : new FormControl(),
       emailID : new FormControl('', Validators.required),
       panCardNumber : new FormControl(),
       swiftCode : new FormControl(),
       ibnNumber : new FormControl(''),
       vendorPanCard : new FormControl(),
       vendorPanCardFile : new FormControl(),
       vendorCheque : new FormControl(),
       vendorChequeFile : new FormControl(),
       vendorTaxResidenceCertificate : new FormControl(),
       vendorTaxResidenceCertificateFile : new FormControl(),
     });

      //this._getApprovedVendors();

        // Initialize the autocomplete for MIS Code
        // this._filteredMISCodes = this.addVendorCodeCreationForm.get('misCode').valueChanges.pipe(
        //   startWith(''),
        //   map((value) => this._filterMISCodes(value))
        // );

              this.addVendorCodeCreationForm.get("panCardName").disable();
              this.addVendorCodeCreationForm.get("ifscCode").disable();
              this.addVendorCodeCreationForm.get("panCardNumber").disable();
              this.addVendorCodeCreationForm.get("swiftCode").disable();
              this.addVendorCodeCreationForm.get("ibnNumber").disable();
              this.addVendorCodeCreationForm.get("vendorPanCard").disable();
              this.addVendorCodeCreationForm.get("vendorTaxResidenceCertificate").disable();

  }

  private _getApprovedVendors() {
    this._utilityService.getApprovedVendorsForAutocomplete().subscribe(
      (vendors) => {
        console.log(vendors);
        this.vendors = vendors;
      },
      (error) => {
        console.error('Error loading vendors:', error);
      }
    );
  }



  private _filterMISCodes(value: string): string[] {
    const filterOptionNA = 'N/A';
    const filterValue = value.toString().toLowerCase();
    console.log(filterValue,this.vendors);
    var misCodes = this.vendors
      .map((vendor) => vendor.MISCode)
      .filter((misCode) => {
        return (misCode && misCode.toString().toLowerCase().includes(filterValue))
      }); 
    misCodes.push('N/A');
    return misCodes;
  }
  // Event handler for the optionSelected event of mat-autocomplete
  onMISCodeSelected(event: any) {
    // console.log('events',event)
   
          const selectedMISCode = event.option.value;
          console.log('value',selectedMISCode)
          if(selectedMISCode && selectedMISCode.trim() !== '' && selectedMISCode.trim().toLowerCase() !== 'n/a')
          {
              this.addVendorCodeCreationForm.get("panCardName").enable();
              this.addVendorCodeCreationForm.get("ifscCode").enable();
              this.addVendorCodeCreationForm.get("panCardNumber").enable();
              this.addVendorCodeCreationForm.get("swiftCode").enable();
              this.addVendorCodeCreationForm.get("ibnNumber").enable();
              this.addVendorCodeCreationForm.get("vendorPanCard").enable();
              this.addVendorCodeCreationForm.get("vendorTaxResidenceCertificate").enable();
          }
          else
          {
              this.addVendorCodeCreationForm.get("panCardName").disable();
              this.addVendorCodeCreationForm.get("ifscCode").disable();
              this.addVendorCodeCreationForm.get("panCardNumber").disable();
              this.addVendorCodeCreationForm.get("swiftCode").disable();
              this.addVendorCodeCreationForm.get("ibnNumber").disable();
              this.addVendorCodeCreationForm.get("vendorPanCard").disable();
              this.addVendorCodeCreationForm.get("vendorTaxResidenceCertificate").disable();
          }

  }
 onMISCodeChange(event: any) {
    //console.log('onMISCodeChange',event.target.value);
          const selectedMISCode = event.target.value;
          console.log('hello')
          if(selectedMISCode && selectedMISCode.trim() !== '' && selectedMISCode.trim().toLowerCase() !== 'n/a')
          {
              this.addVendorCodeCreationForm.get("panCardName").enable();
              this.addVendorCodeCreationForm.get("ifscCode").enable();
              this.addVendorCodeCreationForm.get("panCardNumber").enable();
              this.addVendorCodeCreationForm.get("swiftCode").disable();
              this.addVendorCodeCreationForm.get("ibnNumber").disable();
              this.addVendorCodeCreationForm.get("vendorPanCard").enable();
              this.addVendorCodeCreationForm.get("vendorTaxResidenceCertificate").disable();
          }
          else
          {
              this.addVendorCodeCreationForm.get("panCardName").disable();
              this.addVendorCodeCreationForm.get("ifscCode").disable();
              this.addVendorCodeCreationForm.get("panCardNumber").disable();
              this.addVendorCodeCreationForm.get("swiftCode").enable();
              this.addVendorCodeCreationForm.get("ibnNumber").enable();
              this.addVendorCodeCreationForm.get("vendorPanCard").disable();
              this.addVendorCodeCreationForm.get("vendorTaxResidenceCertificate").enable();
          }

  }


  findVendorByMISCode(misCode: string): any {
    return this.vendors.find((vendor) => vendor.MISCode === misCode);
  }


   //  Method to handle form submission
   submit(){
     if(this.addVendorCodeCreationForm.valid){

       this.loadingIndicator = true;

          var vendorAccountval= this.addVendorCodeCreationForm.get('vendorAccount').value;
          var misCodeval= this.addVendorCodeCreationForm.get('misCode').value.toString();
          var benificiaryNameval= this.addVendorCodeCreationForm.get('benificiaryName').value;
          var panCardNameval= this.addVendorCodeCreationForm.get('panCardName').value;
          var panNumberval= this.addVendorCodeCreationForm.get('panCardNumber').value;
          var bankAccountNumberval= this.addVendorCodeCreationForm.get('bankAccountNumber').value;
          var ifscCodeval= this.addVendorCodeCreationForm.get('ifscCode').value;
          var swiftCodeval= this.addVendorCodeCreationForm.get('swiftCode').value;
          var ibnNumberval= this.addVendorCodeCreationForm.get('ibnNumber').value;
          var emailval= this.addVendorCodeCreationForm.get('emailID').value;


          let roleDetails = this._authService.decodeToken();

        const payload = {
          vendorAccount: vendorAccountval,
          misCode: misCodeval,
          benificiaryName: (benificiaryNameval?benificiaryNameval:""),
          panCardName: (panCardNameval?panCardNameval:""),
          panNumber: (panNumberval?panNumberval:""),
          bankAccountNumber: (bankAccountNumberval?bankAccountNumberval:""),
          ifscCode: (ifscCodeval?ifscCodeval:""),
          swiftCode: (swiftCodeval?swiftCodeval:""),
          ibnNumber: (ibnNumberval?ibnNumberval:""),
          email: (emailval?emailval:""),
          panCardDocument: this.vendorPanCardFileString,
          chequeDocument: this.vendorChequeFileString,
          taxResidenceCertificate: this.vendorTaxResidenceCertificateFileString,
          InitiatorNameName:  roleDetails['unique_name'],
          InitiatorEmail: roleDetails.email || ' ',
        };
        console.log(`payload`, payload);
        this._moduleService.addVendorCreationDetails(payload)
          .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
          .subscribe(res => {
            // console.log(`Response`, res);
            if(res) {

              this.loadingIndicator = false;
              this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_VENDOR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
              this._router.navigate(['/master-list/']);
              this.addVendorCodeCreationForm.reset();              
            } else {
              this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.ADD_VENDOR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
            }
          },(error)=>{

              this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.ADD_VENDOR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
              this.loadingIndicator = false;
              console.log(error);

          });
 
     }
     
   }

   onVendorPanCardFileSelected($event)
   {
       this.convertVendorPanCardFileToBase64(); // Convert file to base64 before submission
  }

   onVendorChequeFileSelected($event)
   {
       this.convertVendorChequeFileToBase64(); // Convert file to base64 before submission
  }
   onVendorTaxResidenceCertificateFileSelected($event)
   {
       this.convertVendorTaxResidenceCertificateFileToBase64(); // Convert file to base64 before submission
  }  

  convertVendorPanCardFileToBase64() {
        const fileInput = document.getElementById('vendorPanCard') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.vendorPanCardFileString = base64String.split(',')[1];
            this.addVendorCodeCreationForm.patchValue({
              vendorPanCardFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }
  convertVendorChequeFileToBase64() {
        const fileInput = document.getElementById('vendorCheque') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.vendorChequeFileString = base64String.split(',')[1];
            this.addVendorCodeCreationForm.patchValue({
              vendorChequeFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }

  convertVendorTaxResidenceCertificateFileToBase64() {
        const fileInput = document.getElementById('vendorTaxResidenceCertificate') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.vendorTaxResidenceCertificateFileString = base64String.split(',')[1];
            this.addVendorCodeCreationForm.patchValue({
              vendorTaxResidenceCertificateFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }
    isVendorMISCodeNA(): boolean 
    {
      const { misCode } = this.addVendorCodeCreationForm.value;
      //console.log(misCode);
      if(misCode && misCode.trim() !== '' && misCode.trim() !== 'n/a')
      {
        return true;
      }
      return false;
    }


  public validateMisCode():void{

    this.loadingIndicator=true;
    console.log(this.addVendorCodeCreationForm.get("misCode").value);

    this._utilityService.getRowDataUsingMISCode(this.addVendorCodeCreationForm.get("misCode").value).subscribe(
      (hpc) => {
        console.log(hpc);
        if(hpc)
        {
            this.addVendorCodeCreationForm.get("vendorAccount").setValue(hpc[0]['HCPName']);
            //this.addVendorCodeCreationForm.get("goNgoAgo").setValue(hpc['HcpType']);
        }
        this.loadingIndicator=false;
      },
      (error) => {
        console.error('Error loading hpc:', error);
        this.loadingIndicator=false;
      }
    );      
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }  
}


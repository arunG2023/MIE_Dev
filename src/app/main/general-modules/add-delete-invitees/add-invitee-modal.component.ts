import { Component, HostListener, OnInit, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Config } from 'src/app/shared/config/common-config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-invitee-modal',
  templateUrl: './add-invitee-modal.component.html',
})
export class AddInviteeModalComponent {
  // Spinner
  loadingIndicator: boolean = false;
  inviteeSelectionForm: FormGroup;
  eventId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilityService: UtilityService,
    private auth: AuthService,
    private router: Router,
    private _snackBarService: SnackBarService,
    private _authService: AuthService,
    public dialogRef: MatDialogRef<AddInviteeModalComponent>) {}

  ngOnInit(): void {

    this.loadingIndicator=true;
    this.eventId = this.data.eventId;
    // Get Invitees From HCP Master
    this.utilityService.getEmployeesFromHCPMaster().subscribe((res) => {
      this.inviteesFromHCPMaster = res;
      console.log('Before SPlice', this.inviteesFromHCPMaster.length);
      this.inviteesFromHCPMaster.splice(1000);
      console.log('After SPlice', this.inviteesFromHCPMaster.length);
      console.log(this.inviteesFromHCPMaster);
    this.loadingIndicator=false;
    });

    this.inviteeSelectionForm = new FormGroup({
      inviteesFrom: new FormControl('', Validators.required),
      inviteeName: new FormControl('',),
      inviteeMisCode: new FormControl(''),
      isInviteeLocalConveyance: new FormControl('No', Validators.required),
      inviteeLocalConveyanceAmount: new FormControl(0),
      inviteeBTC: new FormControl(''),
      uploadAgenda: new FormControl(''),
      uploadInvitation: new FormControl(''),
      InviteeName:new FormControl(''),
      inviteedFrom: new FormControl(''),
      Speciality: new FormControl(''),
      HCPType : new FormControl('')
    });


    this.inviteeSelectionFormPrePopulate();

  }

  showinvitees = false;
  showInviteeLocalConveyance: boolean = false;

  inviteesFromHCPMaster: any;

  filteredHCPMasterInvitees: any;
  filteredInviteeLength: number = 0;

  filteredInviteeMisCode: string;
  hideInviteeMisCode: boolean = true;
  filteredInviteeMisCodeSelect: any[] = [];

  inviteeSelectionFormPrePopulate() {
    this.inviteeSelectionForm.get("inviteeMisCode").disable();
    this.inviteeSelectionForm.valueChanges.subscribe((changes) => {
      console.log(changes);
      if (changes.isInviteeLocalConveyance == 'Yes') {
        this.showInviteeLocalConveyance = true;
      } else {
        this.showInviteeLocalConveyance = false;
      }
      if (changes.inviteesFrom) {
        this.filteredHCPMasterInvitees = null;
        this.filteredInviteeMisCode = '';
        // console.log(this.inviteesFromHCPMaster)
      }
      // console.log(this.inviteeSelectionForm.controls.inviteesFrom)
      if (changes.inviteeName != '') {
        if (
          this.inviteeSelectionForm.controls.inviteesFrom.touched &&
          changes.inviteesFrom == 'HCP Master'
        ) {
          // console.log(this.filterHCPMasterInvitees(changes.inviteeName))
          this.filteredHCPMasterInvitees = this.filterHCPMasterInvitees(
            changes.inviteeName
          );
          console.log(this.filteredHCPMasterInvitees);
          // console.log(this.getHCPMasterInviteeWithName(changes.inviteeName));
          // const filteredInvitee = this.getHCPMasterInviteeWithName(changes.inviteeName);

          // if (filteredInvitee && filteredInvitee.length == 1) {
          //   this.hideInviteeMisCode = true;
          //   this.filteredInviteeMisCode = filteredInvitee[0].MisCode;
          // }
          // else {
          //   this.hideInviteeMisCode = false
          //   this.filteredInviteeMisCodeSelect = filteredInvitee
          // }

          // Changed Filter logic with respect to CR
           console.log('filterr', this.getFilteredInvitee(changes.inviteeName))
          const filteredInvitee = this.getFilteredInvitee(changes.inviteeName)

          if (Boolean(filteredInvitee)) {
            console.log('filteredInvitee',filteredInvitee)
            this.inviteeSelectionForm.controls.inviteeName.setValue(filteredInvitee.HCPName)
            this.inviteeSelectionForm.controls.inviteeMisCode.setValue(filteredInvitee.MisCode)
            this.filteredInviteeMisCode = filteredInvitee.MisCode;
          }





        }
        else {


        }

      }
      if (changes.inviteesFrom == 'Menarini Employees' && this.inviteeSelectionForm.controls.inviteeMisCode.value!="") 
      {
          this.inviteeSelectionForm.controls.inviteeMisCode.setValue("");
      }
      if (changes.inviteesFrom == 'Others') {
        this.showinvitees = true;
        // this.inviteeSelectionForm.controls.inviteedFrom.setValue(
        //   'Others'
        // );
      } else {
        // this.inviteeSelectionForm.controls.inviteedFrom.setValue(
        //   ' '
        // );
        this.showinvitees = false;
      }

    });
  }

  filterHCPMasterInvitees(name: string) {
    console.log('nam', Boolean(name));
    if (Boolean(name)) {
      return this.inviteesFromHCPMaster.filter((invitee) => {
        if (invitee['HCPName']) {
          return invitee['HCPName'].toLowerCase().includes(name.toLowerCase());
        }
      });
    }
    // return this.inviteesFromHCPMaster.find(invitee => invitee['HCP Name'].includes(name))
  }

  getFilteredInvitee(misCode: string) {
    console.log('mis', Boolean(misCode),misCode);
    if (Boolean(misCode)) {
      return this.inviteesFromHCPMaster.find(
        (invitee) => invitee['MisCode'] == misCode
      );
    }
  }

  getHCPMasterInviteeWithName(name: string) {
    if (Boolean(name)) {
      const invitees: any[] = [];

      this.inviteesFromHCPMaster.forEach((invitee) => {
        if (invitee['HCPName']) {
          if (invitee['HCPName'].toLowerCase() === name.toLowerCase())
            invitees.push(invitee);
        }
      });
      return invitees;
    }
  }  
  public addToInviteeTable()
  {

    // console.log(this.inviteeSelectionForm.value)
    let inviteeValidity: number = 0;

    if (!this.inviteeSelectionForm.valid) {
      // alert("Please Fill all the details")
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_ALL,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
      inviteeValidity++;
    }
    // console.log(Boolean(this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount))
    if (
      this.showInviteeLocalConveyance &&
      (this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount == 0 ||
        !Boolean(this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount))
    ) {
      // alert("Enter Local Conveyance Amount");
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_LOCAL_CONVEYANCE,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
      inviteeValidity++;
    }
    if (
      this.showInviteeLocalConveyance &&
      !Boolean(this.inviteeSelectionForm.value.inviteeBTC)
    ) {
      // alert("Select BTC/BTE");
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_LOCAL_CONVEYANCE,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
      inviteeValidity++;
    }

    if (
      !this.hideInviteeMisCode &&
      !Boolean(this.inviteeSelectionForm.value.inviteeMisCode)
    ) {
      // alert("Invitee MIS Code is missing");
      this._snackBarService.showSnackBar(
        Config.MESSAGE.ERROR.FILL_MIS,
        Config.SNACK_BAR.DELAY,
        Config.SNACK_BAR.ERROR
      );
      inviteeValidity++;
    }

    if (inviteeValidity == 0) {
      const inviteeData = {
        eventIdOrEventRequestId: this.eventId,
        misCode: Boolean(this.inviteeSelectionForm.get("inviteeMisCode").value)
          ? this.inviteeSelectionForm.get("inviteeMisCode").value + ''
          : ' ',
        inviteeName: this.inviteeSelectionForm.value.inviteeName ||  this.inviteeSelectionForm.value.InviteeName ,
        localConveyance:
          this.inviteeSelectionForm.value.isInviteeLocalConveyance,
        btcorBte: Boolean(this.inviteeSelectionForm.value.inviteeBTC)
          ? this.inviteeSelectionForm.value.inviteeBTC
          : 'NIL',
        lcAmount: this.showInviteeLocalConveyance
          ? this.inviteeSelectionForm.value.inviteeLocalConveyanceAmount + ''
          : 0 + '',
        inviteedFrom: this.inviteeSelectionForm.value.inviteesFrom || ' ',
        // NewInviteeName:this.inviteeSelectionForm.value.inviteeName ||  this.inviteeSelectionForm.value.InviteeName ,
        speciality: this.inviteeSelectionForm.value.Speciality || ' ',
        hcpType:this.inviteeSelectionForm.value.HCPType
      };

      console.log(inviteeData); 
        this.loadingIndicator=true;
        this.utilityService.postAddNewInviteesRequest([inviteeData]).subscribe(
        (res) => {
          console.log(res);
          if (res.message == 'Data added successfully.') {
            this.loadingIndicator = false;
            this._snackBarService.showSnackBar(
              Config.MESSAGE.SUCCESS.ADD_INVITEE,
              Config.SNACK_BAR.DELAY,
              Config.SNACK_BAR.SUCCESS
            );
            this.dialogRef.close();
          }
        },
        (err) => {
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar(
            Config.MESSAGE.ERROR.ADD_INVITEE,
            Config.SNACK_BAR.DELAY,
            Config.SNACK_BAR.ERROR
          );
        }
      );
    }
  }
}
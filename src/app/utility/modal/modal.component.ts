import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddEmployeesComponent } from 'src/app/add-employees/add-employees.component';
import { UtilityService } from 'src/app/services/utility.service';


@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  updateForm : FormGroup;

  // Data From Sheet
  roleDetails : any;

  // Update Fields
  firstName : string;
  lastName : string;
  userName : string;
  roleName : string;
  roleId : string;

  text : string = "closed";

  // Brand Details
  brandUpdateForm : FormGroup;
  showBrandForm : boolean = false;

  brandDetails : any;
  brandName : string;
  percentageAllocation : number;
  projectId : string;

  // HCP Update
  showHCPForm : boolean = false;

  hcpUpdateForm : FormGroup;


  private hcpRole : string;
  private hcpName : string;
  private misCode : string;
  private goNonGo : string;
  private honarariumAmount : string;
  private travelAmount : string;
  private localconveyanceAount : string;
  private accomAmount : string;


  
  // Invitee Update
  showInviteeForm : boolean = false;

  inviteeUpdateForm : FormGroup;  

  private inviteeName : string;
  private localConveyance : string;
  private lcAmount : string;
  private btc : string;

  // Expense Update
  showExpenseForm : boolean = false;

  expenseUpdateForm : FormGroup;

  private expenseType : string;
  private expenseAmount : string;
  private isExcludingTax : string;
  private isExpenseBtc : string;


  constructor(public dialogRef : MatDialogRef<AddEmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private utilityService : UtilityService){
    
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
    if(data.BrandName){
      console.log(data);
      this.brandDetails = data;
      this.showBrandForm = true;
      this.brandName = data.BrandName;
      this.percentageAllocation = data.PercentAllocation;
      this.projectId = data.ProjectId;
    }
    else if(data.HcpRole){
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
    else if(data.InviteeName){
      this.showInviteeForm = true;
      this.inviteeName = data.InviteeName;
      this.localConveyance = data.LocalConveyance;
      this.btc = data.BtcorBte;
      this.lcAmount = data.LcAmount
    }
    else if(data.Expense){
      this.showExpenseForm = true;

      this.expenseType = data.Expense;
      this.expenseAmount = data.Amount;
      this.isExpenseBtc = data.AmountExcludingTax;
      this.isExcludingTax = data.BtcorBte;
    }
    else{
      this.showBrandForm = false;
      this.showHCPForm = false;
      this.showInviteeForm = false;
      this.showExpenseForm = false;
      this.roleId = data.RoleId;
      this.firstName = data.FirstName;
      this.lastName = data.LastName;
      this.userName = data.CreatedBy;
      this.roleName = data.RoleName;
    }

    this.brandUpdateForm = new FormGroup({
      brandName : new FormControl({value: this.brandName, disabled: true}),
      percentageAllocation : new FormControl(this.percentageAllocation),
      projectId : new FormControl({value: this.projectId, disabled: true})
    })

    this.hcpUpdateForm = new FormGroup({
      hcpRole : new FormControl({value:this.hcpRole,disabled:true}),
      hcpName : new FormControl({value:this.hcpName,disabled:true}),
      misCode : new FormControl({value:this.misCode,disabled:true}),
      goNonGo : new FormControl({value:this.goNonGo,disabled:true}),
      honarariumAmount : new FormControl({value:this.honarariumAmount,disabled:true}),
      travelAmount : new FormControl({value:this.travelAmount,disabled:true}),
      localConAmount : new FormControl({value:this.localconveyanceAount,disabled:true}),
      accomAmount : new FormControl({value:this.accomAmount,disabled:true})
    })

    this.inviteeUpdateForm = new FormGroup({
      inviteeName : new FormControl({value:this.inviteeName,disabled:true}),
      isLocalConveyance : new FormControl({value:this.localConveyance,disabled:true}),
      btc : new FormControl({value:this.btc,disabled:true}),
      lcAmount : new FormControl({value:this.lcAmount,disabled:true})
    })

    this.expenseUpdateForm = new FormGroup({
      expenseType : new FormControl({value:this.expenseType, disabled: true}),
      expenseAmount : new FormControl({value: this.expenseAmount, disabled:true}),
      isExclucingTax : new FormControl({value:this.isExcludingTax,disabled:true}),
      isExpenseBtc : new FormControl({value:this.isExpenseBtc,disabled:true})
    })

    this.updateForm = new FormGroup({
      firstName : new FormControl(this.firstName,[Validators.required]),
      lastName : new FormControl(this.lastName,[Validators.required]),
      userName : new FormControl(this.userName, [Validators.required]),
      roleName : new FormControl(this.roleId, [Validators.required])
    })
  }

  close(){
    this.dialogRef.close(this.text)
  }

  updatedData : any;

  submit(){
    if(this.updateForm.valid){
      // console.log(this.updateForm.value)
      this.data.FirstName = this.updateForm.value.firstName;
      this.data.LastName = this.updateForm.value.lastName;
      this.data.CreatedBy = this.updateForm.value.userName;
      this.data.RoleName = this._getRoleName(this.updateForm.value.roleName).RoleName;
      this.data.RoleId = this.updateForm.value.roleName;
      console.log(this.data)
      this.utilityService.updateEmployees(this.data).subscribe(
        res  =>{
          console.log(res);
        },
        err => {
          alert("Unexpected Error Happened")
        }
      )

      this.dialogRef.close(this.data)
    }

  }

  updateBrand(){
    this.brandDetails.PercentAllocation = this.brandUpdateForm.controls.percentageAllocation.value;
    // console.log(this.brandDetails)
    this.dialogRef.close(this.brandDetails)

  }

  updateHCP(){

  }

  updateInvitee(){

  }

  updateExpense(){
    
  }

  ngOnInit(): void {
  }

  // Get Corresponding Role Name:
  _getRoleName(id){
    return this.roleDetails.find(role => {
      return id == role.RoleId
    })

  }

}

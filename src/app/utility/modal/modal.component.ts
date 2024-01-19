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
  
   
    console.log(data);
    if(data.BrandName){
      console.log(data);
      this.brandDetails = data;
      this.showBrandForm = true;
      this.brandName = data.BrandName;
      this.percentageAllocation = data.PercentAllocation;
      this.projectId = data.ProjectId;
    }
    else{
      this.showBrandForm = false;
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

  ngOnInit(): void {
  }

  // Get Corresponding Role Name:
  _getRoleName(id){
    return this.roleDetails.find(role => {
      return id == role.RoleId
    })

  }

}

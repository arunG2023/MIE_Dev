import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../utility/modal/modal.component';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.css']
})
export class AddEmployeesComponent implements OnInit {

   // Form group name
   addUserFrom : FormGroup;

   // Auto Filling values
   firstName : string = '';
   lastName : string = '';
   userName : string = '';
   
   // Employee details and event details from api
   employeeDetails : any;
   eventDetails : any;
   roleDetails : any;
   employeeId : any;
 
   // Filtered options for auto complete
   filteredOptions: any;
 
   // Show Table
   showTable : boolean = false
 
   constructor(private http : HttpClient,
             private dialog : MatDialog,
             private utilityService : UtilityService) {
    
 
     this.addUserFrom = new FormGroup({
       roleName : new FormControl('', Validators.required),
       eventType : new FormControl('',Validators.required),
       email : new FormControl('', [Validators.required, Validators.email]),
       
     })
 
     // Getting event details from sheet
      utilityService.getEventTypes().subscribe(
       res => {
       this.eventDetails = res;
       console.log(res)
       },
       err => {
         alert("OOPS Some error occured")
       }
     )    
 
     // Getting roles from sheet
      utilityService.getRoles().subscribe(
       res => {
         this.roleDetails = res;
         // console.log(this.roleDetails)
      },
      err => {
       alert("OOPS Some error occured")
     }
     )
 
    
     // Getting employee details from sheet
     utilityService.getEmployees().subscribe(res => {
       this.employeeDetails = res;
       
       },
       err => {
         alert("OOPS Some error occured")
       }
     )

     
    
 
    }
 
    postData : any;
    roleName : string;
 
    tableDetails : any;
   //  Method to handle form submission
   submit(){
     if(this.addUserFrom.valid){
       
 
       this.roleName = this._getRoleName(this.addUserFrom.value.roleName).RoleName
 
       // Generating in PascalCase for sending to .NET
       this.postData = {
         Email : this.addUserFrom.value.email,
         EmployeeId : this.employeeId,
         CreatedBy : this.userName,
         RoleId : this.addUserFrom.value.roleName,
         RoleName : this.roleName,
         FirstName : this.firstName,
         LastName : this.lastName
       }


       this.utilityService.addEmployees(this.postData).subscribe(
        res => {
          this.utilityService.getAddedEmployees().subscribe(
            res => {
              this.tableDetails = res;
            }
          )
        },
        err => {
          if(err.error){
            alert(err.error);
          }
          else{
            alert("Unexpected Error Happened")
          }
          
        }
       )
 
       // this.http.post('http://localhost:5098/api/UserRoleMaster/AddData', this.postData).subscribe(res => {
       //   console.log(res)
       //     this.http.get('http://localhost:5098/api/UserRoleMaster/GetEventData').subscribe(res => {
       //       this.tableDetails = res
       //   })
       // })
 
      //  this.tableDetails.push(this.postData)
 
      this.utilityService.getAddedEmployees().subscribe(
        res => {
          this.tableDetails = res;
          console.log(res)
        },
        err => {
          alert("Unxepected Error Happened")
        }
      )
       
 
       console.log(this.tableDetails)
       this.showTable = true;
       
       
       this.resetForm();
 
     }
     
   }
 
   resetForm(){
     this.addUserFrom = new FormGroup({
       roleName : new FormControl('', Validators.required),
       eventType : new FormControl('',Validators.required),
       email : new FormControl('',[Validators.required, Validators.email]),
       
     })
     
     this.firstName = '';
     this.lastName = '';
     this.userName = '';
 
     this.detectFormChanges();
    
   }
 
   
    
   ngOnInit() {
    // Getting employees role Sheet
    this.utilityService.getAddedEmployees().subscribe(
      res => {
        this.tableDetails = res;
        this.showTable = true;
        console.log(res)
      },
      err => {
        alert("Unxepected Error Happened")
      }
    )
    
    this.detectFormChanges();
   }
 
   // To detect form Changes:
   detectFormChanges(){
     this.addUserFrom.valueChanges.subscribe(changes => {
      
       if(this.addUserFrom.controls['email'].value !== ''){
           // console.log(this.addUserFrom.controls['email'].value)
           // console.log(this._filter(this.addUserFrom.controls['email'].value))
           this.filteredOptions = this._filter(this.addUserFrom.controls['email'].value)
           // console.log(this.addUserFrom.controls['email'].valid)
           if(this.addUserFrom.controls['email'].valid){
             const employee =  this._getDetails(this.addUserFrom.controls['email'].value);
             console.log(employee)
             this.firstName = employee.FirstName
             this.lastName = employee.LastName
             this.userName = employee.UserName
             this.employeeId = employee.EmployeeId
           }
       }
     })
   }
 
   // Filtering the email ids for auto complete
   private _filter(value: string): string[] {
     // console.log(this.employeeDetails)
     const filterValue = value.toLowerCase();
     return this.employeeDetails.filter(emp => emp.EmailId.toLowerCase().includes(filterValue));
   }
 
   // Getting the employeee details for the specific email for prepopulate
   private _getDetails(value){
     return this.employeeDetails.find(emp => {
       return emp.EmailId === value
     })
   }
 
   _getRoleName(id){
     return this.roleDetails.find(role => {
       return id == role.RoleId
     })
 
   }
 
   private _getEventName(id){
     return this.eventDetails.find(event => {
       return id == event.EventTypeId
     })
   }
 
   // Update Modal Implementation
   openModal(data:any){
    
     
     const dialogRef =  this.dialog.open(ModalComponent,{
       width: '600px',
       data : data
     })
 
 
     let updatedData;
     dialogRef.afterClosed().subscribe(res => {
       
       updatedData = res;

 
     })
 
    
 
     
   }

  //  Delete a record from table
  delete(id:any, data:any){
    // console.log(data)
    // document.getElementById(id).style.setProperty('display','none')
    this.utilityService.deleteEmployees(data).subscribe(
      res => {
        // alert('User Deleted Succesfully');
        this.utilityService.getAddedEmployees().subscribe(
          res => {
            this.tableDetails = res;
            this.showTable = true;
          },
          err => {
            alert("Unxepected Error Happened")
          }
        )
      },
      err => {
        alert("Unexpected Error Happened")
      }
    )

  }

 
 

}

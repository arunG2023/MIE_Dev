import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-event-settlement',
  templateUrl: './post-event-settlement.component.html',
  styleUrls: ['./post-event-settlement.component.css']
})
export class PostEventSettlementComponent implements OnInit {
  PostEventSettlement : FormGroup;


  stepper: any;
  isUploadShows:boolean=false;
  isUploadGST:boolean=false;
  
  
    constructor() {
  
      this.PostEventSettlement = new FormGroup({
        dayssince: new FormControl('',Validators.required),
        uploadDeviation: new FormControl('',Validators.required),
        newExpense: new FormControl('',Validators.required),
        itCompanysBTCBTE: new FormControl('',Validators.required),
        Expense: new FormControl('',Validators.required),
        costperparticipant: new FormControl('',Validators.required),
        Amount: new FormControl('',Validators.required),
        CostperparticipantINR: new FormControl('',Validators.required),
        includingGST: new FormControl('',Validators.required),
        uploadDeviation1: new FormControl('',Validators.required)
  
      })
  
     }
  
  
  
    ngOnInit(): void {
      // this.showingUpload();
    }
  
    showingUpload()
    {
     this.PostEventSettlement.valueChanges.subscribe( (res =>
      {
        console.log(res);
        this.isUploadShows = (res.dayssince == 'Yes')?true:false;
        this.isUploadGST = (res.includingGST == 'Yes')?true:false;
      }))
    }

}

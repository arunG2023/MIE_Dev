import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-honararium-payment-request',
  templateUrl: './honararium-payment-request.component.html',
  styleUrls: ['./honararium-payment-request.component.css']
})
export class HonarariumPaymentRequestComponent implements OnInit {

  stepper: any;
  honorarium:FormGroup;


  

  show2DaysUpload : boolean = false;
  showGSTUpload : boolean = false;
  showLessThan5 : boolean = false;
  
  
    constructor() {
      this.honorarium = new FormGroup({
        isAfter2Days:new FormControl('',Validators.required),
        uploadDeviation : new FormControl(''),
        uploadSpeakerAgreement : new FormControl(''),
        uploadPhotos : new FormControl(''),
        uploadFinalHonorariumDetails : new FormControl(''),
        uploadDetails : new FormControl(''),
        isItIncludingGST : new FormControl(''),
        isInviteeslessthan5 : new FormControl(''),
        UploadDetails1 : new FormControl('')
    
      })
   
  }
    ngOnInit(): void {
      this.showUpload()
      
    }
  
    showUpload()
    {
      this.honorarium.valueChanges.subscribe(chanegs => 
        {
          this.show2DaysUpload = (chanegs.isAfter2Days == 'Yes')?true:false;
          this.showGSTUpload = (chanegs.isItIncludingGST == 'Yes')?true:false;
          this.showLessThan5 = (chanegs.isInviteeslessthan5 == 'Yes')?true:false;
        })
    }
  
}

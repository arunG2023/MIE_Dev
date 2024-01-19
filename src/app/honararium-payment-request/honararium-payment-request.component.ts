import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { event } from 'jquery';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-honararium-payment-request',
  templateUrl: './honararium-payment-request.component.html',
  styleUrls: ['./honararium-payment-request.component.css']
})
export class HonarariumPaymentRequestComponent implements OnInit {

  stepper: any;
  honorarium:FormGroup;


  

  show2DaysUpload : boolean = false;
  showuploadifGSTyes : boolean = false;
  
  
  
  
    constructor(private utilityService : UtilityService) {
      this.honorarium = new FormGroup({
        //isAfter2Days:new FormControl('',[Validators.required]),
        uploadDeviation : new FormControl('',[Validators.required]),
        uploadSpeakerAgreement : new FormControl('',[Validators.required]),
        uploadPhotos : new FormControl(''),
        uploadFinalHonorariumDetails : new FormControl(''),
        uploadDetails : new FormControl(''),
        isItIncludingGST : new FormControl(''),
        isInviteeslessthan5 : new FormControl(''),
        UploadDetails1 : new FormControl('')
      })
      this.After2WorkingDays(this.utilityService.getPreviousEvents());
   
  }
    ngOnInit(): void {
      this.showUpload()
    }
  
    showUpload()
    {
      this.honorarium.valueChanges.subscribe(chanegs => 
        {
         // this.show2DaysUpload = (chanegs.isAfter2Days == 'Yes')?true:false;
          //this.show2DaysUpload = (chanegs.after2workingDaysList.length > 0)?true:false;
          this.showuploadifGSTyes = (chanegs.isItIncludingGST == 'Yes')?true:false;
          
        })
    }
    after2workingDaysList: any[] =[] ;
    After2WorkingDays(eventList : any)
    {
      eventList.forEach(event =>
        {
          //console.log(eventList);
          console.log('this from list before push',this.after2workingDaysList);
          console.log('Event dates from the previous events',event.EventDate);
          let afteradding2Days = this.add2Days(event.EventDate,2);
          console.log(afteradding2Days)
          if(event.EventDate > afteradding2Days)
          {

            this.after2workingDaysList.push(eventList);
          }
          console.log('this from list after push',this.after2workingDaysList);
         
        })

    }

    add2Days(eventdate : any , days : any)
    {
      let existingEventDate = new Date(eventdate);
      //console.log('existingEventDate',existingEventDate)
      existingEventDate.setDate(existingEventDate.getDate()+days);
     // console.log('existingEventDate with added 2 days',existingEventDate);
      return existingEventDate;

    }

    



    
    
}


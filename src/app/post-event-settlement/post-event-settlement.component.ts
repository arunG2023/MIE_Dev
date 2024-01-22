import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityService } from '../services/utility.service';

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
  show30DaysUpload:boolean=false;
  
  
    constructor(private utilityService : UtilityService) {
  
      this.PostEventSettlement = new FormGroup({
       // dayssince: new FormControl('',Validators.required),
        uploadDeviation: new FormControl('',Validators.required),
        TotalAttendance: new FormControl('',Validators.required),
        itCompanysBTCBTE: new FormControl('',Validators.required),
        Expense: new FormControl('',Validators.required),
        costperparticipant: new FormControl('',Validators.required),
        Amount: new FormControl('',Validators.required),
        CostperparticipantINR: new FormControl('',Validators.required),
        includingGST: new FormControl('',Validators.required),
        uploadDeviation1: new FormControl('',Validators.required)
  
      })
      this.After30Days(this.utilityService.getPreviousEvents());
   
  
    
    }
  
  
  
    ngOnInit(): void {
       this.showingUpload();
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

    after30DaysList: any[] =[] ;
    private  After30Days(eventList : any)
      {
        console.log(eventList)
       if(Boolean(eventList))
       {
        eventList.forEach(event =>
          {
           let today : any = new Date();
 
           if(event.EventDate)
           {
             let eventDate : any = new Date(event.EventDate);
             console.log(eventDate)
               let getEventDate = eventDate.getTime() ;

           }
              //  if(Difference_In_Time >= today.getDate())
              //  {
              //   console.log("hello",eventDate)
              //  }
              
              //  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
 
              //  if(Difference_In_Days >= 30){
              //   
              //  }
           }
          
                
       )}
       }
  
      }

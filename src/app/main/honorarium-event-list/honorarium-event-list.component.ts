import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
@Component({
  selector: 'app-honorarium-event-list',
  templateUrl: './honorarium-event-list.component.html',
  styleUrls: ['./honorarium-event-list.component.css']
})
export class HonorariumEventListComponent implements OnInit {
  // Spinner
  loadingIndicator : boolean = false;


  constructor(private utilityService: UtilityService, private http:HttpClient, private router : Router) { }

  eventList : any;

  ngOnInit(): void {
   this.eventListCall();
  }

  eventListCall(){
    this.loadingIndicator = true;
  this.utilityService.getHonorariumPaymentData().subscribe(
    res => 
    {
      this.loadingIndicator = false;
      this.eventList = res;
      // console.log(this.eventList);
    }
  )

  }


  gotoHonarariumRequest(eventId : any, eventType : any){
    this.router.navigate(['honararium-request'],
    { queryParams: { 'eventId': eventId, 'eventType' : eventType }}
        )
  }

  gotoEvenSettlementRequest(eventId : any, eventType : any){
    this.router.navigate(['event-settlement'],
    { queryParams: { 'eventId': eventId, 'eventType' : eventType }}
        )
  }



}

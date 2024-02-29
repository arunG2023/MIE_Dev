import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from 'src/app/shared/config/common-config';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

@Component({
  selector: 'app-post-event-list',
  templateUrl: './post-event-list.component.html',
  styleUrls: ['./post-event-list.component.css']
})
export class PostEventListComponent implements OnInit {
  // Spinner
  loadingIndicator : boolean = false;

  constructor(private utilityService: UtilityService, private http:HttpClient, private router : Router) { }

  eventList : any;
  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT
  public page: number = 1

  ngOnInit(): void {
   this.eventListCall();
  }
  public pageChanged(thisPage) {
    this.page = thisPage
  }

  eventListCall()
  {
  
    this.loadingIndicator = true;
  this.utilityService.getEventSettlementData().subscribe(
    res => 
    {
      this.loadingIndicator = false;
      this.eventList = res;
    console.log(this.eventList);
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

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import * as Chartist from 'chartist';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { eventNames } from 'process';
import { Config } from 'src/app/shared/config/common-config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardList : any[] = [];
  outstandingEventList : any[] = [];
  completedEventCount : number =0;
  public loadingIndicator = false

  userPayload: any;
  role: string ;
  userEmail : string ;

  
  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT
  public page: number = 1;

  private _userDetails: any;
  constructor(private utilityService :UtilityService, private _authService: AuthService) { }
 
  ngOnInit() {
    this._authService.getUserDetails$.subscribe(value => this._userDetails = value)
    this.loadingIndicator = true;
   this.utilityService.getEventListFromProcess().subscribe( res=>{
    this.loadingIndicator = false;
    this.completedEvent(res);
    this.outstandingEvent(res);
  })

  this.filterEventsWithIn30Days(this.outstandingEventList);
  }

  public pageChanged(thisPage) {
    this.page = thisPage
  }
  private completedEvent(eventList:any){
    eventList.forEach(completedEvents=>{
      // console.log('completed',completedEvents)
      if(completedEvents['Initiator Email'] == this._userDetails.email){
        if(completedEvents['Post Event Request status'] == 'Closure Approved'){
          this.dashboardList.push(completedEvents);
        }
      }
     
      })
      // console.log('ecompledre list',this.dashboardList)
      this.completedEventCount = this.dashboardList.length;

  }

  private outstandingEvent(eventList:any){
    eventList.forEach(outstanding=>{
    // if(Boolean(outstanding['Honorarium Submitted?'])){
      if(outstanding['Initiator Email'] == this._userDetails.email){
        if(outstanding['Honorarium Submitted?'] == 'No' || !Boolean(outstanding['Honorarium Submitted?']) ){
          this.outstandingEventList.push(outstanding);
          // console.log('outstanding',this.outstandingEventList)
        }
      }
      
    // }
    })
    this.outstandingEventList.sort((list1,list2)=>{
      return list2['EventId/EventRequestId'].localeCompare(list1['EventId/EventRequestId']);
    })
    this.outstandingEventsCount = this.outstandingEventList.length;
    this.filterEventsWithIn30Days(this.outstandingEventList)
  }




  // Filter Events within 30 days
  outstandingEventsCount: number = 0;
  filterEventsWithIn30Days(eventList: any) {
    // console.log('list',eventList)
    if (Boolean(eventList) && eventList.length > 0) {
      eventList.forEach(event => {
        if(event['Initiator Email'] == this._userDetails.email){
          let today = new Date();
          // console.log('today',today)
          //  console.log('end time',event.CreatedOn)
          if (event.CreatedOn) {
            // console.log('ready')
            let createdOn = new Date(event.CreatedOn);
            // console.log(createdOn);
            if (createdOn > today) {
              // console.log('coming',today)
  
              let Difference_In_Time = createdOn.getTime() - today.getTime();
  
              // To calculate the no. of days between two dates
              let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  
              if (Difference_In_Days > 30) {
                this.outstandingEventsCount += 1;
                // console.log('ellllooo',this.outstandingEventsCount)
                
              }
            }
             //console.log('event lenth',this.eventsWithin30Days)
  
            // console.log(event.EventDate)
          }
        }
      })
    }
  }
  
}
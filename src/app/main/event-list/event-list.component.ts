import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { url } from 'inspector';
import { event } from 'jquery';
import { Subject, takeUntil } from 'rxjs';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  loadingIndicator: boolean = false;

    // Observable
    private _ngUnSubscribe: Subject<void> = new Subject<void>();
  
    private _userDetails: any;
    
  constructor(private utilityService: UtilityService, 
              private http: HttpClient, 
              private router: Router,
              private _authService: AuthService) { }

  eventList: any;


  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT
  public page: number = 1;

  ngOnInit(): void {

    this._authService.getUserDetails$.subscribe(value => this._userDetails = value)
    this.eventListCall();
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }
  public pageChanged(thisPage) {
    this.page = thisPage
  }

  eventListCall() {
    this.loadingIndicator = true;
    this.utilityService.getEventListFromProcess().subscribe(
      res => {
        // this.eventList = res;
        let eventsArr: any[] =res;
        let resArr: any[] = [];

        eventsArr.forEach(event => {
          if(event['Initiator Email'] == this._userDetails.email){
            resArr.push(event);
          }
        })
        this.eventList = resArr;
        // console.log('eventlist',this.eventList);
        this.loadingIndicator = false;
        this.eventList.sort((list1,list2)=>{
          return list2['EventId/EventRequestId'].localeCompare(list1['EventId/EventRequestId']);
        })
      }

    )
  }

  public downloadAttendenceSheet(eventId:string){
  this.loadingIndicator = true;
    console.log('event id is : ',eventId);
    this.utilityService.downloadAttendenceByEventId(eventId).pipe(takeUntil(this._ngUnSubscribe.asObservable())).subscribe(res=>{
      console.log('download url is :', res);
      // window.open(res.fileUrl);
      window.location.href = res.fileUrl;
      this.loadingIndicator = false;
    })

  }



  gotoHonarariumRequest(eventId: any, eventType: any) {
    this.router.navigate(['honararium-payment-request/honararium-request'],
      { queryParams: { 'eventId': eventId, 'eventType': eventType } }
    )
  }

  gotoEvenSettlementRequest(eventId: any, eventType: any) {
    if (eventType == 'Class I') {
      this.router.navigate(['post-event-settlement/event-settlement'],
        { queryParams: { 'eventId': eventId, 'eventType': eventType } }
      )
    }
    else if (eventType == 'Webinar') {
      this.router.navigate(['post-event-settlement/event-settlement-webinar'],
        { queryParams: { 'eventId': eventId, 'eventType': eventType } }
      )
    }
    else if (eventType == 'HCP Consultants') {
      this.router.navigate(['post-event-settlement/event-settlement-hcp-consultants'],
        { queryParams: { 'eventId': eventId, 'eventType': eventType } }
      )
    }
    else if (eventType == 'Medical Utility') {
      this.router.navigate(['post-event-settlement/event-settlement-medical-utility'],
        { queryParams: { 'eventId': eventId, 'eventType': eventType } }
      )
    }

  }



}


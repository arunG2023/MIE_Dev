import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilityService } from '../../services/event-utility/utility-service.service';
import { Config } from '../../config/common-config';
import { FinanceaccountService } from '../../services/financeaccount/financeaccount.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-event-pending',
  templateUrl: './event-pending.component.html',
  styleUrls: ['./event-pending.component.css'],
})
export class EventPendingComponent implements OnInit {
  // Spinner
  loadingIndicator: boolean = false;
  header = ['S.no', 'Event ID', 'Event Type', 'Venue', 'Event Date'];
  eventsWithin30Days: any[] = [];
  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT;
  public page: number = 1;
  allEventList: any;
  after30DaysList: any[] = [];
  private _userDetails: any;

  @Input() eventType: any;
  @Output() dataEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() financeAccountExpense: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private utilityService: UtilityService,
    private finace: FinanceaccountService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this._authService.getUserDetails$.subscribe(res => this._userDetails = res)

    if (this.eventType == 'stallfabric') {
      this.loadingIndicator = true;
      this.utilityService.getEventListFromProcess().subscribe((res) => {
        this.loadingIndicator = false;
        this.filterEventsWithIn30Days(res);
      });
    } 
    else if (this.eventType == 'Medical Utility') {
      this.loadingIndicator = true;
      this.utilityService.getEventListFromProcess().subscribe((res) => {
        this.loadingIndicator = false;
        this.filterEventsWithIn30Days(res);
      });
    }else if (this.eventType == 'honararium'|| this.eventType == 'financeTreasury') {
      this.geteventtype();
    }
  }

  public pageChanged(thisPage) {
    this.page = thisPage;
  }

  //**Filter Events within 30 days */
  filterEventsWithIn30Days(eventList: any) {
    if (Boolean(eventList) && eventList.length > 0) {
     
      eventList.forEach((event) => {
        let today: any = new Date();
        if(event['Initiator Email'] == this._userDetails.email ){
          if (event.EventDate) {
            let eventDate: any = new Date(event.EventDate);
            if (eventDate > today) {
              let Difference_In_Time = eventDate.getTime() - today.getTime();
              let Difference_In_Days = Math.round(
                Difference_In_Time / (1000 * 3600 * 24)
              );
              if (Difference_In_Days <= 45) {
                this.eventsWithin30Days.push(event);
              
              }
            }
            // console.log('30 days list',this.eventsWithin30Days)
            this.eventsWithin30Days.sort((list1,list2)=>{
              return list2['EventId/EventRequestId'].localeCompare(list1['EventId/EventRequestId']);
            })

            let row = 1;
            this.eventsWithin30Days.forEach(event =>  event.row = row++);

            this._send30DaysEventCount();
          }
        }
      });
    }
  }

  geteventtype() {
    this.loadingIndicator = true;
    this.utilityService.getEventListFromProcess().subscribe((res) => {
      this.loadingIndicator = false;
      this.allEventList = res;
      this.after30Days(this.allEventList);
    });
  }
  private after30Days(eventList: any) {
    if (Boolean(eventList)) {
      eventList.forEach((event) => {
        if (Boolean(event.EventDate)) {
          let today: any = new Date();
          let eventDate = new Date(event.EventDate);
          let Difference_In_Time = eventDate.getTime() - today.getTime();
          let Difference_In_Days = Math.round(
            Difference_In_Time / (1000 * 3600 * 24)
          );


          this.after30DaysList.push(event);

        }

          this.after30DaysList.push(event);
        }
      )
    }
  }

  eventSettlement(data) {
    // console.log(data);
    // this.finace.sendData(data);
    this.financeAccountExpense.emit(data);
  }

  honorariumSettlement(data) {
    this.dataEvent.emit(data);
  }
  public onEventClick(value: any, type:string){
    value.for = type;
    // console.log(value)
    this.utilityService.sendData(value);
  }


  private _send30DaysEventCount(){
    let data: any = {
      from : 'eventPending',
      for: 'open30DaysCount',
      eventOpen30DaysCount: this.eventsWithin30Days.length
    }
    this.utilityService.sendData(data);
  }
}

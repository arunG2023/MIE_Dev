import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

@Component({
  selector: 'app-post-event-follow-up',
  templateUrl: './post-event-follow-up.component.html',
  styleUrls: ['./post-event-follow-up.component.css']
})
export class PostEventFollowUpComponent implements OnInit {

  public eventList : any;
  public selectedEvent : string = 'select';
  public loadingIndicator: boolean = false;

  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  constructor(
    private utility: UtilityService, 
    private router : Router
  ) { }

  ngOnInit(): void {
    this.getEventList();
  }

  public getEventList() {
    this.loadingIndicator = true
    this.utility.getEventTypes()
    .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
    .subscribe(res => {
      this.loadingIndicator = false;
        this.eventList = res;
      },
      err => {
        this.loadingIndicator = false;
        console.log(err)
      }
    )
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }

  public onEventSelect(eventType){
    console.log(eventType)
    if(eventType == 'EVTHC'){
      this.router.navigate(['post-event-follow-up/hcp-consultant']);
    }
  }

}

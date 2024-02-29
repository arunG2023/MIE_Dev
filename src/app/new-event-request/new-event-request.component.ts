import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { Config } from '../shared/config/common-config';

@Component({
  selector: 'app-new-event-request',
  templateUrl: './new-event-request.component.html',
  styleUrls: ['./new-event-request.component.css']
})
export class NewEventRequestComponent implements OnInit {

  selectedEvent : string = 'select';

  // Event List 
  eventList : any[] = [];

  constructor(private utility: UtilityService) { 
    
    
    utility.getEventTypes().subscribe(
      res => {
        // console.log(res)
        this.eventList = res;
      },
      err => {
        console.log(err)
      }

    )

    utility.getPreviousEventsFast();
  }


  public class2EventCode: string;
  ngOnInit(): void {
    this.class2EventCode = Config.EVENT_CODE.CLASS_II;
    console.log(this.class2EventCode);
    console.log(this.selectedEvent)
  }

}
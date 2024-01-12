import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../services/utility.service';

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



  ngOnInit(): void {
    
  }

}
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

@Component({
  selector: 'app-new-event-request',
  templateUrl: './new-event-request.component.html',
  styleUrls: ['./new-event-request.component.css']
})
export class NewEventRequestComponent implements OnInit {

  userPayload: any;
  userRoles: string ;
  selectedEvent : string = 'select';

  // Event List 
  eventList : any;

  public loadingIndicator: boolean = false

  constructor(private utility: UtilityService,private auth: AuthService) { 

    this.userPayload = auth.decodeToken();
    this.userRoles = this.userPayload.role;
  }

  ngOnInit(): void {

    console.log(this.userRoles);    
    this.loadEventTypes()
    this.utility.getPreviousEventsFast();
    
  }

  public loadEventTypes() {
    this.loadingIndicator = true
    this.utility.getEventTypes().subscribe(
      res => {
        this.loadingIndicator = false
        console.log(res);
        /*this.eventList = res.filter((event) => 
          (!event.Roles || event.Roles.length === 0 || event.Roles.some((role) => this.userRoles.toLowerCase().includes(role.toLowerCase())))
        );  */      
        this.eventList = res;        
        console.log(this.eventList);
        //this.eventList = res;
      },
      err => {
        this.loadingIndicator = false
        console.log(err)
      }
    )
  }

  public canInitiateEvent(role)
  {

  }

}
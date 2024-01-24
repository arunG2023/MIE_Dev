import { Component } from '@angular/core';
import { UtilityService } from './services/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MIE_TEMPLATE_NEW';

  constructor(private utilityService : UtilityService){
    utilityService.getPreviousEventsFast();
  }
}

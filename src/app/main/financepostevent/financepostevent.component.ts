import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Config } from 'src/app/shared/config/common-config';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-financepostevent',
  templateUrl: './financepostevent.component.html',
  styleUrls: ['./financepostevent.component.css']
})
export class FinanceposteventComponent implements OnInit {
// Spinner
loadingIndicator: boolean = false;
allEventList: any;
after30DaysList: any[] = [];

selectedEvent: any;

honorarDetails: any;
honortableDetails: any[] = [];
eventTypeForId: any[] = [];

honorarium: FormGroup;
showHonarariumContent: Boolean = false;

eventListafter2days: any[] = [];
eventIds: any[] = [];

@Input() expense: any;
@Input() showexpense: any;

constructor(
  private utilityService: UtilityService,
  private _snackBarService: SnackBarService
) {}

ngOnInit(): void {
  // this.After2WorkingDays(this.expense);
  // this.gethonorarium();
  this.honorarium = new FormGroup({
    EventId: new FormControl(''),
  });
  // this.filterHonor(this.expense['EventId/EventRequestId'])
}



// gethonorarium() {
//   this.utilityService.honorariumDetails().subscribe((honorDetails: any) => {
//     this.loadingIndicator = false;
//     this.honorarDetails = honorDetails;
//   });
// }



}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { PostEventService } from 'src/app/shared/services/event-utility/post-event.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-hcp-post-event-follow-up',
  templateUrl: './hcp-post-event-follow-up.component.html',
  styleUrls: ['./hcp-post-event-follow-up.component.css']
})
export class HcpPostEventFollowUpComponent implements OnInit {


  // spinner
  public loadingIndicator: boolean = false;

  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  // Data From Sheet
  panelDetails: any;

  // Data To Show
  eventTableDetails: any[] = [];
  selectedEventDetail: any[] = [];
  selectedEvent: any;
  deviationForm: FormGroup;
  allEventDetails: any;
  selectedEvendId: string;
  selectedEventDetails: any;

  // Expense Table Declaration
  expenseTableDetails: any[] = [];
  expenseTableActualAmountInput: any[] = [];
  changedActualAmount: any[] = [];
  totalBudget: number = 0;
  actualBudget: number = 0;
  payBackToCompany: number = 0;
  amountToPayForInitiator: number = 0;

  // Hide and Show Handling
  showNoData: boolean = false;
  showEventSettlementContent: boolean = false;
  showAggregateSpendDeviation: boolean = false;

  allPanelData: any;

  private _userDetails: any;

  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT

  constructor(
    private _utilityService: UtilityService,
    private _activatedRoute: ActivatedRoute,
    private _snackBarService: SnackBarService,
    private _postEventServe: PostEventService,
    private _authService: AuthService,

  ) { }

  ngOnInit(): void {
    this._authService.getUserDetails$.subscribe(value => this._userDetails = value)
    // Data From Sheet
    this._getExpenseData();
    this.deviationForm = new FormGroup({
      aggregateDeviation: new FormControl(''),
    })



    this._activatedRoute.queryParams.subscribe(params => {
      if (params.eventId && params.eventType) {

      }
      else {
        this._loadEventData();
      }
    })


  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }

  // To Show Event Table
  private _loadEventData(): void {
    this.loadingIndicator = true;
    this._utilityService.getEventListFromProcess()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
       
        this.allEventDetails = res;
        let row = 1
        res.forEach(event => {
          if (event.EventType == 'HCP Consultants') {
            if(event['Initiator Email'] == this._userDetails.email){
              event.row = row++
              this.eventTableDetails.push(event)
            }
          }
        })
        this.loadingIndicator = false;
        if (this.eventTableDetails.length < 1) {
          this.showNoData = true;
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
        }
        else {
          this.showNoData = false;
        }
      })
  }

  // private _getExpenseData(): void {
  //   this._utilityService.honorariumDetails()
  //     .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
  //     .subscribe(res => {
  //       this.panelDetails = res;
  //       console.log(this.panelDetails)
  //     })
  // }

  private _getExpenseData(): void {
    // this.loadingIndicator = true;
    this._postEventServe.getPostEventHcpFollowUp()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(followUpList => {
        this.panelDetails = followUpList;
        // this.loadingIndicator = false
        // console.log(`Here`, this.panelDetails);
        // console.log(typeof followUpList);
        // // this.postEventHcpFollowUpTableDetails = res
        //   for(let list in followUpList){
        //     console.log(list['HCP Name']);
        //     // list['FollowUp_Event_Date'] = list['Follow-up Event Date']
        //     this.postEventHcpFollowUpTableDetails.push(list)
        //   }

        //   console.log(typeof this.postEventHcpFollowUpTableDetails);
        //   console.log(this.postEventHcpFollowUpTableDetails);
        // this.postEventHcpFollowUpTableDetails.push(res)
      })

    this._utilityService.honorariumDetails()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.allPanelData = res;
      })
  }

  // To Get Specific Event Details
  public onEventSelect(eventId: string): void {
    this.expenseTableDetails = [];

    // eventId = 'RQID80'
    this.selectedEventDetails = this.allEventDetails.find(eve => eve['EventId/EventRequestId'] == eventId)
    console.log(this.selectedEventDetails)
    this.selectedEvendId = eventId;


    this.allPanelData.forEach(data => {
      if (data['EventId/EventRequestId'] == this.selectedEvendId) {
        data['How many days since the parent event Completes'] = this._calculateDifferenceInDays(this.selectedEventDetails['EventDate']);
        data['follow_up_Date'] = '';
        data['follow_up_eventId'] = '';
        data['EventDate'] = this.selectedEventDetails['EventDate']
        data['option'] = this._generateOptions(this.selectedEventDetails['InitiatorName'], this.selectedEventDetails['EventDate'],data['MISCode'])
        this.expenseTableDetails.push(data);
      }
    })
    console.log(this.expenseTableDetails)

    if(this.expenseTableDetails.length > 0){
      this.showEventSettlementContent = true;
     
    }
    else{
      this.showEventSettlementContent = false;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_DATA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      
    }

    // this.expenseTableDetails = res;


    // this.panelDetails.forEach(panel => {
    //   console.log(panel['EventId/EventRequestId'], eventId);
    //   // if (panel['EventId/EventRequestId'] == eventId) {
    //     // panel.EventDate = new Date('2024-02-16')
    //     panel.follow_up_Event_Date = panel['Follow-up Event Date'];
    //     panel.new_follow_up_Date = '';
    //     this.expenseTableDetails.push(panel);
    //   // }
    // })


    

  }


  private _calculateDifferenceInDays(date: string) {
    let eventDate = new Date(date);
    let today = new Date();

    if (today.getTime() > eventDate.getTime()) {
      let Difference_In_Time = today.getTime() - eventDate.getTime();

      let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

      console.log(Difference_In_Days)

      return Difference_In_Days;
    }
    else {
      return 0;
    }
  }

  private _generateOptions(initiatorName : string, selectedEventDate: string, misCode: string){
    // console.log(initiatorName);
    // console.log('dsad',this.allPanelData)
    let optionArr: any[] = [];
   
    this.allEventDetails.forEach(event => {
      // if(event['InitiatorName'] == initiatorName && event.EventType == 'HCP Consultants'){
      //   optionArr.push({
      //     eventId: event['EventId/EventRequestId']
      //   })
      // }
      if( event['Post Event Request status']== 'Closure Approved' && new Date(event.EventDate) > new Date(selectedEventDate)){
        console.log('eee',event)
        this.allPanelData.forEach(panel => {
          if(panel['EventId/EventRequestId'] == event['EventId/EventRequestId']){
            // console.log('asas',panel)
            // console.log(panel.HCPName.trim().toLowerCase());
          
            if(panel.MISCode.toString().trim().toLowerCase() == misCode.toString().trim().toLowerCase()){
              optionArr.push({
                    eventId: event['EventId/EventRequestId'],
                    eventDate: event.EventDate
                  })
            }
          }
        })
        // console.log('asass',event.Panelists.split('|'))
        // optionArr.push({
        //   eventId: event['EventId/EventRequestId']
        // })
      }
    })

    console.log(optionArr)
    return optionArr;
  }





  // Submit
  // public onSubmit() {

  //   if ((this.showAggregateSpendDeviation && !Boolean(this.deviationForm.value.aggregateDeviation))) {
  //     this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
  //   }
  //   else {
  //     // console.log('Form Valid');
  //     this.loadingIndicator = true;
  //     let roleDetails = this._authService.decodeToken();
  //     console.log(this.selectedEventDetails)
  //     const apiPayload = {
  //     } 
  //     // console.log(apiPayload)

  //     this._utilityService.postEventSettlementDetails(apiPayload)
  //     .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
  //     .subscribe(res => {
  //       if (res.message == "Data added successfully.") {
  //         this.loadingIndicator = false;
  //         // alert("Event Settlement Submitted Successfully")
  //         this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_POST_SETTLEMENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
  //         this.showEventSettlementContent = false;
  //         this._router.navigate(['view-event-list'])
  //       }
  //     },
  //     err => {
  //       this.loadingIndicator = false;
  //       this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
  //     }
  //     )
  //   }
  // }

}

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Config } from 'src/app/shared/config/common-config';
import { PostEventService } from 'src/app/shared/services/event-utility/post-event.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-post-event-data-follow-up',
  templateUrl: './post-event-data-follow-up.component.html',
  styleUrls: ['./post-event-data-follow-up.component.css']
})
export class PostEventDataFollowUpComponent implements OnInit {

  @Input() showPostEventFollowUpContent: boolean
  @Input() postEventHcpFollowUpTableDetails: any

  public loadingIndicator: boolean = false;
  // public postEventHcpFollowUpTableDetails: any;

  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  public hcpConsultantFollowUpForm: FormGroup;

    // File Handling
    private _allowedTypes: string[];
    allowedTypesForHTML: string;
  
    private agreementFiles: string[] = [];

  constructor(
    private _postEventServe: PostEventService,
    private _snackBarService: SnackBarService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // this._loadEventData()

    console.log(`QQq`, this.postEventHcpFollowUpTableDetails);

    this.hcpConsultantFollowUpForm = new FormGroup({
      hcpName: new FormControl(''),
      misCode: new FormControl(''),
      gO_NGO: new FormControl(''),
      country: new FormControl(''),
      how_many_days_since_the_parent_event_completes: new FormControl(''),
      follow_up_Event: new FormControl(''),
      follow_up_Event_Date: new FormControl(''),
      agreementFile: new FormControl('', Validators.required),
    })

     // Getting Allowed File Types
     this._allowedTypes = Config.FILE.ALLOWED;
     this._generateAllowedFileAcceptAttribute();


  
  }

  
  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }

  public onEventSelect(value:string, followUpList: any,id: number){
    let date: string = '';

    followUpList.forEach(event => {
      if(event.eventId == value ){
        date = event.eventDate
      }
    })
    console.log(value)
    console.log(id);
    console.log(followUpList);
    this.postEventHcpFollowUpTableDetails[id]['follow_up_Date'] = date
  }

  // private _loadEventData(): void {
  //   this.loadingIndicator = true;
  //   this._postEventServe.getPostEventHcpFollowUp()
  //     .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
  //     .subscribe(followUpList => {
  //       this.loadingIndicator=false
  //       console.log(`Here`, followUpList);
  //       console.log(typeof followUpList);
  //       // this.postEventHcpFollowUpTableDetails = res
  //         for(let list in followUpList){
  //           console.log(list['HCP Name']);
  //           // list['FollowUp_Event_Date'] = list['Follow-up Event Date']
  //           this.postEventHcpFollowUpTableDetails.push(list)
  //         }

  //         console.log(typeof this.postEventHcpFollowUpTableDetails);
  //         console.log(this.postEventHcpFollowUpTableDetails);
  //       // this.postEventHcpFollowUpTableDetails.push(res)
  //     })
  // }


  // To Generate accept attribute for HTML
  private _generateAllowedFileAcceptAttribute() {
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', ';
    })
    
  }
  // To Handle File uploads
  private _uploadedFilesLength: number = 0;
  public onFileSelected(event: any, type: string, control: string, id: number) {
    const file = event.target.files[0];

    if (event.target.files.length > 0) {
      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE) {
        const extension = file.name.split('.')[1];
        const reader = new FileReader();

        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;

            if (type == 'other') {
              if (control == 'agreement') {
                this._uploadedFilesLength++;
                this.postEventHcpFollowUpTableDetails[id].agreementFile = base64String.split(',')[1];
                console.log(this.postEventHcpFollowUpTableDetails)
              }
             
            }
          }
        }
        else {
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_TYPE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
          this._resetControl(control);
        }
      }
      else {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_SIZE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        this._resetControl(control);
      }
    }


  }


  public onDateSelect(value:any,id:number){
    console.log(value)
    // let date = new Date(value.timeStamp);
    // console.log(date.toLocaleDateString('en-US'));
    // this.postEventHcpFollowUpTableDetails[id]['follow_up_Date'] = value;
    console.log(this.postEventHcpFollowUpTableDetails)
  }

  private _resetControl(control: string) {
    switch (control) {
    
    }
  }

  public onSubmit() {
    let _followUpAllowedCount: number = 0;
    let notFilled: number = 0;
    this.postEventHcpFollowUpTableDetails.forEach(event => {
      if(event['option'].length > 0){
        _followUpAllowedCount++;

        if(!Boolean(event['follow_up_Date'])){
          notFilled++;
        }
      }

      


    })


    console.log(notFilled)
    if(_followUpAllowedCount > 0 && notFilled > 0){
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ALL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    else{
      if(this._uploadedFilesLength >= _followUpAllowedCount  && _followUpAllowedCount !== 0){
        const apiPayload = [];
  
        console.log(this.postEventHcpFollowUpTableDetails)
        this.postEventHcpFollowUpTableDetails.forEach(details => {
          let data = {
            HcpName: details['HCPName'],
            MisCode: details['MISCode']+'' || ' ',
            GO_NGO: details['HCP Type'],
            Event_Date: new Date(details['Event Date Start']) || ' ',
            Country: 'India',
            How_many_days_since_the_parent_event_completes: details['How many days since the parent event Completes']+'',
            Follow_up_Event: details["follow_up_eventId"] || ' ',
            Follow_up_Event_Date: new Date(details['follow_up_Date']) || ' ',
            AgreementFile: details['agreementFile'] || ''
          }
          apiPayload.push(data);
        })
  
  
        console.log(apiPayload);
        this.loadingIndicator = true;
        
        // console.log(apiPayload)
  
        this._postEventServe.postPostEventHcpFollowUp(apiPayload)
        .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
        .subscribe(res => {
          if (res.message == " success!") {
            this.loadingIndicator = false;
            // alert("Event Settlement Submitted Successfully")
            this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_POST_SETTLEMENT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
            this._router.navigate(['view-event-list'])
          }
        },
        err => {
          this.loadingIndicator = false;
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.SERVER_ERR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        }
        )
  
      }
      else if(_followUpAllowedCount == 0){
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.NO_FOLLOW_UP, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }
      else{
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILE_UPLOAD, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      }
    }

    
    
      
    
  }

}

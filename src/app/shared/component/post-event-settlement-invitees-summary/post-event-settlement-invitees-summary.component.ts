import { Component, Input, OnInit, Sanitizer } from '@angular/core';
import { UtilityService } from '../../services/event-utility/utility-service.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Config } from '../../config/common-config';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-post-event-settlement-invitees-summary',
  templateUrl: './post-event-settlement-invitees-summary.component.html',
  styleUrls: ['./post-event-settlement-invitees-summary.component.css']
})
export class PostEventSettlementInviteesSummaryComponent implements OnInit {
  // Spinner
  public loadingIndicator: boolean = false;
  
  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();


  inviteeForm: FormGroup;



  public menariniInvitees: any[] = [];
  public hcpInvitees: any[] = [];
  public otherInvitees: any[] = [];

  public totalAttendance: number = 0;
  private _totalInviteeAmount: number = 0;

  // File Handling:
  private _allowedTypes: string[];
  public allowedTypesForHTML: string;

  public showAttendanceDeviation: boolean = false;


  constructor(private _utilityService: UtilityService,
              private _snackBarService: SnackBarService,
              private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this._getInvitees();

    this.inviteeForm = new FormGroup({
      totalInvitees: new FormControl({ value: 0, disabled: true },),
      inviteeDeviation: new FormControl('')
    })


    // Getting allowed file types
    this._allowedTypes = Config.FILE.ALLOWED;

    // Generating Allowed types for HTML
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', '
    })
  }

  private _getInvitees() {
    this._utilityService.data
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(data => {
        // console.log('received', data);
        if (data.from == 'eventSettlementInvitees') {
          this._getAttendancePdf(data.eventId);
          this._filterIviteesBasedOnSource(data.data)
          
        }
      })
  }

  public showAttendancePdf: boolean = false;
  public attendancePdfIframeUrl: SafeResourceUrl
  private _getAttendancePdf(eventId: string) {
    // console.log(eventId);
    this.loadingIndicator = true;
    this._utilityService.getPostEventAttendancePdf(eventId)
    .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
    .subscribe(res => {
      this.loadingIndicator = false;
      // console.log(res)
      if(res.data.includes('AttendenceSheet')){
        let file = res.data.split(':');
        this.showAttendancePdf = true;
        // console.log(file)
        this.attendancePdfIframeUrl = this._sanitizeUrl(file[0],file[1]);
        
      }
    },
    err => {
      this.loadingIndicator = false
    })
  }

  private _sanitizeUrl(name: string, url: string): SafeResourceUrl {
    let extension = name.split('.')[1];

    if (extension == 'pdf') {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + url);
    }
  }

  private _filterIviteesBasedOnSource(inviteesList: any) {
    this.menariniInvitees = [];
    this.hcpInvitees = [];
    this.otherInvitees = [];
    this.totalAttendance = 0;
    this._totalInviteeAmount = 0;
    this._totalHcpInviteeActualAmount = 0;
    this._totalMenariniInviteeActualAmount = 0;
    this._totalOtherHcpInviteeActualAmount = 0;
   

    inviteesList.forEach(invitee => {
      if (Boolean(invitee.inviteeSource)) {
        let trimedSource = invitee.inviteeSource.trim().split(' ').join();
        // console.log(trimedSource);
        if (trimedSource.toLowerCase().includes('other')) {
          this.otherInvitees.push(invitee);
          // this._totalOtherHcpInviteeActualAmount += +invitee.actualExpense; 
          // console.log(this._totalHcpInviteeActualAmount)
        }
        else if (trimedSource.toLowerCase().includes('hcp')) {
          this.hcpInvitees.push(invitee);
          // this._totalHcpInviteeActualAmount += +invitee.actualExpense; 
          // console.log(this._totalMenariniInviteeActualAmount)
        }
        else {
          this.menariniInvitees.push(invitee)
          // this._totalMenariniInviteeActualAmount += +invitee.actualAmount;
        }
      }
    })
    
  }

  // Calculating total number of attendance
  public onAttendanceCheckBoxChange(value: string){
    // console.log(value);
    if(value){
      this.totalAttendance++;
    }
    else{
      this.totalAttendance--;
    }
    // console.log(this.totalAttendance)
    if(this.totalAttendance > 0 && this.totalAttendance < 5){
      this.showAttendanceDeviation = true;
    }
    else{
      this.showAttendanceDeviation = false;
    }

    this._sendPayloadData();
  }

  // Calculating Actual amount
  // 1. HCP Invitees
  private _totalHcpInviteeActualAmount: number = 0;
  public onHcpInviteesActualAmountChanges(value: number, invitee: any, id: number){
    this._totalHcpInviteeActualAmount = 0;
    invitee.actualExpense = value;
    this._calculateInviteeFinalAmount();
  }

  // 2. Menarini Invitees
  private _totalMenariniInviteeActualAmount: number = 0;
  public onMenariniInviteesActualAmountChanges(value: number, invitee: any, id: number){

    // console.log(value)
    this._totalMenariniInviteeActualAmount = 0;
    invitee.actualExpense = value;
    this._calculateInviteeFinalAmount();
  }

  // 3. Other HCP Invitees
  private _totalOtherHcpInviteeActualAmount: number = 0;
  public onOtherHcpInviteesActualAmountChanges(value: number, invitee: any, id: number){
    this._totalOtherHcpInviteeActualAmount = 0;
    invitee.actualExpense = value;
    this._calculateInviteeFinalAmount();
  }

  private _inviteeDeviationFile: string;
  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {
      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE) {
        const extension = file.name.split('.')[1];

        const reader = new FileReader();



        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;

            if (type == 'deviation') {
              if(control == 'inviteeDeviation'){
                // this._inviteeDeviationFile = base64String.split(',')[1];
                this._inviteeDeviationFile = "Lessthan5InviteesDeviationFile."+extension+':'+base64String.split(',')[1];
                this._sendPayloadData();
              }
            }
            if (type == 'other') {
             

            }


          }

          // console.log(this.photosFile)
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

  private _resetControl(control: string) {
    switch (control) {
      case 'inviteeDeviation':
        this.inviteeForm.controls.inviteeDeviation.reset();
        break;

    }
  }


  private _calculateInviteeFinalAmount(){
    this._totalHcpInviteeActualAmount = 0;
    this._totalMenariniInviteeActualAmount = 0;
    this._totalOtherHcpInviteeActualAmount = 0;
    this.hcpInvitees.forEach(inv => this._totalHcpInviteeActualAmount += +inv.actualExpense );
    this.menariniInvitees.forEach(inv => this._totalMenariniInviteeActualAmount += +inv.actualExpense);
    this.otherInvitees.forEach(inv => this._totalOtherHcpInviteeActualAmount += +inv.actualExpense);
    this._sendAmount();
  }


  private _sendAmount(){
    let amountData: any = {
      actualInviteeAmount: this._totalHcpInviteeActualAmount + this._totalMenariniInviteeActualAmount + this._totalOtherHcpInviteeActualAmount,
      for: 'actualCalculation',
      from: 'inviteeSummary'
    }
    this._utilityService.sendAdvanceData(amountData);
  }


  private _sendPayloadData(){
    let payLoadData: any = {
      from: 'inviteeSummary',
      for: 'apiPayload',
      attendedInviteesCount: this.totalAttendance,
      attendanceDeviation: this._inviteeDeviationFile
    }

    this._utilityService.sendData(payLoadData);
  }






}

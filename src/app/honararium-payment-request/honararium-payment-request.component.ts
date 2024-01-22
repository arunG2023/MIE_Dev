import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { event } from 'jquery';
import { UtilityService } from '../services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../utility/modal/modal.component';

@Component({
  selector: 'app-honararium-payment-request',
  templateUrl: './honararium-payment-request.component.html',
  styleUrls: ['./honararium-payment-request.component.css']
})
export class HonarariumPaymentRequestComponent implements OnInit {

  stepper: any;
  honorarium: FormGroup;


  // for pagination purpose
  currentpage = 1;
  pageSize = 5;
  length : number;


  show2DaysUpload: boolean = false;
  showuploadifGSTyes: boolean = false;
  pageSizeOptions: number[];





  constructor(private utilityService: UtilityService,private dialog : MatDialog) {
    this.honorarium = new FormGroup({
      //isAfter2Days:new FormControl('',[Validators.required]),
      uploadDeviation: new FormControl('', [Validators.required]),
      uploadSpeakerAgreement: new FormControl('', [Validators.required]),
      uploadPhotos: new FormControl(''),
      uploadFinalHonorariumDetails: new FormControl(''),
      uploadDetails: new FormControl(''),
      isItIncludingGST: new FormControl(''),
      isInviteeslessthan5: new FormControl(''),
      UploadDetails1: new FormControl('')
    })
    this.After2WorkingDays(this.utilityService.getPreviousEvents());

  }
  ngOnInit(): void {
    this.showUpload();
    this.showingDetails();
    // console.log(this.length);
  }

  showUpload() {
    this.honorarium.valueChanges.subscribe(chanegs => {
    this.showuploadifGSTyes = (chanegs.isItIncludingGST == 'Yes') ? true : false;

    })
  }
  eventListafter2days: any[] = [];
  eventIds: any[] = [];
  private After2WorkingDays(eventList: any) {
    if (Boolean(eventList)) {
      eventList.forEach(event => {
        let today: any = new Date();
        let eventDate: any = new Date(event.EventDate);
        const twodays = 2 * 24 * 60 * 60 * 1000;
        if (today.getTime() - eventDate.getTime() >= twodays) {
          this.eventListafter2days.push(event);
          this.eventIds.push(event['EventId/EventRequestId']);
          this.show2DaysUpload = true;

         console.log(this.eventListafter2days);

        }
      })
      this.length = this.eventListafter2days.length;
    }

  }

  //declearing the variable for honorarium details
  honorarDetails: any;
  honortableDetails:any[] = [];
  eventTypeForId : any[] = [];

  private showingDetails() {

    this.utilityService.honorariumDetails().subscribe(honoDetails => {
      this.honorarDetails = honoDetails;
      this.eventListafter2days.forEach(event2 => {
        this.honorarDetails.forEach(honorevent => {
          // if (event2['EventId/EventRequestId'] == honorevent['EventId/EventRequestId']) {
          //   let event = {
          //     eventId : event2['EventId/EventRequestId'],
          //     eventType : event2['EventType']
          //   }
          //   this.eventTypeForId.push(event);
          // // console.log(honorevent);
          //   this.honortableDetails.push(honorevent);
          //   //console.log('print agum ah',this.honortableDetails);
          // }
          this.honortableDetails.push(honorevent);
        })
      })
     
    })
  }

  onSubmit()
  {

    
    let honorariumData :any[] =[] ;

    console.log(this.eventTypeForId)
    this.honortableDetails.forEach(honor=>
      {
        let data={
        HcpName : honor.HCPName,
      EventId : honor['EventId/EventRequestId'],
      EventType : (this.eventTypeForId.length > 0)?this.eventTypeForId.find(event =>event.eventId == honor['EventId/EventRequestId']).eventType: ' ',
      HcpRole : (Boolean(honor.HcpRole))?honor.HcpRole:" ",
      MISCode :(Boolean(honor.MISCode))?honor.MISCode:" ",
      GONGO : (Boolean(honor.GONGO))?honor.GONGO:"",
      IsItincludingGST : this.honorarium.value.isItIncludingGST,
      AgreementAmount : (Boolean(honor.AgreementAmount))?honor.AgreementAmount:" "
        }
       
       honorariumData.push(data);

       

      })
      
    console.log('hnonorarium data',honorariumData);
    const requestHonorariumList = {
      RequestHonorariumList : honorariumData
    };
    this.utilityService.addHonorariumPayment(requestHonorariumList).subscribe( changes=>
      {
        //console.log(changes);
      })

  }

  openhonorariumUpdateModal(honorarium : any){
    const dialogRef =  this.dialog.open(ModalComponent,{
      width: '600px',
      data : {
        forHonararium : true,
        honarariumData : honorarium
      }
    });
  }

  


}

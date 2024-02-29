import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-class2-event-request',
  templateUrl: './class2-event-request.component.html',
  styleUrls: ['./class2-event-request.component.css']
})
export class Class2EventRequestComponent implements OnInit {
  // Spinner
  loadingIndicator: boolean = false;

  // Stepper 
  isLinear: boolean = false;
  orientation: string = 'horizontal';

  // Form Groups
  eventInitiation1: FormGroup;

  // Step 1
  eventDate: string;
  show7DaysUploadDeviation: boolean = false;
  show30DaysUploaDeviation: boolean = false;

  // Step Validity
  isStep1Valid: boolean = false;

    //Min Date
    today: string = new Date().toISOString().split('T')[0];


  constructor() { }

  ngOnInit(): void {
    this.eventInitiation1 = new FormGroup({
      withIn30DaysDeviation: new FormControl(''),
      eventDate: new FormControl('', Validators.required),
      next7DaysDeviation: new FormControl(''),
    });
  }


  // Prepopulate methods
  event1FormPrepopulate() {
    this.eventInitiation1.valueChanges.subscribe((changes) => {
      if (changes.eventDate) {
        let today: any = new Date();
        let eventDate = new Date(changes.eventDate);

        let Difference_In_Time = eventDate.getTime() - today.getTime();

        let Difference_In_Days = Math.round(
          Difference_In_Time / (1000 * 3600 * 24)
        );

        this.eventDate = changes.eventDate;

        if (Difference_In_Days <= 7) {
          this.show7DaysUploadDeviation = true;
        } else this.show7DaysUploadDeviation = false;
      }
      let step1Validity = 0;

      if (
        this.eventInitiation1.valid &&
        !this.show7DaysUploadDeviation &&
        !this.show30DaysUploaDeviation
      ) {
        step1Validity = 0;
      }
      if (
        this.show7DaysUploadDeviation &&
        !Boolean(this.eventInitiation1.value.next7DaysDeviation)
      ) {
        step1Validity++;
      }
      if (
        this.show30DaysUploaDeviation &&
        !Boolean(this.eventInitiation1.value.withIn30DaysDeviation)
      ) {
        step1Validity++;
      }
      if (step1Validity == 0) {
        this.isStep1Valid = true;
      } else {
        this.isStep1Valid = false;
      }
    });
  }

}

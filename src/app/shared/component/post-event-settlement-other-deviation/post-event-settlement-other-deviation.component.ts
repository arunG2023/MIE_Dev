import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Config } from '../../config/common-config';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
import { UtilityService } from '../../services/event-utility/utility-service.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post-event-settlement-other-deviation',
  templateUrl: './post-event-settlement-other-deviation.component.html',
  styleUrls: ['./post-event-settlement-other-deviation.component.css']
})
export class PostEventSettlementOtherDeviationComponent implements OnInit {

  // Form Group
  otherDeviationForm: FormGroup;
  deviationForm: FormGroup;

  // File Handling:
  private _allowedTypes: string[];
  allowedTypesForHTML: string;

  showDeviationForm: boolean = false;
  showOtherDeviationField: boolean = false;

    // Observable
    private _ngUnSubscribe: Subject<void> = new Subject<void>();

    DeviationTypes: any[] = [];
  constructor(private _snackBarService: SnackBarService, private _utilityService: UtilityService) { }

  ngOnInit(): void {

    this.otherDeviationForm = new FormGroup({
      needDeviation: new FormControl('', [Validators.required])
    })

    this.deviationForm = new FormGroup({
      deviationType: new FormControl('', [Validators.required]),
      otherDeviationField: new FormControl({ value: '', disabled: false }),
      deviationUpload: new FormControl('', [Validators.required])
    })

    this._allowedTypes = Config.FILE.ALLOWED;

    // Generating Allowed types for HTML
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', '
    })

    // prepopulating the deviation form based on yes or no
    this._otherFormDeviationPopulate();
    this._deviationFormPopulate();

    //  api call for deviation types
    this._utilityService.otherDeviationTypes().pipe(takeUntil(this._ngUnSubscribe.asObservable())).subscribe( (res: any[])=>{
      this.DeviationTypes = res;
      // console.log(this.DeviationTypes);
    })
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }


  // show and hide deivation form 
  private _otherFormDeviationPopulate() {
    this.otherDeviationForm.valueChanges.subscribe(changes => {
      if (changes.needDeviation == 'Yes') {
        this.showDeviationForm = true;
      }
      else {
        this.showDeviationForm = false;
      }
    })
  }

  private _deviationFormPopulate() {
    this.deviationForm.valueChanges.subscribe(changes => {
      if (changes.deviationType == 'Others') {
        this.showOtherDeviationField = true;
      }
      else {
        this.showOtherDeviationField = false;
      }
    })
  }

  // declearing the variable to store the file 
  deviationUploadFile: string[] = [];

  public onFileSelected(event: any, type: string, control: string) {
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
              if (control == 'deviationUpload') {
                this.deviationUploadFile.push(base64String.split(',')[1]);
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

  private _resetControl(control: string) {
    switch (control) {
      case 'deviationUpload':
        this.otherDeviationForm.controls.deviationUpload.reset();
        break;

    }
  }

  //  declaring the variable for deviation table
  deviationTableDetails: any[] = [];
  public addDeviation() {
    let formValidity: number = 0;
    if (!this.deviationForm.valid) {
      formValidity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.OTHER_DEVIATION_ERROR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    if (this.showDeviationForm && (!this.otherDeviationForm.valid)) {
      formValidity++;
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.OTHER_DEVIATION_ERROR, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
    }
    if (formValidity == 0) {
      const otherDeviationData = {
        deviationType: this.deviationForm.value.deviationType,
        deviationFile: this.deviationForm.value.deviationUpload.split('\\').pop()
      }
      this.deviationTableDetails.push(otherDeviationData);
      // console.log(this.deviationTableDetails);
      this.deviationForm.reset();
      this.otherDeviationForm.reset();
    }
  }







}

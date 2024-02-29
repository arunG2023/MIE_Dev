import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  ValidationErrors,
  Validators, FormArray,

} from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import { ModuleService } from 'src/app/shared/services/event-utility/module.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Config } from 'src/app/shared/config/common-config';
import { environment } from 'src/environments/environment';
import { ErrorDialogComponent } from 'src/app/main/general-modules/error-dialog/error-dialog.component';


@Component({
  selector: 'edit-add-trainer',
  templateUrl: './edit-trainer.component.html',
  styleUrls: ['./edit-trainer.component.css']
})
export class EditTrainerComponent implements OnInit {
   

   public loadingIndicator = false;
   trainers: any[] = [];
   hpcMasters: any;
   divisions: any;
   trainerTypes:Array<string> = [];
   countries:Array<string> = [];
   cities:any;
   states:any;
   statesMaster:any;
   specialities:Array<string> = [];
   trainerCriterias:Array<string> = [];
   trainerBrands:any;
   trainerNameSelected: string = '';
   // Form group name
   editTrainerCodeCreationForm : FormGroup;
   trainerCertificateFileString: string = '';
   trainerCVFileString: string = '';
  
    brands:any;
   public isThreads:boolean = false;
   
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  _filteredMISCodes: Observable<string[]>;
  _filteredTrainerNames: Observable<string[]>;
  brandsType: string;

   constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _http : HttpClient,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _moduleService: ModuleService,
    private _router: Router,
    private _authService: AuthService,
    public dialogRef: MatDialogRef<EditTrainerComponent>
             ) 
   { 


   }

  ngOnInit(): void {


      // Custom validator for "Tier I Criteria" and "Tier II Criteria" checkboxes
    const tierICriteriaValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const tierISelected = control.get('trainerCriteriaSelectionId')?.value === 'Tier I Criteria';
      const tierIOptions = [
        control.get('trainerCriteriasTireIOptions1')?.value,
        control.get('trainerCriteriasTireIOptions2')?.value,
        control.get('trainerCriteriasTireIOptions3')?.value,
        control.get('trainerCriteriasTireIOptions4')?.value,
        control.get('trainerCriteriasTireIOptions5')?.value,
        control.get('trainerCriteriasTireIOptions6')?.value,
      ];

      const tierIISelected = control.get('trainerCriteriaSelectionId')?.value === 'Tier II Criteria';
      const tierIIOptions = [
        control.get('trainerCriteriasTireIIOptions1')?.value,
        control.get('trainerCriteriasTireIIOptions2')?.value,
        control.get('trainerCriteriasTireIIOptions3')?.value,
        control.get('trainerCriteriasTireIIOptions4')?.value,
        control.get('trainerCriteriasTireIIOptions5')?.value,
        control.get('trainerCriteriasTireIIOptions6')?.value,
      ];

      if (tierISelected) {
        // Validation logic for "Tier I Criteria" checkboxes
        const selectedOptions = tierIOptions.slice(0, 3); // First three options are mandatory
        const selectedCount = selectedOptions.filter(Boolean).length;

        if (selectedCount < 3) {
          return { tierICriteriaInvalid: true };
        }

        const additionalOptions = tierIOptions.slice(3); // Additional options
        const additionalSelectedCount = additionalOptions.filter(Boolean).length;

        if (additionalSelectedCount < 2) {
          return { tierIAdditionalOptionsInvalid: true };
        }
      }

      if (tierIISelected) {
        // Validation logic for "Tier II Criteria" checkboxes
        const requiredOptions = tierIIOptions.slice(0, 3); // First three options are required
        const requiredSelectedCount = requiredOptions.filter(Boolean).length;

        if (requiredSelectedCount < 3) {
          return { tierIICriteriaInvalid: true };
        }

        const additionalOptions = tierIIOptions.slice(3); // Additional options
        const additionalSelectedCount = additionalOptions.filter(Boolean).length;

        if (additionalSelectedCount < 2) {
          return { tierIIAdditionalOptionsInvalid: true };
        }
      }

      return null;
    };



    console.log(this.data);
    let data = this.data;

      if (data['Trainer Brand'] == 'Threads'){
        data['Trainer Brand'] = "Threads";
      }else{
        data['Trainer Brand'] = "Fillers";
      }
      console.log(data);
     this.editTrainerCodeCreationForm = this._formBuilder.group({
       misCode : new FormControl((data['MisCode']?data['MisCode']:''), Validators.required),
       trainerName : new FormControl((data['Trainer Name']?data['Trainer Name']:''), Validators.required),
       trainerId : new FormControl((data['TrainerId']?data['TrainerId']:'')),
       speciality : new FormControl((data['Speciality']?data['Speciality']:''), Validators.required),
       qualification : new FormControl((data['Qualification']?data['Qualification']:''), Validators.required),
       trainerType : new FormControl((data['Trainer Type']?data['Trainer Type']:''), Validators.required),
       //trainerTypesName : new FormControl((data['TrainerId']?data['TrainerId']:''), Validators.required),
       country : new FormControl((data['Country']?data['Country']:''), Validators.required),
       address : new FormControl((data['Address']?data['Address']:''), Validators.required),
       city : new FormControl((data['City']?data['City']:'')),
       state : new FormControl((data['State']?data['State']:'')),
       trainerBrand : new FormControl((data['Trainer Brand']?data['Trainer Brand']:'')),
       contactNumber : new FormControl((data['Contact Number']?data['Contact Number']:''), Validators.required),
       trainerCode : new FormControl((data['Trainer Code']?data['Trainer Code']:'')),
       divisionId : new FormControl((data['Division']?data['Division']:''), Validators.required),
       trainerCriteriaSelectionId : new FormControl((data['Trainer Criteria']?data['Trainer Criteria']:''), Validators.required),
       trainerCategory : new FormControl((data['Trainer Category']?data['Trainer Category']:'')),
       trainedBy : new FormControl((data['Trained by']?data['Trained by']:'')),
       trainedOn : new FormControl((data['Trained on']?data['Trained on']:'')),
       trainerCertificate : new FormControl(),
       trainerCertificateFile : new FormControl(),
       trainerCV : new FormControl(),
       trainerCVFile : new FormControl(),
       trainerCriteriasTireIOptions1 :new FormControl(),
       trainerCriteriasTireIOptions2 :new FormControl(),
       trainerCriteriasTireIOptions3 :new FormControl(),
       trainerCriteriasTireIOptions4 :new FormControl(),
       trainerCriteriasTireIOptions5 :new FormControl(),
       trainerCriteriasTireIOptions6 :new FormControl(),
       trainerCriteriasTireIIOptions1 : new FormControl(),
       trainerCriteriasTireIIOptions2 : new FormControl(),
       trainerCriteriasTireIIOptions3 : new FormControl(),
       trainerCriteriasTireIIOptions4 : new FormControl(),
       trainerCriteriasTireIIOptions5 : new FormControl(),
       trainerCriteriasTireIIOptions6 : new FormControl(),

     }, { validator: tierICriteriaValidator });
      this.trainerTypes = this._moduleService.getTrainerTypesData();

      this.countries = this._moduleService.getCountriesData();


      let trainerCriteriaSelectionIdValue=(data['Trainer Criteria']?data['Trainer Criteria']:'');
      let trainerCriteriaDetails=(data['Trainer Criteria Details']?data['Trainer Criteria Details']:'').toLowerCase();

      if(trainerCriteriaSelectionIdValue=='Tier I Criteria')
      {
          if(trainerCriteriaDetails.includes("certified through menarini training course to do the procedure (not applicable for fillers)"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIOptions1:true});
          }
          if(trainerCriteriaDetails.includes("duly qualified and recognized by peers/ other specialists as an expert within his/her field"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIOptions2:true});
          }
          if(trainerCriteriaDetails.includes("performed minimum 5 independent aesthetic procedure for the relevant product"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIOptions3:true});
          }
          if(trainerCriteriaDetails.includes("speaks/chairs sessions at international conferences"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIOptions4:true});
          }
          if(trainerCriteriaDetails.includes("author/editor of leading textbooks or publishes in leading clinical peer-reviewed journals"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIOptions5:true});
          }
          if(trainerCriteriaDetails.includes("practices as a specialist in their respective area of specialization with > 12 years of experience"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIOptions6:true});
          }
      }
      else if(trainerCriteriaSelectionIdValue=='Tier II Criteria')
      {          
          if(trainerCriteriaDetails.includes("certified through menarini training course to do the procedure (not applicable for fillers)"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIIOptions1:true});
          }   
          if(trainerCriteriaDetails.includes("duly qualified and recognized by peers/ other specialists as an expert within his/her field"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIIOptions2:true});
          }   
          if(trainerCriteriaDetails.includes("performed minimum 5 independent aesthetic procedure for the relevant product"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIIOptions3:true});
          }   
          if(trainerCriteriaDetails.includes("speaks/chairs sessions at national conferences"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIIOptions4:true});
          }   
          if(trainerCriteriaDetails.includes("publishes regularly in leading clinical or scientific journals"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIIOptions5:true});
          }   
          if(trainerCriteriaDetails.includes("practices as a specialist in their respective area of specialization"))
          {
              this.editTrainerCodeCreationForm.patchValue({trainerCriteriasTireIIOptions6:true});
          }
      }

      this._moduleService.getSpecialitiesData()
      .subscribe(res => {
        console.log(res);
        this.specialities = res
      })

      this.trainerCriterias=this._moduleService.getAllTrainerCriteriasData();

      //this._getApprovedTrainers();
      this._getDivisions();
      this._getAllStates();
      this._getAllCities();
      this._getAllTrainerBrands();


        // Initialize the autocomplete for MIS Code
        this._filteredMISCodes = this.editTrainerCodeCreationForm.get('misCode').valueChanges.pipe(
          startWith(''),
          map((value) => this._filterMISCodes(value))
        );

        this.editTrainerCodeCreationForm.get('city').valueChanges.subscribe((city) => {
          this._filterStates(city);
        }); 
/*
        // Initialize the autocomplete for TrainerNames
        this._filteredTrainerNames = this.editTrainerCodeCreationForm.get('trainerName').valueChanges.pipe(
          startWith(''),
          map((value) => this._filterTrainerNames(value))
        );
*/

      this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').valueChanges.subscribe((trainerCriteriaSelectionId) => {
        this.onTrainerCriteriaSelected(trainerCriteriaSelectionId);
      });
      this.editTrainerCodeCreationForm.get('trainerBrand').valueChanges.subscribe((trainerBrandId) => {
        if(trainerBrandId.toLowerCase().includes("threads"))
        {
          this.editTrainerCodeCreationForm.get("trainedBy").enable();
          this.editTrainerCodeCreationForm.get("trainedOn").enable();
          this.isThreads=true;
          this.editTrainerCodeCreationForm.get('trainedBy').setValidators([Validators.required]);
          this.editTrainerCodeCreationForm.get('trainedOn').setValidators([Validators.required]);
          this.editTrainerCodeCreationForm.get('trainerCertificate').setValidators([Validators.required]);
          this.editTrainerCodeCreationForm.get('trainerCV').setValidators([Validators.required]);
          //this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').setValidators([Validators.required]);

          this.editTrainerCodeCreationForm.get('trainerCertificate').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainerCV').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainedBy').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainedOn').updateValueAndValidity();
          //this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').updateValueAndValidity();
        }
        else
        {
          this.editTrainerCodeCreationForm.get("trainedBy").disable();
          this.editTrainerCodeCreationForm.get("trainedOn").disable();
          this.isThreads=false;
          this.editTrainerCodeCreationForm.get('trainedBy').setValidators(null);
          this.editTrainerCodeCreationForm.get('trainedOn').setValidators(null);
          this.editTrainerCodeCreationForm.get('trainerCertificate').setValidators(null);
          this.editTrainerCodeCreationForm.get('trainerCV').setValidators(null);
          //this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').setValidators(null);

          this.editTrainerCodeCreationForm.get('trainerCertificate').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainerCV').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainedBy').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainedOn').updateValueAndValidity();
        }
      });

        if(this.editTrainerCodeCreationForm.get('trainerBrand').value.toLowerCase().includes("threads"))
        {
          this.editTrainerCodeCreationForm.get("trainedBy").enable();
          this.editTrainerCodeCreationForm.get("trainedOn").enable();
          this.isThreads=true;
          this.editTrainerCodeCreationForm.get('trainedBy').setValidators([Validators.required]);
          this.editTrainerCodeCreationForm.get('trainedOn').setValidators([Validators.required]);
          this.editTrainerCodeCreationForm.get('trainerCertificate').setValidators([Validators.required]);
          this.editTrainerCodeCreationForm.get('trainerCV').setValidators([Validators.required]);
          //this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').setValidators([Validators.required]);

          this.editTrainerCodeCreationForm.get('trainerCertificate').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainerCV').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainedBy').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainedOn').updateValueAndValidity();
          //this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').updateValueAndValidity();
        }
        else
        {

          this.editTrainerCodeCreationForm.get("trainedBy").disable();
          this.editTrainerCodeCreationForm.get("trainedOn").disable();
          this.isThreads=false;
          this.editTrainerCodeCreationForm.get('trainedBy').setValidators(null);
          this.editTrainerCodeCreationForm.get('trainedOn').setValidators(null);
          this.editTrainerCodeCreationForm.get('trainerCertificate').setValidators(null);
          this.editTrainerCodeCreationForm.get('trainerCV').setValidators(null);
          //this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').setValidators(null);

          this.editTrainerCodeCreationForm.get('trainerCertificate').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainerCV').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainedBy').updateValueAndValidity();
          this.editTrainerCodeCreationForm.get('trainedOn').updateValueAndValidity();
        }
  }

  private _getApprovedTrainers() {
    this._utilityService.getApprovedTrainersForAutocomplete().subscribe(
      (trainers) => {
        console.log(trainers);
        this.trainers = trainers;
      },
      (error) => {
        console.error('Error loading trainers:', error);
      }
    );
  }
  private _getDivisions() {
    this._moduleService.getDivisionsData()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.divisions = res
      })
  }
  private _getAllTrainerBrands() {
    this._utilityService.getBrandNames()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.brands  =res;
        const uniqueNamesSet = new Set(this.brands.map(brand => brand.BrandName));
        uniqueNamesSet.forEach((data)=>{
          if(data == 'Definisse Threads' || data == 'Definisse Fillers'){
            this.trainerBrands = Array.from(uniqueNamesSet).sort();
            console.log(uniqueNamesSet);
            }
        })
        
      });


    

  }

  private _getAllStates() {
    this._utilityService.getAllStates()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.statesMaster = res
      })
  }
  private _getAllCities() {
    this._utilityService.getAllCities()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.cities = res
      })
  }

/*  private _filterTrainerNames(value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    console.log(filterValue,this.trainers);
    return this.trainers
      .map((trainer) => {
        let trainerName =`${trainer.TrainerName}`;
        if(trainer.MISCode)
        {
          trainerName = trainerName + `(${trainer.MISCode})`;
        }
        let misCode=trainerName;
        return misCode;
      })
      .filter((trainerName) => {
        console.log(trainerName,'aa');
        return (trainerName && trainerName.toString().toLowerCase().includes(filterValue))
      });
  }
*/


  private _filterStates(value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    if(value=='')
    {
      return this.states=this.statesMaster;
    }
    this.states=[];
    var states=[]; 
    this.cities.forEach((city) => {
        if(city.CityName && city.CityName==value)
          states.push(city);
      }); 
      states.forEach(stateID => {
          this.statesMaster.forEach(stM => {
            console.log(stM);
            if(stM['StateId']==stateID['StateId'])
            {
              this.states.push(stM); 
            }
          });
      });
    return this.states;
  }
  
  private _filterMISCodes(value: string): string[] {
    const filterOptionNA = 'N/A';
    const filterValue = value.toString().toLowerCase();
    console.log(filterValue,this.trainers);
    var misCodes = this.trainers
      .map((trainer) => trainer.MISCode)
      .filter((misCode) => {
        return (misCode && misCode.toString().toLowerCase().includes(filterValue))
      }); 
    misCodes.push('N/A');
    return misCodes;
  }
  // Event handler for the optionSelected event of mat-autocomplete
  onMISCodeSelected(event: any) {
   const selectedMISCode = event.option.value;
      const selectedTrainer = this.findTrainerByMISCode(selectedMISCode);
      console.log(selectedTrainer);
      if (selectedTrainer) {
        // Set values in the form for the selected trainer
          var isNonGO = selectedTrainer.isNonGO=='no'?"GO":"N-GO";
          this.editTrainerCodeCreationForm.patchValue({
             trainerName: selectedTrainer.TrainerName,       
             speciality : selectedTrainer.Speciality,
             qualification : selectedTrainer.Qualification,
             trainerType : selectedTrainer.TrainerType,
             country : selectedTrainer.Country,
             address : selectedTrainer.Address,
             city : selectedTrainer.CityId,
             state : selectedTrainer.StateId,
             //panCard : selectedTrainer.,
             //contactNumber : selectedTrainer.,
             //trainerCode : selectedTrainer.TrainerCode
          });
        }
        else if(selectedMISCode == 'N/A') 
        {
          this.editTrainerCodeCreationForm.patchValue({
            //speakerName: '',       
              speciality : '',
              qualification : '',
             //goNgoAgo : '',
             country : 'India',
             address : '',
             city : '',
             state : '',
             //panCard : '',
             //contactNumber : '',
             trainerCode : ''
          });
        } else {
          this.editTrainerCodeCreationForm.patchValue({
            //trainerName: '',       
              speciality : '',
              qualification : '',
             //goNgoAgo : '',
             country : '',
             address : '',
             city : '',
             state : '',
             //panCard : '',
             //contactNumber : '',
             trainerCode : ''
          });
        }
  }

  // Event handler for the optionSelected event of mat-autocomplete
  onTrainerNameSelected(event: any) {
   const selectedTrainerName = event.option.value;
      const selectedTrainer = this.findTrainerByTrainerName(selectedTrainerName);
      console.log(selectedTrainer);
      if (selectedTrainer) {
        // Set values in the form for the selected trainer
          this.trainerNameSelected = selectedTrainer.trainerName;
          var isNonGO = selectedTrainer.isNonGO=='no'?"GO":"N-GO";
          this.editTrainerCodeCreationForm.patchValue({
             misCode: selectedTrainer.MISCode,       
             speciality : selectedTrainer.Speciality,
             qualification : selectedTrainer.Qualification,
             goNgoAgo : isNonGO,
             country : selectedTrainer.Country,
             address : selectedTrainer.Address,
             city : selectedTrainer.CityId,
             state : selectedTrainer.StateId,
             //panCard : selectedTrainer.,
             //contactNumber : selectedTrainer.,
             //trainerCode : selectedTrainer.TrainerCode
          });
        } else {

          this.trainerNameSelected = '';
          this.editTrainerCodeCreationForm.patchValue({
            //trainerName: '',       
              speciality : '',
              qualification : '',
             //goNgoAgo : '',
             country : '',
             address : '',
             city : '',
             state : '',
             //panCard : '',
             //contactNumber : '',
             //trainerCode : ''
          });
        }
  }

  findTrainerByMISCode(misCode: string): any {
    return this.trainers.find((trainer) => trainer.MISCode === misCode);
  }

  findTrainerByTrainerName(trainerName: string): any {
    return this.trainers.find((trainer) => `${trainer.TrainerName} (${trainer.MISCode})` === trainerName);
  }


   //  Method to handle form submission
   submit(){
      if (this.editTrainerCodeCreationForm.invalid) {
        const errors = this.collectErrors(this.editTrainerCodeCreationForm);
        this.openErrorDialog(errors);
        return;
      }        
    //  if(this.editTrainerCodeCreationForm.valid){

       let roleDetails = this._authService.decodeToken();
       this.loadingIndicator = true;
       var trainerNameToSubmit = '';
       if(this.trainerNameSelected=='')
       {
         trainerNameToSubmit = this.editTrainerCodeCreationForm.get('trainerName').value;
       }
       else 
       {
          trainerNameToSubmit = this.trainerNameSelected;
       }


       let trainerCriteriaDetailsValue = [];
       var trainerCriteriaSelectionIdValue = this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').value;
        if(trainerCriteriaSelectionIdValue=='Tier I Criteria')
        {
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIOptions1').value)
            {
                trainerCriteriaDetailsValue.push("Certified through Menarini training course to do the procedure (Not applicable for fillers)");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIOptions2').value)
            {
                trainerCriteriaDetailsValue.push("Duly qualified and recognized by peers/ other specialists as an expert within his/her field");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIOptions3').value)
            {
                trainerCriteriaDetailsValue.push("Performed minimum 5 independent aesthetic procedure for the relevant product");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIOptions4').value)
            {
                trainerCriteriaDetailsValue.push("Speaks/chairs sessions at international conferences");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIOptions5').value)
            {
                trainerCriteriaDetailsValue.push("Author/editor of leading textbooks or publishes in leading clinical peer-reviewed journals");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIOptions6').value)
            {
                trainerCriteriaDetailsValue.push("Practices as a specialist in their respective area of specialization with > 12 years of experience");
            }
        }
        else if(trainerCriteriaSelectionIdValue=='Tier II Criteria')
        {
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions1').value)
            {
                trainerCriteriaDetailsValue.push("Certified through Menarini training course to do the procedure (Not applicable for fillers)");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions2').value)
            {
                trainerCriteriaDetailsValue.push("Duly qualified and recognized by peers/ other specialists as an expert within his/her field");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions3').value)
            {
                trainerCriteriaDetailsValue.push("Performed minimum 5 independent aesthetic procedure for the relevant product");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions4').value)
            {
                trainerCriteriaDetailsValue.push("Speaks/chairs sessions at national conferences");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions5').value)
            {
                trainerCriteriaDetailsValue.push("Publishes regularly in leading clinical or scientific journals");
            }
            if(this.editTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions6').value)
            {
                trainerCriteriaDetailsValue.push("Practices as a specialist in their respective area of specialization");
            }
        }  


        let trainerName=this.editTrainerCodeCreationForm.get('trainerName').value.toString();
        let trainerCode=this.editTrainerCodeCreationForm.get('trainerCode').value.toString();
        let trainerBrand=this.editTrainerCodeCreationForm.get('trainerBrand').value.toString();
        let misCode=this.editTrainerCodeCreationForm.get('misCode').value.toString();
        let division=this.editTrainerCodeCreationForm.get('divisionId').value.toString();
        let speciality=this.editTrainerCodeCreationForm.get('speciality').value.toString();
        let qualification=this.editTrainerCodeCreationForm.get('qualification').value.toString();
        let address=this.editTrainerCodeCreationForm.get('address').value.toString();
        let city=this.editTrainerCodeCreationForm.get('city').value.toString();
        let state=this.editTrainerCodeCreationForm.get('state').value.toString();
        let country=this.editTrainerCodeCreationForm.get('country').value.toString();
        let contact_Number=this.editTrainerCodeCreationForm.get('contactNumber').value.toString();
        let trainerType=this.editTrainerCodeCreationForm.get('trainerType').value.toString();
        let trainedby=this.editTrainerCodeCreationForm.get('trainedBy').value.toString();
        let trainedon=this.editTrainerCodeCreationForm.get('trainedOn').value.toString();
        let trainer_Category=this.editTrainerCodeCreationForm.get('trainerCategory').value.toString();
        let trainer_Criteria=this.editTrainerCodeCreationForm.get('trainerCriteriaSelectionId').value.toString();
        if (this.editTrainerCodeCreationForm.get('trainerBrand').value == 'Threads'){
          this.brandsType = "Threads"
        }else{
          this.brandsType = "Fillers"
        }

        let trainerCVVal = this.trainerCVFileString || '';
        let trainercertificateVal=this.trainerCertificateFileString  || '';


        const payload = {

          trainerId: this.editTrainerCodeCreationForm.get('trainerId').value.toString(),
          trainerName: this.editTrainerCodeCreationForm.get('trainerName').value+"",
          trainerCode: (trainerCode?trainerCode:""),
          trainerBrand: this.brandsType,
          misCode: this.editTrainerCodeCreationForm.get('misCode').value.toString(),
          division: division,
          speciality: speciality,
          qualification: qualification,
          address: address,
          city: city,
          state: state,
          country: country,
          contact_Number: contact_Number,
          trainerType: (trainerType?trainerType:""),
          trainedby: (trainedby?trainedby:""),
          trainerCV: trainerCVVal,
          trainercertificate: trainercertificateVal,
          trainedon: (trainedon?trainedon:""),
          trainer_Category: trainer_Category,
          trainer_Criteria: trainer_Criteria,
          trainer_Criteria_Details: trainerCriteriaDetailsValue.join(","),
          InitiatorNameName: roleDetails.unique_name || ' ',
          InitiatorEmail: roleDetails.email || ' ',    
          salesHead: roleDetails.SalesHead,
          medicalAffairsHead: roleDetails.MarketingHead || ' ',  
        };
        console.log(`payload`, payload);
        this._moduleService.updateTrainerDatausingTrainerId(payload)
          .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
          .subscribe(res => {
            // console.log(`Response`, res);
            if(res) {

              this.loadingIndicator = false;
              this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_TRAINERCODE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
              this.dialogRef.close();
              this._router.navigate(['/master-list']);
              //this.editTrainerCodeCreationForm.reset();              
            } else {
              this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.ADD_TRAINERCODE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
            }
          },(error)=>{

              this.loadingIndicator = false;
              console.log(error);
              if(error['error']['text'])
              {
                this._snackBarService.showSnackBar(error['error']['text'], Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);  
              }
              else
              {                
                this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.ADD_TRAINERCODE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);  
              }

          });
 
    //  }
     
   }

   onTrainerCertificateFileSelected($event)
   {
       this.convertTrainerCertificateFileToBase64(); // Convert file to base64 before submission
  }

   onTrainerCVFileSelected($event)
   {
       this.convertTrainerCVFileToBase64(); // Convert file to base64 before submission
  }

  convertTrainerCertificateFileToBase64() {
        const fileInput = document.getElementById('trainerCertificate') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.trainerCertificateFileString = base64String.split(',')[1];
            console.log(base64String);
            this.editTrainerCodeCreationForm.patchValue({
              trainerCertificateFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }
  convertTrainerCVFileToBase64() {
        const fileInput = document.getElementById('trainerCV') as HTMLInputElement;
        const files = fileInput.files;

        if (files && files.length > 0) {
          const file: File = files[0];
          const reader = new FileReader();

          reader.onload = () => {
            let base64String = reader.result as string;
            base64String = this.trainerCVFileString = base64String.split(',')[1];
            this.editTrainerCodeCreationForm.patchValue({
              trainerCVFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }
    isTrainerBrandThreads(): boolean 
    {
      const { trainerBrand } = this.editTrainerCodeCreationForm.value;
      console.log(trainerBrand);
      if(trainerBrand && trainerBrand.trim() !== '' && trainerBrand.toLowerCase().includes('threads'))
      {
        return true;
      }
      return false;
    }
    isTrainerMISCodeNA(): boolean 
    {
      let { misCode } = this.editTrainerCodeCreationForm.value;
      misCode = (misCode?misCode:"").toString();
      console.log(misCode);
      if(misCode && misCode.trim() !== '' && misCode.trim() !== 'N/A')
      {
        return true;
      }
      return false;
    }
    isHPCUserExist(): boolean {
      const { hcpName, misCode } = this.editTrainerCodeCreationForm.value;

      //console.log(hcpName.trim(),misCode.trim());
      // Check if both hcpName and misCode are not blank
      if(hcpName.trim() !== '' && misCode.trim() !== '')
      {
        return false;
      }
      return false;
    }
    enableTrainer(): boolean {
      const { hcpName, misCode } = this.editTrainerCodeCreationForm.value;
      if(hcpName.trim() !== '' && misCode.trim() !== '')
      {
        return true;
      }
      return false;
    }
    isTrainerCategoryEnable(): boolean {
      return false;
    }


    createNewHCPUser() {
      const { hcpName, misCode } = this.editTrainerCodeCreationForm.value;

      // Add logic here to handle the creation of a new HCP User
      console.log('Creating new HCP User:', hcpName, misCode);
      
      // You can add more complex logic or call a service to handle user creation
    }
    findTrainerById(trainerId: number): any {
      //return this.trainers.find(trainer => trainer.TrainerId === trainerId);
    }
    onTrainerCriteriaSelected(selectedTrainerCriteria): void{
      this.editTrainerCodeCreationForm.patchValue({
        trainerCategory:this._moduleService.getTrainerCategoryFromCriteria(selectedTrainerCriteria)
      });
    }


  public validateMisCode():void{
    let data = this.data;
    if(this.editTrainerCodeCreationForm.get("misCode").value!='' && 
        this.editTrainerCodeCreationForm.get("misCode").value!=data.MisCode && 
        this.editTrainerCodeCreationForm.get("misCode").value!='N/A' && 
        this.editTrainerCodeCreationForm.get("misCode").value!='n/a'
      )
    {    
      this.loadingIndicator=true;
      console.log(this.editTrainerCodeCreationForm.get("misCode").value);

      this._utilityService.getRowDataUsingMISCodeandType(this.editTrainerCodeCreationForm.get("misCode").value,'Trainer').subscribe(
        (hpc) => {
          console.log(hpc);
          if(hpc && hpc['message'])
          {
              let errors=[];
              errors.push(hpc['message']);
              this.openErrorDialog(errors);
          }
          else if(hpc)
          {
              this.editTrainerCodeCreationForm.get("trainerName").setValue(hpc[0]['HCPName']);
              this.editTrainerCodeCreationForm.get("address").setValue(hpc[0]['Company Name']);
              this.editTrainerCodeCreationForm.get("trainerType").setValue(hpc[0]['HcpType']);
              if(this.editTrainerCodeCreationForm.get("trainerName").value)
              {
                this.editTrainerCodeCreationForm.get("trainerName").disable();
              }
              if(this.editTrainerCodeCreationForm.get("address").value)
              {
                this.editTrainerCodeCreationForm.get("address").disable();
              }
              if(this.editTrainerCodeCreationForm.get("trainerType").value)
              {
                this.editTrainerCodeCreationForm.get("trainerType").disable();
              }
          }
          else
          {            
            this.editTrainerCodeCreationForm.get("trainerName").enable();
            this.editTrainerCodeCreationForm.get("address").enable();
            this.editTrainerCodeCreationForm.get("trainerType").enable();
          }
          this.loadingIndicator=false;
        },
        (error) => {
          console.error('Error loading hpc:', error);
          this.loadingIndicator=false;
        }
      );    
    } 
    else
    {            
      this.editTrainerCodeCreationForm.get("trainerName").enable();
      this.editTrainerCodeCreationForm.get("address").enable();
      this.editTrainerCodeCreationForm.get("trainerType").enable();
    } 
  }

    isCriteriaOptionMatch(v): boolean {
      const { trainerCriteriaSelectionId } = this.editTrainerCodeCreationForm.value;
      if(trainerCriteriaSelectionId && trainerCriteriaSelectionId == v)
      {
        return true;
      }
      else
      {
        return false;
      }
    }   


  public onTrainerCriteriaSelectionIdChange(event)
  {
      console.log('onTrainerCriteriaSelectionIdChange',event.value);
      if(event.value=='Tier I Criteria')
      {

            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions1").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions2").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions3").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions4").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions5").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions6").setValue(false);
      }
      else if(event.value=='Tier II Criteria')
      {
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIOptions1").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIOptions2").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIOptions3").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIOptions4").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIOptions5").setValue(false);
            this.editTrainerCodeCreationForm.get("trainerCriteriasTireIOptions6").setValue(false);
      }  
  }  

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }  


  collectErrors(formControl): string[] {
    const errors: string[] = [];
    // Collect errors from the form controls as needed
    // Example:
    
      errors.push('Please fill all required fields.');
    // Add other error checks based on your form structure

    return errors;
  }

  openErrorDialog(errors: string[]): void {
    this._dialog.open(ErrorDialogComponent, {
      data: { errors },
    });
  }  
}


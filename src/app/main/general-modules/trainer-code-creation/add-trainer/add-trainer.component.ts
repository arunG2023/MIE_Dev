import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

import { Subject, takeUntil } from 'rxjs';
import { Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import { Config } from 'src/app/shared/config/common-config';
import { ModuleService } from 'src/app/shared/services/event-utility/module.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorDialogComponent } from 'src/app/main/general-modules/error-dialog/error-dialog.component';

@Component({
  selector: 'app-add-trainer',
  templateUrl: './add-trainer.component.html',
  styleUrls: ['./add-trainer.component.css']
})
export class AddTrainerComponent implements OnInit {
   

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
   addTrainerCodeCreationForm : FormGroup;
   trainerCertificateFileString: string = '';
   trainerCVFileString: string = '';

   public isThreads:boolean = false;
  
    brands:any;
   
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  _filteredMISCodes: Observable<string[]>;
  _filteredTrainerNames: Observable<string[]>;
  brandsType: string;

   constructor(private _http : HttpClient,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _moduleService: ModuleService,
    private _router: Router,
    private _authService: AuthService,
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



     this.addTrainerCodeCreationForm = this._formBuilder.group({
       misCode : new FormControl('', Validators.required),
       trainerName : new FormControl('', Validators.required),
       trainerId : new FormControl(),
       speciality : new FormControl('', Validators.required),
       qualification : new FormControl('', Validators.required),
       trainerType : new FormControl('', Validators.required),
       //trainerTypesName : new FormControl('', Validators.required),
       country : new FormControl('', Validators.required),
       address : new FormControl('', Validators.required),
       city : new FormControl(''),
       state : new FormControl(''),
       trainerBrand : new FormControl(),
       contactNumber : new FormControl('', Validators.required),
       trainerCode : new FormControl(),
       divisionId : new FormControl('', Validators.required),
       trainerCriteriaSelectionId : new FormControl('', Validators.required),
       trainerCategory : new FormControl(),
       trainedBy : new FormControl(),
       trainedOn : new FormControl(),
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


        this.addTrainerCodeCreationForm.valueChanges.subscribe((changes) => {
            console.log(this.addTrainerCodeCreationForm.valid);
            console.log(this.addTrainerCodeCreationForm);
        });
        // Initialize the autocomplete for MIS Code
        this._filteredMISCodes = this.addTrainerCodeCreationForm.get('misCode').valueChanges.pipe(
          startWith(''),
          map((value) => this._filterMISCodes(value))
        );

        this.addTrainerCodeCreationForm.get('city').valueChanges.subscribe((city) => {
          this._filterStates(city);
        }); 
/*
        // Initialize the autocomplete for TrainerNames
        this._filteredTrainerNames = this.addTrainerCodeCreationForm.get('trainerName').valueChanges.pipe(
          startWith(''),
          map((value) => this._filterTrainerNames(value))
        );
*/

      this.addTrainerCodeCreationForm.get('trainerCriteriaSelectionId').valueChanges.subscribe((trainerCriteriaSelectionId) => {
        this.onTrainerCriteriaSelected(trainerCriteriaSelectionId);
      });
      this.addTrainerCodeCreationForm.get('trainerBrand').valueChanges.subscribe((trainerBrandId) => {
        if(trainerBrandId.toLowerCase().includes("threads"))
        {
          this.addTrainerCodeCreationForm.get("trainedBy").enable();
          this.addTrainerCodeCreationForm.get("trainedOn").enable();
          this.isThreads=true;
          this.addTrainerCodeCreationForm.get('trainedBy').setValidators([Validators.required]);
          this.addTrainerCodeCreationForm.get('trainedOn').setValidators([Validators.required]);
          this.addTrainerCodeCreationForm.get('trainerCertificate').setValidators([Validators.required]);
          this.addTrainerCodeCreationForm.get('trainerCV').setValidators([Validators.required]);
          //this.addTrainerCodeCreationForm.get('trainerCriteriaSelectionId').setValidators([Validators.required]);

          this.addTrainerCodeCreationForm.get('trainerCertificate').updateValueAndValidity();
          this.addTrainerCodeCreationForm.get('trainerCV').updateValueAndValidity();
          this.addTrainerCodeCreationForm.get('trainedBy').updateValueAndValidity();
          this.addTrainerCodeCreationForm.get('trainedOn').updateValueAndValidity();
          //this.addTrainerCodeCreationForm.get('trainerCriteriaSelectionId').updateValueAndValidity();
        }
        else
        {
          this.addTrainerCodeCreationForm.get("trainedBy").disable();
          this.addTrainerCodeCreationForm.get("trainedOn").disable();
          this.isThreads=false;
          this.addTrainerCodeCreationForm.get('trainedBy').setValidators(null);
          this.addTrainerCodeCreationForm.get('trainedOn').setValidators(null);
          this.addTrainerCodeCreationForm.get('trainerCertificate').setValidators(null);
          this.addTrainerCodeCreationForm.get('trainerCV').setValidators(null);
          //this.addTrainerCodeCreationForm.get('trainerCriteriaSelectionId').setValidators(null);

          this.addTrainerCodeCreationForm.get('trainerCertificate').updateValueAndValidity();
          this.addTrainerCodeCreationForm.get('trainerCV').updateValueAndValidity();
          this.addTrainerCodeCreationForm.get('trainedBy').updateValueAndValidity();
          this.addTrainerCodeCreationForm.get('trainedOn').updateValueAndValidity();
          //this.addTrainerCodeCreationForm.get('trainerCriteriaSelectionId').updateValueAndValidity();
        }
      });

          this.addTrainerCodeCreationForm.get("trainedBy").disable();
          this.addTrainerCodeCreationForm.get("trainedOn").disable();
          this.isThreads=false;
          this.addTrainerCodeCreationForm.get('trainerCertificate').setValidators(null);
          this.addTrainerCodeCreationForm.get('trainerCV').setValidators(null);
          this.addTrainerCodeCreationForm.get('trainedBy').setValidators(null);
          this.addTrainerCodeCreationForm.get('trainedOn').setValidators(null);



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
   /*const selectedMISCode = event.option.value;
      console.log(selectedMISCode);
      const selectedTrainer = this.findTrainerByMISCode(selectedMISCode);
      console.log(selectedTrainer);
      if (selectedTrainer) {
        // Set values in the form for the selected trainer
          var isNonGO = selectedTrainer.isNonGO=='no'?"GO":"N-GO";
          this.addTrainerCodeCreationForm.patchValue({
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
          this.addTrainerCodeCreationForm.patchValue({
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
          this.addTrainerCodeCreationForm.patchValue({
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
        }*/
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
          this.addTrainerCodeCreationForm.patchValue({
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
          this.addTrainerCodeCreationForm.patchValue({
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
      if (this.addTrainerCodeCreationForm.invalid) {
        const errors = this.collectErrors(this.addTrainerCodeCreationForm);
        this.openErrorDialog(errors);
        return;
      }    
      if(this.addTrainerCodeCreationForm.valid){

       let roleDetails = this._authService.decodeToken();
       this.loadingIndicator = true;
       var trainerNameToSubmit = '';
       if(this.trainerNameSelected=='')
       {
         trainerNameToSubmit = this.addTrainerCodeCreationForm.get('trainerName').value;
       }
       else 
       {
          trainerNameToSubmit = this.trainerNameSelected;
       }


       let trainerCriteriaDetailsValue = [];
       var trainerCriteriaSelectionIdValue = this.addTrainerCodeCreationForm.get('trainerCriteriaSelectionId').value;
        if(trainerCriteriaSelectionIdValue=='Tier I Criteria')
        {
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIOptions1').value)
            {
                trainerCriteriaDetailsValue.push("Certified through Menarini training course to do the procedure (Not applicable for fillers)");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIOptions2').value)
            {
                trainerCriteriaDetailsValue.push("Duly qualified and recognized by peers/ other specialists as an expert within his/her field");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIOptions3').value)
            {
                trainerCriteriaDetailsValue.push("Performed minimum 5 independent aesthetic procedure for the relevant product");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIOptions4').value)
            {
                trainerCriteriaDetailsValue.push("Speaks/chairs sessions at international conferences");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIOptions5').value)
            {
                trainerCriteriaDetailsValue.push("Author/editor of leading textbooks or publishes in leading clinical peer-reviewed journals");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIOptions6').value)
            {
                trainerCriteriaDetailsValue.push("Practices as a specialist in their respective area of specialization with > 12 years of experience");
            }
        }
        else if(trainerCriteriaSelectionIdValue=='Tier II Criteria')
        {
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions1').value)
            {
                trainerCriteriaDetailsValue.push("Certified through Menarini training course to do the procedure (Not applicable for fillers)");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions2').value)
            {
                trainerCriteriaDetailsValue.push("Duly qualified and recognized by peers/ other specialists as an expert within his/her field");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions3').value)
            {
                trainerCriteriaDetailsValue.push("Performed minimum 5 independent aesthetic procedure for the relevant product");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions4').value)
            {
                trainerCriteriaDetailsValue.push("Speaks/chairs sessions at national conferences");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions5').value)
            {
                trainerCriteriaDetailsValue.push("Publishes regularly in leading clinical or scientific journals");
            }
            if(this.addTrainerCodeCreationForm.get('trainerCriteriasTireIIOptions6').value)
            {
                trainerCriteriaDetailsValue.push("Practices as a specialist in their respective area of specialization");
            }
        }  


        let trainerName=this.addTrainerCodeCreationForm.get('trainerName').value;
        let trainerCode=this.addTrainerCodeCreationForm.get('trainerCode').value;
        let trainerBrand=this.addTrainerCodeCreationForm.get('trainerBrand').value;
        let misCode=this.addTrainerCodeCreationForm.get('misCode').value;
        let division=this.addTrainerCodeCreationForm.get('divisionId').value;
        let speciality=this.addTrainerCodeCreationForm.get('speciality').value;
        let qualification=this.addTrainerCodeCreationForm.get('qualification').value;
        let address=this.addTrainerCodeCreationForm.get('address').value;
        let city=this.addTrainerCodeCreationForm.get('city').value;
        let state=this.addTrainerCodeCreationForm.get('state').value;
        let country=this.addTrainerCodeCreationForm.get('country').value;
        let contact_Number=this.addTrainerCodeCreationForm.get('contactNumber').value;
        let trainerType=this.addTrainerCodeCreationForm.get('trainerType').value;
        let trainedby=this.addTrainerCodeCreationForm.get('trainedBy').value;
        let trainedon=this.addTrainerCodeCreationForm.get('trainedOn').value;
        let trainer_Category=this.addTrainerCodeCreationForm.get('trainerCategory').value;
        let trainer_Criteria=this.addTrainerCodeCreationForm.get('trainerCriteriaSelectionId').value;
        if (this.addTrainerCodeCreationForm.get('trainerBrand').value == 'Threads'){
          this.brandsType = "Threads"
        }else{
          this.brandsType = "Fillers"
        }
        const payload = {
          trainerName: this.addTrainerCodeCreationForm.get('trainerName').value+"",
          trainerCode: (trainerCode?trainerCode:""),
          trainerBrand: this.brandsType,
          misCode: this.addTrainerCodeCreationForm.get('misCode').value.toString(),
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
          trainerCV: this.trainerCVFileString || '',
          trainercertificate: this.trainerCertificateFileString || '',
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
        this._moduleService.addTrainerCodeCreationDetails(payload)
          .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
          .subscribe(res => {
            // console.log(`Response`, res);
            if(res) {

              this.loadingIndicator = false;
              this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_TRAINERCODE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
              this._router.navigate(['/master-list']);
              //this.addTrainerCodeCreationForm.reset();              
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
 
      }
     
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
            this.addTrainerCodeCreationForm.patchValue({
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
            this.addTrainerCodeCreationForm.patchValue({
              trainerCVFile: base64String,
            });
          };

          reader.readAsDataURL(file);
        }
  }
    isTrainerBrandThreads(): boolean 
    {
      const { trainerBrand } = this.addTrainerCodeCreationForm.value;
      //console.log(trainerBrand);
      if(trainerBrand && trainerBrand.trim() !== '' && trainerBrand.toLowerCase().includes('threads'))
      {
        return true;
      }
      return false;
    }
    isTrainerMISCodeNA(): boolean 
    {
      let { misCode } = this.addTrainerCodeCreationForm.value;
      misCode = (misCode?misCode:"").toString();
      //console.log(misCode);
      if(misCode && misCode.trim() !== '' && misCode.trim() !== 'N/A' && misCode.trim() !== 'n/a')
      {
        return true;
      }
      return false;
    }
    isHPCUserExist(): boolean {
      const { hcpName, misCode } = this.addTrainerCodeCreationForm.value;

      //console.log(hcpName.trim(),misCode.trim());
      // Check if both hcpName and misCode are not blank
      if(hcpName.trim() !== '' && misCode.trim() !== '')
      {
        return false;
      }
      return false;
    }
    enableTrainer(): boolean {
      const { hcpName, misCode } = this.addTrainerCodeCreationForm.value;
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
      const { hcpName, misCode } = this.addTrainerCodeCreationForm.value;

      // Add logic here to handle the creation of a new HCP User
      console.log('Creating new HCP User:', hcpName, misCode);
      
      // You can add more complex logic or call a service to handle user creation
    }
    findTrainerById(trainerId: number): any {
      //return this.trainers.find(trainer => trainer.TrainerId === trainerId);
    }
    onTrainerCriteriaSelected(selectedTrainerCriteria): void{
      this.addTrainerCodeCreationForm.patchValue({
        trainerCategory:this._moduleService.getTrainerCategoryFromCriteria(selectedTrainerCriteria)
      });
    }


  public validateMisCode():void{

    if(this.addTrainerCodeCreationForm.get("misCode").value!='' && this.addTrainerCodeCreationForm.get("misCode").value!='N/A' && this.addTrainerCodeCreationForm.get("misCode").value!='n/a')
    {
      this.addTrainerCodeCreationForm.get("country").setValue('India');
      this.loadingIndicator=true;
      //console.log(this.addTrainerCodeCreationForm.get("misCode").value);

      this._utilityService.getRowDataUsingMISCodeandType(this.addTrainerCodeCreationForm.get("misCode").value,'Trainer').subscribe(
        (hpc) => {
          if(hpc && hpc['message'])
          {
              let errors=[];
              errors.push(hpc['message']);
              this.openErrorDialog(errors);
          }
          else if(hpc)
          {
              this.addTrainerCodeCreationForm.get("trainerName").setValue(hpc[0]['HCPName']);
              this.addTrainerCodeCreationForm.get("address").setValue(hpc[0]['Company Name']);
              this.addTrainerCodeCreationForm.get("trainerType").setValue(hpc[0]['HcpType']);
              if(this.addTrainerCodeCreationForm.get("trainerName").value)
              {
                this.addTrainerCodeCreationForm.get("trainerName").disable();
              }
              if(this.addTrainerCodeCreationForm.get("address").value)
              {
                this.addTrainerCodeCreationForm.get("address").disable();
              }
              if(this.addTrainerCodeCreationForm.get("trainerType").value)
              {
                this.addTrainerCodeCreationForm.get("trainerType").disable();
              }
          }
          else
          {            
            this.addTrainerCodeCreationForm.get("trainerName").enable();
            this.addTrainerCodeCreationForm.get("address").enable();
            this.addTrainerCodeCreationForm.get("trainerType").enable();
          }
          this.loadingIndicator=false;
        },
        (error) => {
          console.error('Error loading hpc:', error);
          this.loadingIndicator=false;
          this.addTrainerCodeCreationForm.get("trainerName").enable();
          this.addTrainerCodeCreationForm.get("address").enable();
          this.addTrainerCodeCreationForm.get("trainerType").enable();
        }
      );   
    }
    else
    {            
      this.addTrainerCodeCreationForm.get("trainerName").enable();
      this.addTrainerCodeCreationForm.get("address").enable();
      this.addTrainerCodeCreationForm.get("trainerType").enable();
    }   
  }

    isCriteriaOptionMatch(v): boolean {
      const { trainerCriteriaSelectionId } = this.addTrainerCodeCreationForm.value;
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

            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions1").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions2").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions3").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions4").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions5").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIIOptions6").setValue(false);
      }
      else if(event.value=='Tier II Criteria')
      {
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIOptions1").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIOptions2").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIOptions3").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIOptions4").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIOptions5").setValue(false);
            this.addTrainerCodeCreationForm.get("trainerCriteriasTireIOptions6").setValue(false);
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


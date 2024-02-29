import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators, FormArray } from '@angular/forms';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import { Config } from 'src/app/shared/config/common-config';
import { ModuleService } from 'src/app/shared/services/event-utility/module.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ErrorDialogComponent } from 'src/app/main/general-modules/error-dialog/error-dialog.component';


@Component({
  selector: 'app-add-speaker',
  templateUrl: './add-speaker.component.html',
  styleUrls: ['./add-speaker.component.css']
})
export class AddSpeakerComponent implements OnInit {



   public loadingIndicator = false;

   speakers: any[] = [];
   hpcMasters: any;
   divisions: any;
   speakerTypes:Array<string> = [];
   countries:Array<string> = [];
   cities:any;
   states:any;
   statesMaster:any;
   specialities:Array<string> = [];
   speakerCriterias:Array<string> = [];
   speakerNameSelected: string = '';

   // Form group name
   addSpeakerCodeCreationForm : FormGroup;

   
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  _filteredMISCodes: Observable<string[]>;
  _filteredSpeakerNames: Observable<string[]>;

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
    
 
/*
     // Getting event details from sheet
      this._utilityService.getEmployeesFromHCPMaster().subscribe(
       res => {
       this.hpcMasters = res;
       console.log(res)
       },
       err => {
         alert("OOPS Some error occured")
       }
     ); */
   }

  ngOnInit(): void {




      // Custom validator for "Tier I Criteria" and "Tier II Criteria" checkboxes
    const tierICriteriaValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const tierISelected = control.get('speakerCriteriaSelectionId')?.value === 'Tier I Criteria';
      const tierIOptions = [
        control.get('speakerCriteriasTireIOptions1')?.value,
        control.get('speakerCriteriasTireIOptions2')?.value,
        control.get('speakerCriteriasTireIOptions3')?.value,
        control.get('speakerCriteriasTireIOptions4')?.value,
        control.get('speakerCriteriasTireIOptions5')?.value,
        control.get('speakerCriteriasTireIOptions6')?.value,
      ];

      const tierIISelected = control.get('speakerCriteriaSelectionId')?.value === 'Tier II Criteria';
      const tierIIOptions = [
        control.get('speakerCriteriasTireIIOptions1')?.value,
        control.get('speakerCriteriasTireIIOptions2')?.value,
        control.get('speakerCriteriasTireIIOptions3')?.value,
        control.get('speakerCriteriasTireIIOptions4')?.value,
        control.get('speakerCriteriasTireIIOptions5')?.value,
        control.get('speakerCriteriasTireIIOptions6')?.value,
      ];

      const tierIIISelected = control.get('speakerCriteriaSelectionId')?.value === 'Tier III Criteria';

      const tierIIIOptions = [
        control.get('speakerCriteriasTireIIIOptions1')?.value,
      ];

      if (tierISelected) {
        // Validation logic for "Tier I Criteria" checkboxes
        //const selectedOptions = tierIOptions.slice(0, 3); // First three options are mandatory
        const selectedCount = tierIOptions.filter(option => option).length;
        console.log('selectedCount',selectedCount);
        if (selectedCount < 2) {
          return { tierICriteriaInvalid: true };
        }
      }

      if (tierIISelected) {
        // Validation logic for "Tier II Criteria" checkboxes
        const requiredSelectedCount = tierIIOptions.filter(option => option).length;

        if (requiredSelectedCount < 2) {
          return { tierIICriteriaInvalid: true };
        }
      }

      if (tierIIISelected) {
        // Validation logic for "Tier II Criteria" checkboxes
        const requiredSelectedCount = tierIIIOptions.filter(option => option).length;

        if (requiredSelectedCount < 1) {
          return { tierIIICriteriaInvalid: true };
        }
      }

      return null;
    };




     this.addSpeakerCodeCreationForm = this._formBuilder.group({
      //  misCode : new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z0-9]*')]),
      misCode : new FormControl('', Validators.required),
       speakerName : new FormControl('', Validators.required),
       speakerId : new FormControl(),
       speciality : new FormControl('', Validators.required),
       qualification : new FormControl('', Validators.required),
       goNgoAgo : new FormControl('', Validators.required),
       country : new FormControl('', Validators.required),
       address : new FormControl('', Validators.required),
       city : new FormControl(''),
       state : new FormControl(''),
       contactNumber : new FormControl('', Validators.required),
       speakerCode : new FormControl(),
       divisionId : new FormControl('', Validators.required),
       speakerCriteriaSelectionId : new FormControl('', Validators.required),
       speakerCategory : new FormControl(),
       speakerCriteriasTireIOptions1 :new FormControl(),
       speakerCriteriasTireIOptions2 :new FormControl(),
       speakerCriteriasTireIOptions3 :new FormControl(),
       speakerCriteriasTireIIOptions1 : new FormControl(),
       speakerCriteriasTireIIOptions2 : new FormControl(),
       speakerCriteriasTireIIOptions3 : new FormControl(),
       speakerCriteriasTireIIIOptions1 : new FormControl(),
     }, { validator: tierICriteriaValidator });

      this.speakerTypes = this._moduleService.getSpeakerTypesData();

      this.countries = this._moduleService.getCountriesData();

      //this.specialities=this._moduleService.getSpecialitiesData();
      this._moduleService.getSpecialitiesData()
      .subscribe(res => {
        console.log(res);
        this.specialities = res
      })
      this.speakerCriterias=this._moduleService.getAllSpeakerCriteriasData();

      //this._getApprovedSpeakers();
      this._getDivisions();
      this._getAllStates();
      this._getAllCities();
      this.speakerSelectionFormPrePopulate();


        // Initialize the autocomplete for MIS Code
        this._filteredMISCodes = this.addSpeakerCodeCreationForm.get('misCode').valueChanges.pipe(
          startWith(''),
          map((value) => this._filterMISCodes(value))
        );
        this.addSpeakerCodeCreationForm.get('city').valueChanges.subscribe((city) => {
          this._filterStates(city);
        });        

/*
        // Initialize the autocomplete for SpeakerNames
        this._filteredSpeakerNames = this.addSpeakerCodeCreationForm.get('speakerName').valueChanges.pipe(
          startWith(''),
          map((value) => this._filterSpeakerNames(value))
        );
*/

      this.addSpeakerCodeCreationForm.get('speakerCriteriaSelectionId').valueChanges.subscribe((speakerCriteriaSelectionId) => {
        this.onSpeakerCriteriaSelected(speakerCriteriaSelectionId);
      });




  }

  private _getApprovedSpeakers() {
    this._utilityService.getApprovedSpeakersForAutocomplete().subscribe(
      (speakers) => {
        console.log(speakers);
        this.speakers = speakers;
      },
      (error) => {
        console.error('Error loading speakers:', error);
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

/*  private _filterSpeakerNames(value: string): string[] {

    const filterValue = value.toString().toLowerCase();
    console.log(filterValue,this.speakers);
    return this.speakers
      .map((speaker) => {
        let speakerName =`${speaker.SpeakerName}`;
        if(speaker.MISCode)
        {
          speakerName = speakerName + `(${speaker.MISCode})`;
        }
        let misCode=speakerName;
        return misCode;
      })
      .filter((speakerName) => {
        console.log(speakerName,'aa');
        return (speakerName && speakerName.toString().toLowerCase().includes(filterValue))
      });
  }*/

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
    console.log(filterValue,this.speakers);
    var misCodes = this.speakers
      .map((speaker) => speaker.MISCode)
      .filter((misCode) => {
        return (misCode && misCode.toString().toLowerCase().includes(filterValue))
      }); 
    misCodes.push('N/A');
    return misCodes;
  }
  // Event handler for the optionSelected event of mat-autocomplete
  onMISCodeSelected(event: any) {
   /*const selectedMISCode = event.option.value;
      const selectedSpeaker = this.findSpeakerByMISCode(selectedMISCode);
      console.log(selectedSpeaker);
      if (selectedSpeaker) {
        // Set values in the form for the selected speaker
          var isNonGO = selectedSpeaker.isNonGO=='no'?"GO":"N-GO";
          this.addSpeakerCodeCreationForm.patchValue({
             speakerName: selectedSpeaker.SpeakerName,       
             speciality : selectedSpeaker.Speciality,
             qualification : selectedSpeaker.Qualification,
             goNgoAgo : isNonGO,
             country : selectedSpeaker.Country,
             address : selectedSpeaker.Address,
             city : selectedSpeaker.CityId,
             state : selectedSpeaker.StateId,
             //panCard : selectedSpeaker.,
             //contactNumber : selectedSpeaker.,
             //speakerCode : selectedSpeaker.SpeakerCode
          });
        } 
        else if(selectedMISCode == 'N/A') 
        {
          this.addSpeakerCodeCreationForm.patchValue({
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
             speakerCode : ''
          });
        }*/
  }

  // Event handler for the optionSelected event of mat-autocomplete
  onSpeakerNameSelected(event: any) {
   const selectedSpeakerName = event.option.value;
      const selectedSpeaker = this.findSpeakerBySpeakerName(selectedSpeakerName);
      console.log(selectedSpeaker);
      if (selectedSpeaker) {
        // Set values in the form for the selected speaker
          this.speakerNameSelected = selectedSpeaker.speakerName;
          var isNonGO = selectedSpeaker.isNonGO=='no'?"GO":"N-GO";
          this.addSpeakerCodeCreationForm.patchValue({
             misCode: selectedSpeaker.MISCode,       
             speciality : selectedSpeaker.Speciality,
             qualification : selectedSpeaker.Qualification,
             goNgoAgo : isNonGO,
             country : selectedSpeaker.Country,
             address : selectedSpeaker.Address,
             city : selectedSpeaker.CityId,
             state : selectedSpeaker.StateId,
             //panCard : selectedSpeaker.,
             //contactNumber : selectedSpeaker.,
             //speakerCode : selectedSpeaker.SpeakerCode
          });
        } else {

          this.speakerNameSelected = '';
          this.addSpeakerCodeCreationForm.patchValue({
            //speakerName: '',       
              speciality : '',
              qualification : '',
             //goNgoAgo : '',
             country : '',
             address : '',
             city : '',
             state : '',
             //panCard : '',
             //contactNumber : '',
             //speakerCode : ''
          });
        }
  }

  findSpeakerByMISCode(misCode: string): any {
    return this.speakers.find((speaker) => speaker.MISCode === misCode);
  }

  findSpeakerBySpeakerName(speakerName: string): any {
    return this.speakers.find((speaker) => `${speaker.SpeakerName} (${speaker.MISCode})` === speakerName);
  }

  speakerSelectionFormPrePopulate():void{
     /*   this.addSpeakerCodeCreationForm.valueChanges.subscribe(
          changes => {
            console.log("changes",changes);
       });
      this.addSpeakerCodeCreationForm.get('speakerId').valueChanges.subscribe((selectedSpeakerId) => {
        this.updateSpeakerInfo(selectedSpeakerId);
      });*/
  }
   //  Method to handle form submission
   submit(){
      if (this.addSpeakerCodeCreationForm.invalid) {
        const errors = this.collectErrors(this.addSpeakerCodeCreationForm);
        this.openErrorDialog(errors);
        return;
      }        
     if(this.addSpeakerCodeCreationForm.valid){

       let roleDetails = this._authService.decodeToken();

       this.loadingIndicator = true;
       var speakerNameToSubmit = '';
       if(this.speakerNameSelected=='')
       {
         speakerNameToSubmit = this.addSpeakerCodeCreationForm.get('speakerName').value;
       }
       else 
       {
          speakerNameToSubmit = this.speakerNameSelected;
       }

       let speakerCriteriaDetailsValue = [];
       var speakerCriteriaSelectionIdValue = this.addSpeakerCodeCreationForm.get('speakerCriteriaSelectionId').value;
        if(speakerCriteriaSelectionIdValue=='Tier I Criteria')
        {
            if(this.addSpeakerCodeCreationForm.get('speakerCriteriasTireIOptions1').value)
            {
                speakerCriteriaDetailsValue.push("Speaks/chairs sessions at international conferences");
            }
            if(this.addSpeakerCodeCreationForm.get('speakerCriteriasTireIOptions2').value)
            {
                speakerCriteriaDetailsValue.push("Duly qualified and practices as a specialist in their respective area of specialization with > 12 years of experience");
            }
            if(this.addSpeakerCodeCreationForm.get('speakerCriteriasTireIOptions3').value)
            {
                speakerCriteriaDetailsValue.push("Author/editor of leading textbooks or publishes in leading clinical peer-reviewed journals");
            }
        }
        else if(speakerCriteriaSelectionIdValue=='Tier II Criteria')
        {
            if(this.addSpeakerCodeCreationForm.get('speakerCriteriasTireIIOptions1').value)
            {
                speakerCriteriaDetailsValue.push("Speaks/chairs sessions at national conferences");
            }
            if(this.addSpeakerCodeCreationForm.get('speakerCriteriasTireIIOptions2').value)
            {
                speakerCriteriaDetailsValue.push("Publishes regularly in leading clinical or scientific journals");
            }
            if(this.addSpeakerCodeCreationForm.get('speakerCriteriasTireIIOptions3').value)
            {
                speakerCriteriaDetailsValue.push("Duly qualified and practices as a specialist in their respective area of specialization");
            }
        }
        else if(speakerCriteriaSelectionIdValue=='Tier III Criteria')
        {
            if(this.addSpeakerCodeCreationForm.get('speakerCriteriasTireIIIOptions1').value)
            {
              speakerCriteriaDetailsValue.push("Recognized by peers/ other specialists as an expert within his/her field");
            }
        }       
        var misCodeVal = this.addSpeakerCodeCreationForm.get('misCode').value.toString();
        var speakerCode = this.addSpeakerCodeCreationForm.get('speakerCode').value
        const payload = {
          speakerName: this.addSpeakerCodeCreationForm.get('speakerName').value.toString(),
          speakerCode: (speakerCode?speakerCode:""),
          misCode: (misCodeVal.toLowerCase()=='n/a'?"":misCodeVal),
          division: this.addSpeakerCodeCreationForm.get('divisionId').value.toString(),
          speciality: this.addSpeakerCodeCreationForm.get('speciality').value.toString(),
          qualification: this.addSpeakerCodeCreationForm.get('qualification').value.toString(),
          speaker_Type: this.addSpeakerCodeCreationForm.get('goNgoAgo').value.toString(),
          address: this.addSpeakerCodeCreationForm.get('address').value.toString(),
          city: this.addSpeakerCodeCreationForm.get('city').value.toString(),
          state: this.addSpeakerCodeCreationForm.get('state').value.toString(),
          country: this.addSpeakerCodeCreationForm.get('country').value.toString(),
          speaker_Criteria: this.addSpeakerCodeCreationForm.get('speakerCriteriaSelectionId').value.toString(),
          speaker_Criteria_Details: speakerCriteriaDetailsValue.join(","),
          speaker_Category: this.addSpeakerCodeCreationForm.get('speakerCategory').value.toString(),
          contact_Number: this.addSpeakerCodeCreationForm.get('contactNumber').value.toString(),
          InitiatorNameName: roleDetails.unique_name || ' ',
          InitiatorEmail: roleDetails.email || ' ',    
          salesHead: roleDetails.SalesHead,
          medicalAffairsHead: roleDetails.MarketingHead || ' ',  
        };
        console.log(`payload`, payload);

        this._moduleService.addSpeakerCodeCreationDetails(payload)
          .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
          .subscribe(res => {
            // console.log(`Response`, res);

            this.loadingIndicator = false;
            if(res) {
              this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_SPEAKERCODE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
              this._router.navigate(['/master-list']);
              //this.addSpeakerCodeCreationForm.reset();
            } else {
              this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.ADD_SPEAKERCODE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
            }
          },(error)=>{

              this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.ADD_SPEAKERCODE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
              this.loadingIndicator = false;
              console.log(error);

          });
 
     }
     
   }

    isHPCUserExist(): boolean {
      const { hcpName, misCode } = this.addSpeakerCodeCreationForm.value;

      //console.log(hcpName.trim(),misCode.trim());
      // Check if both hcpName and misCode are not blank
      if(hcpName.trim() !== '' && misCode.trim() !== '')
      {
        return false;
      }
      return false;
    }
    isSpeakerMISCodeNA(): boolean 
    {
      let { misCode } = this.addSpeakerCodeCreationForm.value;
      misCode = misCode.toString();
      //console.log(misCode);
      if(misCode.trim() !== '' && misCode.trim() !== 'N/A' && misCode.trim() !== 'n/a')
      {
        return true;
      }
      return false;
    }
    isSpeakerCategoryEnable(): boolean {
      return false;
    }

    isCriteriaOptionMatch(v): boolean {
      const { speakerCriteriaSelectionId } = this.addSpeakerCodeCreationForm.value;
      if(speakerCriteriaSelectionId && speakerCriteriaSelectionId == v)
      {
        return true;
      }
      else
      {
        return false;
      }
    }    


    createNewHCPUser() {
      const { hcpName, misCode } = this.addSpeakerCodeCreationForm.value;

      // Add logic here to handle the creation of a new HCP User
      console.log('Creating new HCP User:', hcpName, misCode);
      
      // You can add more complex logic or call a service to handle user creation
    }
    findSpeakerById(speakerId: number): any {
      //return this.speakers.find(speaker => speaker.SpeakerId === speakerId);
    }
    onSpeakerCriteriaSelected(selectedSpeakerCriteria): void{
      this.addSpeakerCodeCreationForm.patchValue({
        speakerCategory:this._moduleService.getSpeakerCategoryFromCriteria(selectedSpeakerCriteria)
      });
    }
    updateSpeakerInfo(selectedSpeakerId): void{
      //const { speakerId } = this.addSpeakerCodeCreationForm.value;
        const selectedSpeaker = this.findSpeakerById(selectedSpeakerId);

        if (selectedSpeaker) {
          this.addSpeakerCodeCreationForm.patchValue({
            //speakerName: selectedSpeaker.SpeakerName,       
              speciality : selectedSpeaker.Speciality,
             qualification : selectedSpeaker.Qualification,
             //goNgoAgo : selectedSpeaker.,
             country : selectedSpeaker.Country,
             address : selectedSpeaker.Address,
             city : selectedSpeaker.CityId,
             state : selectedSpeaker.StateId,
             //panCard : selectedSpeaker.,
             //contactNumber : selectedSpeaker.,
             speakerCode : selectedSpeaker.SpeakerCode
          });
        } else {
          this.addSpeakerCodeCreationForm.patchValue({
            //speakerName: '',       
              speciality : '',
              qualification : '',
             //goNgoAgo : '',
             country : '',
             address : '',
             city : '',
             state : '',
             //panCard : '',
             //contactNumber : '',
             speakerCode : ''
          });
        }
    }

  public onSpeakerCriteriaSelectionIdChange(event)
  {
      console.log('onSpeakerCriteriaSelectionIdChange',event.value);
      if(event.value=='Tier I Criteria')
      {
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIIIOptions1").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions1").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions2").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions3").setValue(false);
      }
      else if(event.value=='Tier II Criteria')
      {
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIIIOptions1").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions1").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions2").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions3").setValue(false);
      }
      else if(event.value=='Tier III Criteria')
      {
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions1").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions2").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions3").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions1").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions2").setValue(false);
            this.addSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions3").setValue(false);
      }      
/*      if(event.value=='Tier I Criteria')
      {
          this.uncheckSpeakerCriteria('Speaks/chairs sessions at national conferences');
          this.uncheckSpeakerCriteria('Publishes regularly in leading clinical or scientific journals');
          this.uncheckSpeakerCriteria('Duly qualified and practices as a specialist in their respective area of specialization');
          this.uncheckSpeakerCriteria('Recognized by peers/ other specialists as an expert within his/her field');
      }
      else if(event.value=='Tier II Criteria')
      {
          this.uncheckSpeakerCriteria('Speaks/chairs sessions at international conferences');
          this.uncheckSpeakerCriteria('Duly qualified and practices as a specialist in their respective area of specialization with > 12 years of experience');
          this.uncheckSpeakerCriteria('Author/editor of leading textbooks or publishes in leading clinical peer-reviewed journals');
          this.uncheckSpeakerCriteria('Recognized by peers/ other specialists as an expert within his/her field');
      }
      else if(event.value=='Tier III Criteria')
      {
          this.uncheckSpeakerCriteria('Speaks/chairs sessions at international conferences');
          this.uncheckSpeakerCriteria('Duly qualified and practices as a specialist in their respective area of specialization with > 12 years of experience');
          this.uncheckSpeakerCriteria('Author/editor of leading textbooks or publishes in leading clinical peer-reviewed journals');
          this.uncheckSpeakerCriteria('Speaks/chairs sessions at national conferences');
          this.uncheckSpeakerCriteria('Publishes regularly in leading clinical or scientific journals');
          this.uncheckSpeakerCriteria('Duly qualified and practices as a specialist in their respective area of specialization');
      }*/
  }  


  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }  

  public validateMisCode():void{
    if(this.addSpeakerCodeCreationForm.get("misCode").value!='' && this.addSpeakerCodeCreationForm.get("misCode").value!='N/A' && this.addSpeakerCodeCreationForm.get("misCode").value!='n/a')
    {
      this.loadingIndicator=true;
      console.log(this.addSpeakerCodeCreationForm.get("misCode").value);

      this.addSpeakerCodeCreationForm.get("country").setValue('India');
      this._utilityService.getRowDataUsingMISCodeandType(this.addSpeakerCodeCreationForm.get("misCode").value,'Speaker').subscribe(
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
              this.addSpeakerCodeCreationForm.get("speakerName").setValue(hpc[0]['HCPName']);
              this.addSpeakerCodeCreationForm.get("goNgoAgo").setValue(hpc[0]['HcpType']);
              this.addSpeakerCodeCreationForm.get("address").setValue(hpc[0]['Company Name']);
              if(this.addSpeakerCodeCreationForm.get("speakerName").value)
              {
                this.addSpeakerCodeCreationForm.get("speakerName").disable();
              }
              if(this.addSpeakerCodeCreationForm.get("address").value)
              {
                this.addSpeakerCodeCreationForm.get("address").disable();
              }
              if(this.addSpeakerCodeCreationForm.get("goNgoAgo").value)
              {
                this.addSpeakerCodeCreationForm.get("goNgoAgo").disable();
              }
          }
          else
          {            
            this.addSpeakerCodeCreationForm.get("speakerName").enable();
            this.addSpeakerCodeCreationForm.get("address").enable();
            this.addSpeakerCodeCreationForm.get("goNgoAgo").enable();
          }
          this.loadingIndicator=false;
        },
        (error) => {
          console.error('Error loading hpc:', error);
          this.loadingIndicator=false;
          this.addSpeakerCodeCreationForm.get("speakerName").enable();
          this.addSpeakerCodeCreationForm.get("address").enable();
          this.addSpeakerCodeCreationForm.get("goNgoAgo").enable();
        }
      );      
    }
    else
    {            
      this.addSpeakerCodeCreationForm.get("speakerName").enable();
      this.addSpeakerCodeCreationForm.get("address").enable();
      this.addSpeakerCodeCreationForm.get("goNgoAgo").enable();
    }   
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


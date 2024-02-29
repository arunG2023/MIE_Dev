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
import { ValidatorFn} from '@angular/forms';
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
  selector: 'edit-edit-speaker',
  templateUrl: './edit-speaker.component.html',
  styleUrls: ['./edit-speaker.component.css']
})
export class EditSpeakerComponent implements OnInit {



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
   editSpeakerCodeCreationForm : FormGroup;

   
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  _filteredMISCodes: Observable<string[]>;
  _filteredSpeakerNames: Observable<string[]>;



   constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _http : HttpClient,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _moduleService: ModuleService,
    private _router: Router,
    private auth: AuthService,
    public dialogRef: MatDialogRef<EditSpeakerComponent>
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




    console.log(this.data);
    let data = this.data;
     this.editSpeakerCodeCreationForm = this._formBuilder.group({
      //  misCode : new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z0-9]*')]),
       SpeakerId : new FormControl((data.SpeakerId?data.SpeakerId:'')),
       misCode : new FormControl((data.MisCode?data.MisCode:''), Validators.required),
       speakerName : new FormControl((data.SpeakerName?data.SpeakerName:''), Validators.required),
       speakerCode : new FormControl((data['Speaker Code']?data['Speaker Code']:'')),
       speakerCategory : new FormControl((data['Speaker Category']?data['Speaker Category']:'')),
       speciality : new FormControl((data['Speciality']?data['Speciality']:''), Validators.required),
       goNgoAgo : new FormControl((data['Speaker Type']?data['Speaker Type']:''), Validators.required),
       divisionId : new FormControl((data['Division']?data['Division']:''), Validators.required),
       qualification : new FormControl((data['Qualification']?data['Qualification']:''), Validators.required),
       country : new FormControl((data['Country']?data['Country']:''), Validators.required),
       address : new FormControl((data['Address']?data['Address']:''), Validators.required),
       city : new FormControl((data['City']?data['City']:'')),
       state : new FormControl((data['State']?data['State']:'')),
       contactNumber : new FormControl((data['Contact Number']?data['Contact Number']:''), Validators.required),
       speakerCriteriaSelectionId : new FormControl((data['Speaker Criteria']?data['Speaker Criteria']:''), Validators.required),
       
       speakerCriteriasTireIOptions1 :new FormControl(),
       speakerCriteriasTireIOptions2 :new FormControl(),
       speakerCriteriasTireIOptions3 :new FormControl(),
       speakerCriteriasTireIIOptions1 : new FormControl(),
       speakerCriteriasTireIIOptions2 : new FormControl(),
       speakerCriteriasTireIIOptions3 : new FormControl(),
       speakerCriteriasTireIIIOptions1 : new FormControl(),
     }, { validator: tierICriteriaValidator });

      let speakerCriteriaSelectionIdValue=(data['Speaker Criteria']?data['Speaker Criteria']:'');
      let speakerCriteriaDetails=(data['Speaker Criteria Details']?data['Speaker Criteria Details']:'').toLowerCase();

      if(speakerCriteriaSelectionIdValue=='Tier I Criteria')
      {
          if(speakerCriteriaDetails.includes("speaks/chairs sessions at international conferences"))
          {
              this.editSpeakerCodeCreationForm.patchValue({speakerCriteriasTireIOptions1:true});
          }
          if(speakerCriteriaDetails.includes("duly qualified and practices as a specialist in their respective area of specialization with > 12 years of experience"))
          {
              this.editSpeakerCodeCreationForm.patchValue({speakerCriteriasTireIOptions2:true});
          }
          if(speakerCriteriaDetails.includes("author/editor of leading textbooks or publishes in leading clinical peer-reviewed journals"))
          {
              this.editSpeakerCodeCreationForm.patchValue({speakerCriteriasTireIOptions3:true});
          }
      }
      else if(speakerCriteriaSelectionIdValue=='Tier II Criteria')
      {
          if(speakerCriteriaDetails.includes("speaks/chairs sessions at national conferences"))
          {
              this.editSpeakerCodeCreationForm.patchValue({speakerCriteriasTireIIOptions1:true});
          }
          if(speakerCriteriaDetails.includes("publishes regularly in leading clinical or scientific journals"))
          {
              this.editSpeakerCodeCreationForm.patchValue({speakerCriteriasTireIIOptions2:true});
          }
          if(speakerCriteriaDetails.includes("duly qualified and practices as a specialist in their respective area of specialization"))
          {
              this.editSpeakerCodeCreationForm.patchValue({speakerCriteriasTireIIOptions3:true});
          }
      }
      else if(speakerCriteriaSelectionIdValue=='Tier III Criteria')
      {
          if(speakerCriteriaDetails.includes("recognized by peers/ other specialists as an expert within his/her field"))
          {
            this.editSpeakerCodeCreationForm.patchValue({speakerCriteriasTireIIIOptions1:true});
          }
      }


      this.speakerTypes = this._moduleService.getSpeakerTypesData();

      this.countries = this._moduleService.getCountriesData();


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
        this._filteredMISCodes = this.editSpeakerCodeCreationForm.get('misCode').valueChanges.pipe(
          startWith(''),
          map((value) => this._filterMISCodes(value))
        );

        this.editSpeakerCodeCreationForm.get('city').valueChanges.subscribe((city) => {
          this._filterStates(city);
        }); 
/*
        // Initialize the autocomplete for SpeakerNames
        this._filteredSpeakerNames = this.editSpeakerCodeCreationForm.get('speakerName').valueChanges.pipe(
          startWith(''),
          map((value) => this._filterSpeakerNames(value))
        );
*/

      this.editSpeakerCodeCreationForm.get('speakerCriteriaSelectionId').valueChanges.subscribe((speakerCriteriaSelectionId) => {
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
        this.divisions = res;
      })
  }
  private _getAllStates() {
    this._utilityService.getAllStates()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.statesMaster = res
        this._filterStates("");
      })
  }
  private _getAllCities() {
    this._utilityService.getAllCities()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.cities = res;

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
   
  }

  // Event handler for the optionSelected event of mat-autocomplete
  onSpeakerNameSelected(event: any) {
   
  }

  findSpeakerByMISCode(misCode: string): any {
    return this.speakers.find((speaker) => speaker.MISCode === misCode);
  }

  findSpeakerBySpeakerName(speakerName: string): any {
    return this.speakers.find((speaker) => `${speaker.SpeakerName} (${speaker.MISCode})` === speakerName);
  }

  speakerSelectionFormPrePopulate():void{
     /*   this.editSpeakerCodeCreationForm.valueChanges.subscribe(
          changes => {
            console.log("changes",changes);
       });
      this.editSpeakerCodeCreationForm.get('speakerId').valueChanges.subscribe((selectedSpeakerId) => {
        this.updateSpeakerInfo(selectedSpeakerId);
      });*/
  }
   //  Method to handle form submission
   submit(){
      if (this.editSpeakerCodeCreationForm.invalid) {
        const errors = this.collectErrors(this.editSpeakerCodeCreationForm);
        this.openErrorDialog(errors);
        return;
      }      
     if(this.editSpeakerCodeCreationForm.valid){

       let roleDetails = this.auth.decodeToken();
       this.loadingIndicator = true;
       var speakerNameToSubmit = '';
       if(this.speakerNameSelected=='')
       {
         speakerNameToSubmit = this.editSpeakerCodeCreationForm.get('speakerName').value;
       }
       else 
       {
          speakerNameToSubmit = this.speakerNameSelected;
       }

       let speakerCriteriaDetailsValue = [];
       var speakerCriteriaSelectionIdValue = this.editSpeakerCodeCreationForm.get('speakerCriteriaSelectionId').value;
        if(speakerCriteriaSelectionIdValue=='Tier I Criteria')
        {
            if(this.editSpeakerCodeCreationForm.get('speakerCriteriasTireIOptions1').value)
            {
                speakerCriteriaDetailsValue.push("Speaks/chairs sessions at international conferences");
            }
            if(this.editSpeakerCodeCreationForm.get('speakerCriteriasTireIOptions2').value)
            {
                speakerCriteriaDetailsValue.push("Duly qualified and practices as a specialist in their respective area of specialization with > 12 years of experience");
            }
            if(this.editSpeakerCodeCreationForm.get('speakerCriteriasTireIOptions3').value)
            {
                speakerCriteriaDetailsValue.push("Author/editor of leading textbooks or publishes in leading clinical peer-reviewed journals");
            }
        }
        else if(speakerCriteriaSelectionIdValue=='Tier II Criteria')
        {
            if(this.editSpeakerCodeCreationForm.get('speakerCriteriasTireIIOptions1').value)
            {
                speakerCriteriaDetailsValue.push("Speaks/chairs sessions at national conferences");
            }
            if(this.editSpeakerCodeCreationForm.get('speakerCriteriasTireIIOptions2').value)
            {
                speakerCriteriaDetailsValue.push("Publishes regularly in leading clinical or scientific journals");
            }
            if(this.editSpeakerCodeCreationForm.get('speakerCriteriasTireIIOptions3').value)
            {
                speakerCriteriaDetailsValue.push("Duly qualified and practices as a specialist in their respective area of specialization");
            }
        }
        else if(speakerCriteriaSelectionIdValue=='Tier III Criteria')
        {
            if(this.editSpeakerCodeCreationForm.get('speakerCriteriasTireIIIOptions1').value)
            {
              speakerCriteriaDetailsValue.push("Recognized by peers/ other specialists as an expert within his/her field");
            }
        }       

        var speakerCode = this.editSpeakerCodeCreationForm.get('speakerCode').value.toString();
        const payload = {
          SpeakerId: this.editSpeakerCodeCreationForm.get('SpeakerId').value.toString(),
          InitiatorNameName: roleDetails.unique_name || ' ',
          InitiatorEmail: roleDetails.email || ' ',    
          salesHead: roleDetails.SalesHead,
          medicalAffairsHead: roleDetails.MarketingHead || ' ', 
          speakerName: this.editSpeakerCodeCreationForm.get('speakerName').value.toString(),
          speakerCode: (speakerCode?speakerCode:""),
          misCode: this.editSpeakerCodeCreationForm.get('misCode').value.toString(),
          division: this.editSpeakerCodeCreationForm.get('divisionId').value.toString(),
          speciality: this.editSpeakerCodeCreationForm.get('speciality').value.toString(),
          qualification: this.editSpeakerCodeCreationForm.get('qualification').value.toString(),
          address: this.editSpeakerCodeCreationForm.get('address').value.toString(),
          city: this.editSpeakerCodeCreationForm.get('city').value.toString(),
          state: this.editSpeakerCodeCreationForm.get('state').value.toString(),
          country: this.editSpeakerCodeCreationForm.get('country').value.toString(),
          contact_Number: this.editSpeakerCodeCreationForm.get('contactNumber').value.toString(), 
          speaker_Category: this.editSpeakerCodeCreationForm.get('speakerCategory').value.toString(),
          speaker_Type: this.editSpeakerCodeCreationForm.get('goNgoAgo').value.toString(),
          speaker_Criteria: this.editSpeakerCodeCreationForm.get('speakerCriteriaSelectionId').value.toString(),
          speaker_Criteria_Details: speakerCriteriaDetailsValue.join(","),
        };
        console.log(`payload`, payload);

        ///api/SpeakerCodeCreation/UpdateSpeakerDatausingSpeakerId
        this._moduleService.updateSpeakerDataUsingSpeakerId(payload)
          .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
          .subscribe(res => {
            // console.log(`Response`, res);

            this.loadingIndicator = false;
            if(res) {
              this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.ADD_SPEAKERCODE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
              this.dialogRef.close();
              this._router.navigate(['/master-list']);
              //this.editSpeakerCodeCreationForm.reset();
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
      const { hcpName, misCode } = this.editSpeakerCodeCreationForm.value;

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
      let { misCode } = this.editSpeakerCodeCreationForm.value;
      misCode=(misCode?misCode:"").toString();
      if(misCode.trim() !== '' && misCode.trim() !== 'N/A')
      {
        return true;
      }
      return false;
    }
    isSpeakerCategoryEnable(): boolean {
      return false;
    }

    isCriteriaOptionMatch(v): boolean {
      const { speakerCriteriaSelectionId } = this.editSpeakerCodeCreationForm.value;
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
      const { hcpName, misCode } = this.editSpeakerCodeCreationForm.value;

      // Add logic here to handle the creation of a new HCP User
      console.log('Creating new HCP User:', hcpName, misCode);
      
      // You can add more complex logic or call a service to handle user creation
    }
    findSpeakerById(speakerId: number): any {
      //return this.speakers.find(speaker => speaker.SpeakerId === speakerId);
    }
    onSpeakerCriteriaSelected(selectedSpeakerCriteria): void{
      this.editSpeakerCodeCreationForm.patchValue({
        speakerCategory:this._moduleService.getSpeakerCategoryFromCriteria(selectedSpeakerCriteria)
      });
    }
    updateSpeakerInfo(selectedSpeakerId): void{
      //const { speakerId } = this.editSpeakerCodeCreationForm.value;
        const selectedSpeaker = this.findSpeakerById(selectedSpeakerId);

        if (selectedSpeaker) {
          this.editSpeakerCodeCreationForm.patchValue({
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
          this.editSpeakerCodeCreationForm.patchValue({
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
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIIIOptions1").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions1").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions2").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions3").setValue(false);
      }
      else if(event.value=='Tier II Criteria')
      {
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIIIOptions1").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions1").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions2").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions3").setValue(false);
      }
      else if(event.value=='Tier III Criteria')
      {
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions1").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions2").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIOptions3").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions1").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions2").setValue(false);
            this.editSpeakerCodeCreationForm.get("speakerCriteriasTireIIOptions3").setValue(false);
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

    let data = this.data;
    if(this.editSpeakerCodeCreationForm.get("misCode").value!='' && 
        this.editSpeakerCodeCreationForm.get("misCode").value!=data.MisCode && 
        this.editSpeakerCodeCreationForm.get("misCode").value!='N/A' && 
        this.editSpeakerCodeCreationForm.get("misCode").value!='n/a'
      )
    {    
      this.loadingIndicator=true;
      console.log(this.editSpeakerCodeCreationForm.get("misCode").value);

      this._utilityService.getRowDataUsingMISCodeandType(this.editSpeakerCodeCreationForm.get("misCode").value,'Speaker').subscribe(
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
              this.editSpeakerCodeCreationForm.get("speakerName").setValue(hpc[0]['HCPName']);
              this.editSpeakerCodeCreationForm.get("goNgoAgo").setValue(hpc[0]['HcpType']);
              this.editSpeakerCodeCreationForm.get("address").setValue(hpc[0]['Company Name']);
              if(this.editSpeakerCodeCreationForm.get("speakerName").value)
              {
                this.editSpeakerCodeCreationForm.get("speakerName").disable();
              }
              if(this.editSpeakerCodeCreationForm.get("address").value)
              {
                this.editSpeakerCodeCreationForm.get("address").disable();
              }
              if(this.editSpeakerCodeCreationForm.get("goNgoAgo").value)
              {
                this.editSpeakerCodeCreationForm.get("goNgoAgo").disable();
              }
          }
          else
          {            
            this.editSpeakerCodeCreationForm.get("speakerName").enable();
            this.editSpeakerCodeCreationForm.get("address").enable();
            this.editSpeakerCodeCreationForm.get("goNgoAgo").enable();
          }
          this.loadingIndicator=false;
        },
        (error) => {
          console.error('Error loading hpc:', error);
          this.loadingIndicator=false;
          this.editSpeakerCodeCreationForm.get("speakerName").enable();
          this.editSpeakerCodeCreationForm.get("address").enable();
          this.editSpeakerCodeCreationForm.get("goNgoAgo").enable();
        }
      );      
    }
    else
    {            
      this.editSpeakerCodeCreationForm.get("speakerName").enable();
      this.editSpeakerCodeCreationForm.get("address").enable();
      this.editSpeakerCodeCreationForm.get("goNgoAgo").enable();
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


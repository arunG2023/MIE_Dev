import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '../../services/event-utility/utility-service.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Config } from '../../config/common-config';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/utility/modal/modal.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth/auth.service';
import { ModuleService } from '../../services/event-utility/module.service';

@Component({
  selector: 'app-panel-selection',
  templateUrl: './panel-selection.component.html',
  styleUrls: ['./panel-selection.component.css']
})
export class PanelSelectionComponent implements OnInit {
  // Spinner
  public loadingIndicator: boolean = false;
  private _isHcpMasterLoaded: boolean = false;

  // Observable
  private _ngUnSubscribe: Subject<void> = new Subject<void>();


  // Form Groups
  public hcpRoleSelectionForm: FormGroup;
  public speakerForm: FormGroup;
  public internationalHcpForm: FormGroup;
  public rationaleForm: FormGroup;
  public fcpaForm: FormGroup;
  public honorariumForm: FormGroup;
  public internationalHonorariumForm: FormGroup;
  public travelForm: FormGroup;
  public accomodationForm: FormGroup;
  public localConveyanceForm: FormGroup;
  public benificiaryForm: FormGroup;
  public internationalBenificiaryForm: FormGroup;
  public trainerForm: FormGroup;
  public otherForm: FormGroup;

  // Data From Sheet
  public hcpRoleTypes: any;
  public approvedSpeakersFromSheet: any;
  public vendorDetailsFromSheet: any;
  public approvedTrainersFromSheet: any;
  public otherPanelistsFromSheet: any;

  // Speaker Details
  speakerMisCode: string;
  filteredSpeakersForMatAutoComplete: any[] = [];

  // Show Hide Functionalities
  public showSpeakerForm: boolean = false;
  public showMisCode: boolean = false
  public showInternationHcpForm: boolean = false;
  public showRationaleForm: boolean = false;
  public showFcpaForm: boolean = false;
  public showFcpaDownloadLink: boolean = false;
  public fcpaDownloadLink: string;

  public showHonorariumForm: boolean = false;
  public showInternationalHonorariumForm: boolean = false;

  public showTravelForm: boolean = false;
  public showAccomodationForm: boolean = false;
  public showLocalConveyanceForm: boolean = false;

  public showAddSpeakerButton: boolean = false;

  // Remuneration Calculation:
  private _remunerationToCalculate: any;
  private _aggregateLimit: number = 1000;  // Set as 1000 because of testing
  private _honorariumSpendLimit: number = 0;

  public showHonorariumDeviation: boolean = false;

  // Honorarium
  isHonorarium: string = 'No';
  totalHours: number = 0;

  // ngModel
  expenseType: string = '';

  // File Handling
  private _allowedTypes: string[];
  public allowedTypesForHTML: string;

  private _nocFile: string;
  private _fcpaFile: string;
  private _panCardFile: string;
  private _chequeFile: string;
  private _taxResidenceFile: string;
  private _brocchureFile: string;
  public aggregateDeviationFile: string;
  private _internationalSpeakerAgreementFile: string;
  private _honorariumDeviationFile: string;

  private _deviationFiles: string[] = [];
  private _otherFiles: string[] = [];

  public hcpTableDetails: any[] = [];

  // FCPA Date Validation
  private _fcpaToday: Date = new Date();
  private _lastFcpaDate: Date = new Date(this._fcpaToday.getFullYear() - 1, this._fcpaToday.getMonth(), this._fcpaToday.getDate());
  private _futureFcpaDate: Date = new Date(this._fcpaToday.getFullYear() + 1, this._fcpaToday.getMonth(), this._fcpaToday.getDate());

  public minDate = this._lastFcpaDate.toISOString().split('T')[0];
  public maxDate = this._fcpaToday.toISOString().split('T')[0];

  // Summary
  BTCSummaryTable: any[] = [];
  BTESummaryTable: any[] = [];
  BTCTotalAmount: number = 0;
  BTETotalAmount: number = 0;
  totalPanelAmount: number = 0;
  eachHCPTotalAmount: number = 0;

  benificiaryName: string;
  internationalBenficiaryName: string;
  filteredVendorsForMatAutoComplete: any[] = [];
  showVendorAddButton: boolean = false;
  showCurrencyTextBox: boolean = false;
  showInternationalCurrencyTextBox: boolean = false;
  showExpenseAggregateDeviation: boolean = false;


  private _noData: string = " ";

  public filteredSpeakerNameForMatOption: any;

  public isInternationalSpeaker: boolean = false;

  public showBenificiaryForm: boolean = false;
  public showInternationalBenificiaryForm: boolean = false;

  // Trainer
  public showTrainerForm: boolean = false;
  public trainerMisCode: string = '';
  filteredTrainersForMatAutoComplete: any[] = [];
  public showTrainerAddButton: boolean = false;

  // Other
  public showOtherForm: boolean = false;
  public OtherMisCode: string = '';
  filteredOthersForMatAutoComplete: any[] = [];
  public showOtherAddButton: boolean = false;
  public otherRole: string;
  public otherName: string;

  public aggregateDeviationForm: FormGroup;

  // Vendor Update
  private _selectedVendor: any;

  public showHonorariumAmountError: boolean = false;
  public showLCAmountError: boolean = false;
  public showAccomAmountError: boolean = false;
  public showTravelAmountError: boolean = false;



  constructor(
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private _authService: AuthService,
    private _moduleService: ModuleService
  ) { }

  ngOnInit(): void {
    this._loadOthersDetails();
    this._loadHcpRoleTypeData();
    this._loadApprovedSpeakers();
    this._loadVendorDetails();
    this._loadTrainerDetails();

    this.hcpRoleSelectionForm = new FormGroup({
      hcpRole: new FormControl('', Validators.required)
    })

    this.aggregateDeviationForm = new FormGroup({
      aggregateDeviationUpload: new FormControl('', Validators.required)
    })



    this.speakerForm = new FormGroup({
      // speakerMisCode: new FormControl('', Validators.required),
      speakerName: new FormControl({ value: '', disabled: true },),
      speakerCode: new FormControl({ value: '', disabled: true },),
      speakerType: new FormControl({ value: '', disabled: true },),
      speakerSpeciality: new FormControl({ value: '', disabled: true },),
      speakerTier: new FormControl({ value: '', disabled: true },),
      speakerCountry: new FormControl({ value: '', disabled: true },),
      speakerQualification: new FormControl({ value: '', disabled: true },)
    });

    this.trainerForm = new FormGroup({
      // speakerMisCode: new FormControl('', Validators.required),
      trainerName: new FormControl({ value: '', disabled: true },),
      trainerCode: new FormControl({ value: '', disabled: true },),
      trainerType: new FormControl({ value: '', disabled: true },),
      trainerSpeciality: new FormControl({ value: '', disabled: true },),
      trainerTier: new FormControl({ value: '', disabled: true },),
      trainerCountry: new FormControl({ value: '', disabled: true },),
      trainerQualification: new FormControl({ value: '', disabled: true },)
    })

    this.otherForm = new FormGroup({
      // speakerMisCode: new FormControl('', Validators.required),
      otherName: new FormControl({ value: '', disabled: true },),
      otherCode: new FormControl({ value: '', disabled: true },),
      otherType: new FormControl({ value: '', disabled: true },),
      otherSpeciality: new FormControl({ value: '', disabled: true },),
      otherTier: new FormControl({ value: '', disabled: true },),
      otherCountry: new FormControl({ value: '', disabled: true },),
      otherQualification: new FormControl({ value: '', disabled: true },)
    })

    this.internationalHcpForm = new FormGroup({
      internationalHcpName: new FormControl('', Validators.required),
      internationalHcpCountry: new FormControl('', Validators.required),
      internationalHcpCode: new FormControl({ value: '', disabled: true },),
      internationalHcpSpeciality: new FormControl({ value: '', disabled: true },),
      internationalHcpTier: new FormControl({ value: '', disabled: true },),
      internationalHcpType: new FormControl({ value: '', disabled: true },),
      uploadBrochure: new FormControl('', Validators.required)
    })

    this.rationaleForm = new FormGroup({
      rationaleText: new FormControl('', Validators.required),
      nocUpload: new FormControl('', Validators.required)
    })

    this.fcpaForm = new FormGroup({
      fcpaDate: new FormControl('', Validators.required),
      fcpaUpload: new FormControl('', Validators.required),
    })

    this.honorariumForm = new FormGroup({
      presentationDuration: new FormControl(0, [Validators.required]),
      panelSessionPreparation: new FormControl(0, [Validators.required]),
      qaSession: new FormControl(0, [Validators.required]),
      honorariumAmountIncludingTax: new FormControl(0,),
      honorariumAmountExcludingTax: new FormControl({ value: 0, disabled: false },),
      briefingDuration: new FormControl(0, [Validators.required]),
      panelDiscussionDuration: new FormControl(0, [Validators.required]),
      honorariumDeviationUpload: new FormControl(''),
      globalFmvCheck: new FormControl(''),
      internationalSpeakerDocument: new FormControl(''),
    })

    this.internationalHonorariumForm = new FormGroup({
      internationHonorariumAmountIncludingTax: new FormControl(0,),
      internationHonorariumAmountExcludingTax: new FormControl(0)
    })

    this.travelForm = new FormGroup({
      travelType: new FormControl(''),
      travelAmountwithoutTax: new FormControl(0),
      travelAmountwithTax: new FormControl(0),
      travelBTC: new FormControl('', Validators.required),
    });

    this.accomodationForm = new FormGroup({
      accomBTC: new FormControl('', Validators.required),
      accomAmountWithoutTax: new FormControl(0),
      accomAmountWithTax: new FormControl(0)
    });

    this.localConveyanceForm = new FormGroup({
      localBTC: new FormControl('', Validators.required),
      localAmountWithoutTax: new FormControl(0),
      localAmountWithTax: new FormControl(0)
    })

    // Benificiary Form Control 
    this.benificiaryForm = new FormGroup({
      currencyType: new FormControl('', Validators.required),
      otherCurrencyType: new FormControl(''),
      // taxSelection: new FormControl('', Validators.required),
      // benificiaryName: new FormControl(''),
      bankAccountNumber: new FormControl({ value: '', disabled: false }, Validators.required),
      bankName: new FormControl({ value: '', disabled: false }, Validators.required),
      nameAsPerPAN: new FormControl({ value: '', disabled: false }, Validators.required),
      panCardNumber: new FormControl({ value: '', disabled: false }, Validators.required),
      ifscCode: new FormControl({ value: '', disabled: false }, Validators.required),
      uploadPAN: new FormControl('',),
      emailId: new FormControl(''),
      uploadCheque: new FormControl('',),
      // totalAmountForEachHcp: new FormControl({ value: '', disabled: true })
    })

    this.internationalBenificiaryForm = new FormGroup({
      currencyTypeForInternational: new FormControl('', Validators.required),
      otherCurrencyTypeForInternational: new FormControl('',),
      // benificiaryNameForInternational: new FormControl(''),
      bankAccountNameForInternational: new FormControl('', Validators.required),
      bankAccountNumberForInternational: new FormControl('', Validators.required),
      swiftCode: new FormControl({ value: '', disabled: false }, Validators.required),
      ibnNumber: new FormControl({ value: '', disabled: false }, Validators.required),
      emailIdForInternational: new FormControl({ value: '', disabled: false }),
      uploadTaxResidenceCertificate: new FormControl('',),
      taxResidenceCertificateDate: new FormControl('', Validators.required),
      // totalAmountForEachHCPInternational: new FormControl({value:'',disabled:true})
    })

    // Getting allowed file types
    this._allowedTypes = Config.FILE.ALLOWED;

    // Generating Allowed types for HTML
    this._allowedTypes.forEach(type => {
      this.allowedTypesForHTML += '.' + type + ', '
    })

    this._honorariumTotalHoursCalculate();
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }

  // Methods to load sheet data
  private _loadOthersDetails() {
    this._isHcpMasterLoaded = false;
    this._utilityService.getEmployeesFromHCPMaster()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this._isHcpMasterLoaded = true;
        this.loadingIndicator = false;
        this.otherPanelistsFromSheet = res;
        this.otherPanelistsFromSheet.splice(1000,);
        // console.log(this.otherPanelistsFromSheet)
      }

      )
  }

  private _loadHcpRoleTypeData() {
    this._utilityService.getHcpRoles()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.hcpRoleTypes = res;
      })
  }

  private _loadApprovedSpeakers() {
    this._utilityService.getApprovedSpeakers()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.approvedSpeakersFromSheet = res;
      })
  }

  private _loadVendorDetails() {
    this._utilityService.getVendorDetails()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => this.vendorDetailsFromSheet = res)
  }

  private _loadTrainerDetails() {
    this._utilityService.getApprovedTrainers()
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        this.approvedTrainersFromSheet = res;
        // console.log(this.approvedTrainersFromSheet)
      })
  }

  public onHcpTypeSelect(value: string) {
    this.showAccomAmountError = false;
    this.showLCAmountError = false;
    this.showTravelAmountError = false;
    this.showHonorariumAmountError = false;
    // console.log(value)
    this.showMisCode = true;
    this.showRationaleForm = false;
    this.showFcpaDownloadLink = false;
    this.showFcpaForm = false;

    this.speakerForm.reset();
    this.trainerForm.reset();
    this.otherForm.reset();
    this.rationaleForm.reset();
    this.fcpaForm.reset();

    if (value == 'Speaker') {
      this.showSpeakerForm = true;
      this.showTrainerForm = false;
      this.showOtherForm = false;
    }
    else if (value == 'Trainer') {
      this.showTrainerForm = true;
      this.showSpeakerForm = false;
      this.showOtherForm = false;
    }
    else if (value == 'Others') {
      if (!this._isHcpMasterLoaded) {
        this.loadingIndicator = true;
      }
      else {
        this.loadingIndicator = false;
      }
      this.showOtherForm = true;
      this.showTrainerForm = false;
      this.showSpeakerForm = false;
    }
    else {
      this.showSpeakerForm = false;
      this.showTrainerForm = false;
      this.showOtherForm = false;
    }
    // console.log(this.hcpRoleSelectionForm.value.hcpRole)
  }

  private _filteredInternationalSpeakers: any;

  public onSpeakerMisCodeChange(value: string) {
    // console.log(this._filterSpeakerByMisCode(value))
    this.filteredSpeakersForMatAutoComplete = [];
    this.speakerForm.controls.speakerName.disable();
    this.isHonorarium = 'No';
    this.expenseType = '';
    this.showLocalConveyanceForm = false;
    this.showAccomodationForm = false;
    this.showTravelForm = false;
    this.showHonorariumForm = false;
    this.showInternationalBenificiaryForm = false;
    this.showBenificiaryForm = false;


    this.filteredSpeakersForMatAutoComplete = this._filterSpeakerByMisCode(value);
    // console.log(this.filteredSpeakersForMatAutoComplete)
    if (this.filteredSpeakersForMatAutoComplete.length == 1) {
      console.log('this.filteredSpeakersForMatAutoComplete', this.filteredSpeakersForMatAutoComplete)

      let filteredSpeaker = this.filteredSpeakersForMatAutoComplete[0];

      this.speakerForm.controls.speakerName.setValue(filteredSpeaker.SpeakerName);
      this._prePopulateSpeakerValues(filteredSpeaker);

      this._aggregateLimit = filteredSpeaker['Aggregate spend on Accommodation'] || 10000;
      this._honorariumSpendLimit = filteredSpeaker['Aggregate Honorarium Spent'];


      // Because 0 in Sheet
      if (this._aggregateLimit == 0) {
        this._aggregateLimit = 10000
      }
      // console.log(this._aggregateLimit)
      this._checkHCPType(filteredSpeaker['Speaker Type']);
      this._getFCPADetails(value);
      this._getRemuneration(filteredSpeaker.Speciality, filteredSpeaker['Speaker Category']);
    }
    else {
      this.speakerForm.reset();
      this.showRationaleForm = false;
      this.showFcpaForm = false;
      this.showFcpaDownloadLink = false;
    }

    if (value.toLowerCase() == 'na') {
      this._filteredInternationalSpeakers = this.filteredSpeakersForMatAutoComplete;
      if (this.filteredSpeakersForMatAutoComplete.length > 0) {
        this.filteredSpeakerNameForMatOption = this.filteredSpeakersForMatAutoComplete;
      }
      // console.log('helooo')
      this.showAddSpeakerButton = false;
      this.isInternationalSpeaker = true;
      this.speakerForm.controls.speakerName.enable();
    }

    else {
      if (this.filteredSpeakersForMatAutoComplete.length == 0) {
        this.showAddSpeakerButton = true;

        this.isInternationalSpeaker = false;

      }
      else {
        this.showAddSpeakerButton = false;

        this.isInternationalSpeaker = false;
      }
    }
  }

  public filteredTrainerNameForMatOption: any;
  public trainerName: string = '';

  private _filteredInternationalTrainers: any;

  public onTrainerMisCodeChanges(value: string) {
    // console.log(this._filterSpeakerByMisCode(value))
    this.filteredTrainersForMatAutoComplete = [];
    this.trainerForm.controls.trainerName.disable();
    this.isHonorarium = 'No';
    this.expenseType = '';
    this.showLocalConveyanceForm = false;
    this.showAccomodationForm = false;
    this.showTravelForm = false;
    this.showHonorariumForm = false;
    this.showInternationalBenificiaryForm = false;
    this.showBenificiaryForm = false;


    this.filteredTrainersForMatAutoComplete = this._filterTrainerByMisCode(value);
    // console.log(this.filteredTrainersForMatAutoComplete)

    if (this.filteredTrainersForMatAutoComplete.length == 1) {
      // console.log(this.filteredTrainersForMatAutoComplete)
      let filteredTrainer = this.filteredTrainersForMatAutoComplete[0];

      this.trainerForm.controls.trainerName.setValue(filteredTrainer.TrainerName);
      this._prePopulateTrainerValues(filteredTrainer);

      this._aggregateLimit = filteredTrainer['Aggregate spend on Accomodation'] || 10000;
      this._honorariumSpendLimit = filteredTrainer['Aggregate Honorarium Spent'];
      console.log('trainer values changes : ', this.filteredTrainersForMatAutoComplete)


      // Because 0 in Sheet
      if (this._aggregateLimit == 0) {
        this._aggregateLimit = 10000
      }
      // console.log(this._aggregateLimit)
      this._checkHCPType(filteredTrainer['Is_NONGO']);
      this._getFCPADetails(value);
      this._getRemuneration(filteredTrainer.Speciality, filteredTrainer['TierType']);
    }
    else {
      this.trainerForm.reset();
      this.showRationaleForm = false;
      this.showFcpaForm = false;
      this.showFcpaDownloadLink = false;
    }

    if (value.toLowerCase() == 'na') {
      this._filteredInternationalTrainers = this.filteredTrainersForMatAutoComplete;
      if (this.filteredTrainersForMatAutoComplete.length > 0) {
        this.filteredTrainerNameForMatOption = this.filteredTrainersForMatAutoComplete;
      }
      // console.log('helooo')
      this.showTrainerAddButton = false;
      this.isInternationalSpeaker = true;
      this.trainerForm.controls.trainerName.enable();
    }

    else {
      if (this.filteredTrainersForMatAutoComplete.length == 0) {
        this.showTrainerAddButton = true;

        this.isInternationalSpeaker = false;

      }
      else {
        this.showTrainerAddButton = false;

        this.isInternationalSpeaker = false;
      }
    }
  }

  public speakerName: string = '';
  public onSpeakerNameChanges(value: string) {
    // console.log(value);
    this.filteredSpeakerNameForMatOption = this._filteredInternationalSpeakers;
    let filteredSpeaker = this._filterSpeakerByName(value);

    this.filteredSpeakerNameForMatOption = filteredSpeaker;

    if (Boolean(filteredSpeaker) && filteredSpeaker.length == 1) {
      this._prePopulateSpeakerValues(filteredSpeaker[0]);
      this._checkHCPType(filteredSpeaker[0]['Speaker Type']);
      this._getFCPADetails(filteredSpeaker[0].MisCode);

    }

  }

  private _filterSpeakerByName(name: string) {
    if (Boolean(name) && Boolean(this.filteredSpeakerNameForMatOption)) {
      let speakers: any[] = [];
      this.filteredSpeakerNameForMatOption.forEach(speaker => {
        if (Boolean(speaker.SpeakerName)) {
          if (speaker.SpeakerName.toLowerCase().includes(name.toLowerCase())) {
            speakers.push(speaker);
          }
        }
      })

      return speakers;

    }
  }

  public onTrainerNameChanges(value: string) {
    this.filteredTrainerNameForMatOption = this._filteredInternationalTrainers;
    let filteredTrainer = this._filterTrainerByName(value);
    this.filteredTrainerNameForMatOption = filteredTrainer;
    // console.log(filteredTrainer)
    if (filteredTrainer.length == 1) {
      this._prePopulateTrainerValues(filteredTrainer[0]);
      this._checkHCPType(filteredTrainer[0]['Is_NONGO']);
      this._getFCPADetails(filteredTrainer[0].MisCode);
    }
  }

  private _filterTrainerByName(name: string) {
    let trainers: any[] = [];
    if (Boolean(this.filteredTrainerNameForMatOption && Boolean(name))) {
      this.filteredTrainerNameForMatOption.forEach(trainer => {
        if (trainer.TrainerName.toLowerCase().includes(name.toLowerCase())) {
          trainers.push(trainer);
        }
      })
    }
    return trainers;
  }

  private _filterInternationalOtherWithName: any;
  public filteredOtherNameForMatOption: any;

  public onOtherCodeChanges(value: string) {
    // console.log(this._filterSpeakerByMisCode(value))
    this.filteredOthersForMatAutoComplete = [];
    this.otherForm.controls.otherName.disable();
    this.isHonorarium = 'No';
    this.expenseType = '';
    this.showLocalConveyanceForm = false;
    this.showAccomodationForm = false;
    this.showTravelForm = false;
    this.showHonorariumForm = false;
    this.showInternationalBenificiaryForm = false;
    this.showBenificiaryForm = false;


    this.filteredOthersForMatAutoComplete = this._filterOtherByMisCode(value);
    // console.log(this.filteredTrainersForMatAutoComplete)

    if (this.filteredOthersForMatAutoComplete.length == 1) {
      console.log(this.filteredOthersForMatAutoComplete)
      let filteredOther = this.filteredOthersForMatAutoComplete[0];

      this.otherForm.controls.otherName.setValue(filteredOther.HCPName);
      this._prePopulateOtherValues(filteredOther);

      this._aggregateLimit = filteredOther['Aggregate spend on Accommodation'] || 10000;
      this._honorariumSpendLimit = filteredOther['Aggregate Honorarium Spent'] || 1000;
      console.log('Aggregate Honorarium Spent', this.filteredOthersForMatAutoComplete)


      // Because 0 in Sheet
      if (this._aggregateLimit == 0) {
        this._aggregateLimit = 10000
      }
      // console.log(this._aggregateLimit)
      this._checkHCPType(filteredOther['HCP Type']);
      this._getFCPADetails(value);
      // this._getRemuneration(filteredTrainer.Speciality, filteredTrainer['TierType']);
    }
    else {
      this.otherForm.reset();
      this.showRationaleForm = false;
      this.showFcpaForm = false;
      this.showFcpaDownloadLink = false;
    }

    if (value.toLowerCase() == 'na') {
      this._filterInternationalOtherWithName = this.otherPanelistsFromSheet;
      // console.log('helooo')
      this.showOtherAddButton = false;
      this.isInternationalSpeaker = true;
      this.otherForm.controls.otherName.enable();
    }

    else {
      if (this.filteredOthersForMatAutoComplete.length == 0) {
        this.showOtherAddButton = true;

        this.isInternationalSpeaker = false;

      }
      else {
        this.showOtherAddButton = false;

        this.isInternationalSpeaker = false;
      }
    }
  }

  public onOtherNameChanges(value: string) {


    this.filteredOtherNameForMatOption = this._filterOtherWithName(value);
    console.log(this.filteredOtherNameForMatOption);

    if (this.filteredOtherNameForMatOption.length == 1) {
      let filteredOther = this.filteredOtherNameForMatOption[0];
      this.otherForm.controls.otherName.setValue(filteredOther.HCPName);
      this._prePopulateOtherValues(filteredOther);
    }
  }

  private _filterOtherWithName(name: string) {
    let hcpList: any[] = [];
    if (Boolean(this.otherPanelistsFromSheet) && Boolean(name)) {
      this.otherPanelistsFromSheet.forEach(hcp => {
        if (hcp.HCPName) {
          if (hcp.HCPName.toLowerCase().includes(name.toLowerCase())) {
            hcpList.push(hcp);
          }
        }
      }
      )
    }
    return hcpList;
  }



  private _prePopulateSpeakerValues(filteredSpeaker: any) {
    this.speakerForm.controls.speakerCode.setValue(filteredSpeaker['Speaker Code']);
    this.speakerForm.controls.speakerSpeciality.setValue(filteredSpeaker.Speciality);
    this.speakerForm.controls.speakerType.setValue(filteredSpeaker['Speaker Type']);
    this.speakerForm.controls.speakerTier.setValue(filteredSpeaker['Speaker Category']);
    this.speakerForm.controls.speakerQualification.setValue(filteredSpeaker.Qualification || this._noData);
    this.speakerForm.controls.speakerCountry.setValue(filteredSpeaker.Country || this._noData)
  }

  private _prePopulateTrainerValues(filteredTrainer: any) {
    this.trainerForm.controls.trainerCode.setValue(filteredTrainer['TrainerCode']);
    this.trainerForm.controls.trainerSpeciality.setValue(filteredTrainer.Speciality);
    this.trainerForm.controls.trainerType.setValue(filteredTrainer['Is_NONGO']);
    this.trainerForm.controls.trainerTier.setValue(filteredTrainer['TierType']);
    this.trainerForm.controls.trainerQualification.setValue(filteredTrainer.Qualification || this._noData);
    this.trainerForm.controls.trainerCountry.setValue(filteredTrainer.Country || this._noData)
  }

  private _prePopulateOtherValues(filteredOther: any) {
    // this.otherForm.controls.trainerCode.setValue(filteredTrainer['TrainerCode']);
    this.otherForm.controls.otherSpeciality.setValue(filteredOther.Speciality || this._noData);
    this.otherForm.controls.otherType.setValue(filteredOther['HCP Type']);
    // this.trainerForm.controls.trainerTier.setValue(filteredTrainer['TierType']);
    // this.trainerForm.controls.trainerQualification.setValue(filteredTrainer.Qualification || this._noData);
    // this.trainerForm.controls.trainerCountry.setValue(filteredTrainer.Country || this._noData)
  }

  private _filterSpeakerByMisCode(misCode: string) {
    return this.approvedSpeakersFromSheet.filter(speaker => (speaker.MisCode + '').includes(misCode))
  }



  private _filterTrainerByMisCode(misCode: string) {
    return this.approvedTrainersFromSheet.filter(other => (other.MisCode + '').includes(misCode))
  }

  private _filterOtherByMisCode(misCode: string) {
    return this.otherPanelistsFromSheet.filter(trainer => (trainer.MisCode + '').includes(misCode))
  }

  public openMasters(data) {
    if (data == 'speaker') {
      const currentRoute = environment.APPLICATION_URL + '/#/master-list/speaker-code-creation/add-speaker?action=add';
      window.open(currentRoute, '_blank');
    } else if (data == 'trainer') {
      const currentRoute = environment.APPLICATION_URL + '/#/master-list/trainer-code-creation/add-trainer?action=add';
      window.open(currentRoute, '_blank');
    } else if (data == 'hcp-master') {
      const currentRoute = environment.APPLICATION_URL + '/#/master-list/hcp-master';
      window.open(currentRoute, '_blank');
    }
  }

  // For Rationale Check
  private _checkHCPType(type: string) {
    if (type.toLowerCase().includes('n')) {
      this.showRationaleForm = false;
    }
    else {
      this.showRationaleForm = true;
    }
  }

  // For FCPA Details
  private _getFCPADetails(misCode: string) {
    this._utilityService.getFCPA(misCode)
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        // console.log(res);
        if (res.fcpaValid == 'Yes') {
          this.showFcpaDownloadLink = true;
          this.showFcpaForm = false;
          this.fcpaDownloadLink = res.url;
        }
        else {
          this.showFcpaDownloadLink = false;
          this.showFcpaForm = true;
        }
      },
        err => {
          this.showFcpaDownloadLink = false;
          this.showFcpaForm = true;
        })
  }

  // For Remuneration Changes
  private _getRemuneration(speciality: string, tier: string) {
    this._utilityService.getFMV(speciality, tier)
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        // console.log(res);
        if (+res > 0) {
          this._remunerationToCalculate = res;
        }
        else {
          this._remunerationToCalculate = 1000;
        }
      })
  }

  private _hideFilePreview() {
    this.showVendorChequePreview = false;
    this.showVendorChequeUpload = false;
    this.showVendorPanPreview = false;
    this.showVendorPanUpoad = false;
    this.showInternaionalVendorTaxPreview = false;
    this.showInternationalVendorTaxUpload = false;
  }

  public onHonorariumRadioChange(value: string) {
    this.honorariumForm.reset();
    this.benificiaryForm.reset();
    this.internationalBenificiaryForm.reset();
    this._hideFilePreview();
    this.showVendorAddButton = false;
    // console.log(value)
    if (value == 'Yes') {
      this.showHonorariumForm = true;

      if (!this.isInternationalSpeaker) {
        this.showBenificiaryForm = true;
        this.showInternationalBenificiaryForm = false;

      }
      else {
        this.showBenificiaryForm = false;
        this.showInternationalBenificiaryForm = true;


      }
    }
    else {
      this.showHonorariumForm = false;
      this.showBenificiaryForm = false;
      this.showInternationalBenificiaryForm = false;
    }
  }

  private _calculatedRemuneration: number = 0;
  public showHonorariumAmountField: boolean = true;
  public showInternationalFileUpload: boolean = false;
  private _honorariumTotalHoursCalculate() {
    this.honorariumForm.valueChanges.subscribe(
      changes => {
        console.log(changes)

        if (changes.globalFmvCheck) {
          this.showInternationalFileUpload = true;
        }
        else {
          this.showInternationalFileUpload = false;
        }
        this._calculateTotalMinutes();




        if (this.totalHours > 480) {
          this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.MAX_HOURS, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);

          // Removing the last digit when minutes pass 480
          // this.totalHours = 480;

        }
        else {
          if (!this.isInternationalSpeaker && !this.showOtherForm) {
            this.showHonorariumAmountField = false;
            // this.honorariumForm.controls.honorariumAmountExcludingTax.disable();

            if (changes.presentationDuration > 0 && changes.panelDiscussionDuration &&
              changes.panelSessionPreparation && changes.qaSession && changes.briefingDuration) {
              this._calculatedRemuneration = this._remunerationToCalculate * +(this.totalHours / 60).toFixed(2)
              console.log('this._calculatedRemuneration', this._calculatedRemuneration)
              // this.honorariumForm.controls.honorariumAmountExcludingTax.enable();
              this.showHonorariumAmountField = true;
              // console.log('Remne', this._calculatedRemuneration)
            }
          }
        }

        if (!this.isInternationalSpeaker) {
          if (changes.honorariumAmountExcludingTax !== 0) {
            if (changes.honorariumAmountExcludingTax > this._calculatedRemuneration) {
              this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.HONORARIUM_LIMIT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
              this.honorariumForm.controls.honorariumAmountExcludingTax.setValue(0);
              this._checkAggregate();
            }
            else if (changes.honorariumAmountIncludingTax > this._calculatedRemuneration) {
              this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.HONORARIUM_LIMIT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
              this.honorariumForm.controls.honorariumAmountIncludingTax.setValue(0);
              this._checkAggregate();
            }
          }
        }

      }
    )
  }

  private _checkAggregate() {
    if (this.hcpRoleSelectionForm.value.hcpRole == 'Speaker') {
      if (this.honorariumForm.value.honorariumAmountExcludingTax + this._honorariumSpendLimit > 600000) {
        this.showHonorariumDeviation = true;
      }
      else if (this.honorariumForm.value.honorariumAmountIncludingTax + this._honorariumSpendLimit > 600000) {
        this.showHonorariumDeviation = true;
      }
      else {
        this.showHonorariumDeviation = false;
      }
    }
    if (this.hcpRoleSelectionForm.value.hcpRole == 'Trainer') {
      console.log('changes.honorariumAmountExcludingTax + this._honorariumSpendLimit trainer', this.honorariumForm.value.honorariumAmountExcludingTax + this._honorariumSpendLimit)

      if (this.honorariumForm.value.honorariumAmountExcludingTax + this._honorariumSpendLimit > 1200000) {
        this.showHonorariumDeviation = true;
      }
      else if (this.honorariumForm.value.honorariumAmountIncludingTax + this._honorariumSpendLimit > 1200000) {
        this.showHonorariumDeviation = true;
      }
      else {
        this.showHonorariumDeviation = false;
      }
    }
    if (this.hcpRoleSelectionForm.value.hcpRole == 'Others') {
      console.log('changes.honorariumAmountExcludingTax + this._honorariumSpendLimit others', this.honorariumForm.value.honorariumAmountExcludingTax + this._honorariumSpendLimit)

      if (this.honorariumForm.value.honorariumAmountExcludingTax + this._honorariumSpendLimit > 600000) {
        this.showHonorariumDeviation = true;
      }
      else if (this.honorariumForm.value.honorariumAmountIncludingTax + this._honorariumSpendLimit > 600000) {
        this.showHonorariumDeviation = true;
      }
      else {
        this.showHonorariumDeviation = false;
      }
    }
  }

  private _calculateTotalMinutes() {
    this.totalHours = ((this.honorariumForm.value.presentationDuration + this.honorariumForm.value.panelDiscussionDuration +
      this.honorariumForm.value.panelSessionPreparation + this.honorariumForm.value.qaSession + this.honorariumForm.value.briefingDuration));
  }

  public onSessionMinutesChanges(value: number, control: string) {
    if (this.totalHours > 480) {
      this.honorariumForm.controls[control].setValue(0);
      this._calculateTotalMinutes();
    }
  }


  public onExpenseSelect(value: string) {
    // console.log(value)
    if (value.indexOf('Travel') > -1) {
      this.showTravelForm = true;
    }
    else {
      this.showTravelForm = false;
      this.travelForm.reset();
    }

    if (value.indexOf('Accomdation') > -1) {
      this.showAccomodationForm = true;
    }
    else {
      this.showAccomodationForm = false;
      this.accomodationForm.reset();
    }
    if (value.indexOf('Local Conveyance') > -1) {
      this.showLocalConveyanceForm = true;
    }
    else {

      this.showLocalConveyanceForm = false;
      this.localConveyanceForm.reset();
    }
  }


  //  vendor Details
  private _vendorDetails: any;
  public onBenificiaryNameChange(value: string, type: string) {
    // console.log(value)
    // console.log(this._filterVendorName(value));
    this.filteredVendorsForMatAutoComplete = this._filterVendorName(value);

    if (this.filteredVendorsForMatAutoComplete.length == 0) {
      // this.showVendorAddButton = true;
      this.showVendorPanUpoad = true;
      this.showVendorChequeUpload = true;
      this.showInternationalVendorTaxUpload = true;
      this.showVendorPanPreview = false
      this.showVendorChequePreview = false;
      this.showInternaionalVendorTaxPreview = false;

    }
    else {
      this.showVendorAddButton = false;
      this.showVendorPanUpoad = false;
      this.showVendorChequeUpload = false;
    }

    if (type == 'normal') {
      if (this.filteredVendorsForMatAutoComplete.length == 1) {
        let filteredVendor = this.filteredVendorsForMatAutoComplete[0];
        this._vendorDetails = filteredVendor;

        // this._selectedVendor = filteredVendor;
        console.log(filteredVendor)
        this._prePopulateVendorDetails(filteredVendor)

      }
      else {
        // this.benificiaryForm.reset();
        this.benificiaryForm.controls.bankAccountNumber.reset();
        this.benificiaryForm.controls.nameAsPerPAN.reset();
        this.benificiaryForm.controls.panCardNumber.reset();
        this.benificiaryForm.controls.ifscCode.reset();
        this.benificiaryForm.controls.bankName.reset();
        this.benificiaryForm.controls.emailId.reset();

      }
    }

    if (type == 'international') {

      this.filteredVendorsForMatAutoComplete = this._filterVendorWithMisCode('na');
      if (this.filteredVendorsForMatAutoComplete.length > 0) {
        this.filteredVendorsForMatAutoComplete = this._filterInternationalVendorWithNames(value);
      }
      else {
        this.filteredVendorsForMatAutoComplete = this._filterVendorName(value);
      }
      if (this.filteredVendorsForMatAutoComplete.length == 1) {
        let filteredVendor = this.filteredVendorsForMatAutoComplete[0];
        this._prePopulateInternationalVendorDetails(filteredVendor);

      }
      else {
        // this.internationalBenificiaryForm.reset();
        this.internationalBenificiaryForm.controls.bankAccountNumberForInternational.reset();
        this.internationalBenificiaryForm.controls.swiftCode.reset();
        this.internationalBenificiaryForm.controls.ibnNumber.reset();
        this.internationalBenificiaryForm.controls.bankAccountNameForInternational.reset();
      }
    }


  }

  private _prePopulateVendorDetails(filteredVendor: any) {
    this._selectedVendor = filteredVendor;
    this.benificiaryForm.controls.bankAccountNumber.setValue(filteredVendor.BankAccountNumber);
    this.benificiaryForm.controls.nameAsPerPAN.setValue(filteredVendor.PanCardName);
    this.benificiaryForm.controls.panCardNumber.setValue(filteredVendor.PanNumber);
    this.benificiaryForm.controls.ifscCode.setValue(filteredVendor.IfscCode);
    this.benificiaryForm.controls.bankName.setValue(this._noData);
    this.benificiaryForm.controls.emailId.setValue(filteredVendor.Email || this._noData);

    if (!this._isGettingFile && filteredVendor['VendorId'] !== this._currentVendor) {
      this._getVendorFiles('normal', filteredVendor.VendorId);
    }
  }

  private _prePopulateInternationalVendorDetails(filteredVendor: any) {
    this._selectedVendor = filteredVendor;
    this.internationalBenificiaryForm.controls.bankAccountNumberForInternational.setValue(filteredVendor.BankAccountNumber);
    this.internationalBenificiaryForm.controls.swiftCode.setValue(filteredVendor['Swift Code'] || '123456');
    this.internationalBenificiaryForm.controls.ibnNumber.setValue(filteredVendor['IBN Number'] || '123456890');
    this.internationalBenificiaryForm.controls.bankAccountNameForInternational.setValue(this._noData);
    if (!this._isGettingFile && filteredVendor['VendorId'] !== this._currentVendor) {
      this._getVendorFiles('international', filteredVendor.VendorId);
    }
  }

  public onVendorOptionSelect(type: string, value: string) {
    console.log(value)
    this.vendorDetailsFromSheet.forEach(vendor => {
      if (vendor.VendorId == value) {
        if (type == 'normal') {
          this._prePopulateVendorDetails(vendor);
        }
        else {
          this._prePopulateInternationalVendorDetails(vendor);
        }
      }


    })
  }

  // Getting vendor files to prepopulate:
  public showVendorPanUpoad: boolean = false;
  public showVendorChequeUpload: boolean = false;
  public showInternationalVendorTaxUpload: boolean = false;

  public vendorChequeIframeUrl: SafeResourceUrl;
  public vendorPanIframeUrl: SafeResourceUrl;
  public internationalVendorTaxIframeUrl: SafeResourceUrl;


  public showVendorPanPreview: boolean = false;
  public showVendorChequePreview: boolean = false;
  public showInternaionalVendorTaxPreview: boolean = false;

  private _isGettingFile: boolean = false;
  private _currentVendor: string = 'no';

  private _getVendorFiles(type: string, vendorId: string) {
    console.log(vendorId)
    this._isGettingFile = true;
    this._currentVendor = vendorId;
    // this.loadingIndicator = true;
    this._utilityService.getVendorFiles(vendorId)
      .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
      .subscribe(res => {
        // this.loadingIndicator = false;
        // console.log(res.rowData)
        this._isGettingFile = false;
        this._currentVendor = 'no'
        let filesArr = res.dataArray;
        let taxDate = res.taxResidenceCertificateDate;

        if (type == 'normal') {
          // console.log(res.rowData)
          if (filesArr.length > 0) {
            filesArr.forEach(file => {
              let split = file.split(':');
              console.log(split[0]);

              if (split[0].includes('ChequeDocument')) {

                this.showVendorChequeUpload = true;
                this.showVendorChequePreview = true;
                this.vendorChequeIframeUrl = this._sanitizeUrl(split[0], split[1]);
              }


              if (split[0].includes('PanCardDocument')) {
                this.showVendorPanUpoad = true;
                this.showVendorPanPreview = true;
                this.vendorPanIframeUrl = this._sanitizeUrl(split[0], split[1]);
              }

            })

            if (!this.showVendorChequePreview) {
              this.showVendorChequeUpload = true;
              this.showVendorChequePreview = false;
            }
            if (!this.showVendorPanPreview) {
              this.showVendorPanUpoad = true;
              this.showVendorPanPreview = false;
            }
          }
          else {
            this.showVendorChequeUpload = true;
            this.showVendorChequePreview = false;
            this.showVendorPanUpoad = true;
            this.showVendorPanPreview = false;
          }
        }
        else {
          if (filesArr.length > 0) {
            filesArr.forEach(file => {
              let split = file.split(':');

              if (split[0].includes('TaxResidenceCertificate')) {
                this.showInternationalVendorTaxUpload = true;
                this.showInternaionalVendorTaxPreview = true;
                this.internationalVendorTaxIframeUrl = this._sanitizeUrl(split[0], split[1]);
                if (taxDate.includes('TaxResidenceCertificateDate')) {
                  let date = taxDate.split(':')[1]
                  this.internationalBenificiaryForm.controls.taxResidenceCertificateDate.setValue(date);
                }

              }

            })

            if (!this.showInternaionalVendorTaxPreview) {
              this.showInternaionalVendorTaxPreview = false;
              this.showInternationalVendorTaxUpload = true;
            }
          }
          else {
            this.showInternaionalVendorTaxPreview = false;
            this.showInternationalVendorTaxUpload = true;
          }
        }
      })
  }

  private _sanitizeUrl(name: string, url: string): SafeResourceUrl {
    let extension = name.split('.')[1];

    if (extension == 'jpg') {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + url);
    }
    else if (extension == 'txt') {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:text/plain;base64,' + url);
    }
    else if (extension == 'pdf') {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + url);
    }
    else if (extension == 'docx') {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,');
    }
    else if (extension == 'jpeg') {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + url);
    }
    else if (extension == 'png') {
      this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + url)
    }
    else if (extension == 'unknown') {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:text/plain;base64,' + url);
    }
    else {
      this.showInternaionalVendorTaxPreview = false;
      this.showInternationalVendorTaxUpload = true;
      this.showVendorChequeUpload = true;
      this.showVendorChequePreview = false;
      this.showVendorPanUpoad = true;
      this.showVendorPanPreview = false;
    }



  }


  private _filterVendorName(name: string) {
    // console.log(this.vendorDetailsFromSheet)
    return this.vendorDetailsFromSheet.filter(vendor => vendor.BeneficiaryName.toLowerCase().includes(name.toLowerCase()))
  }

  private _filterInternationalVendorWithNames(name: string) {
    return this.filteredVendorsForMatAutoComplete.filter(vendor => vendor.BeneficiaryName.toLowerCase().includes(name.toLowerCase()))
  }

  private _filterVendorWithMisCode(misCode: string) {
    let vendors: any[] = [];
    this.vendorDetailsFromSheet.forEach(vendor => {
      if (Boolean(vendor.MisCode)) {
        if (vendor.MisCode.toString().toLowerCase() == misCode.toLowerCase()) {
          vendors.push(vendor)
        }
      }
    })

    return vendors;
  }

  public onCurrencyTypeDropDownChanges(value: string, type: string) {
    // console.log(value)
    // console.log(type)
    if (type == 'normal') {
      if (value == 'Others') {
        this.showCurrencyTextBox = true;
      }
      else {
        this.showCurrencyTextBox = false;
      }
    }
    else if (type == 'international') {
      if (value == 'Others') {
        this.showInternationalCurrencyTextBox = true;
      }
      else {
        this.showInternationalCurrencyTextBox = false
      }
    }
  }



  public amountIncludingTaxCheck(value: string, control: string) {

    let excludingTaxAmount: number = 0;
    let includingTaxAmount: number = 0;
    if (control == 'honorariumAmountIncludingTax') {
      excludingTaxAmount = this.honorariumForm.value.honorariumAmountExcludingTax;
      includingTaxAmount = this.honorariumForm.value.honorariumAmountIncludingTax;
      if (this._isAmountInvalid(includingTaxAmount, excludingTaxAmount)) {
        // this.honorariumForm.controls.honorariumAmountIncludingTax.setValue(excludingTaxAmount);

        return true;
      }
    }
    else if (control == 'travelAmountwithTax') {
      excludingTaxAmount = this.travelForm.value.travelAmountwithoutTax;
      includingTaxAmount = this.travelForm.value.travelAmountwithTax;
      if (this._isAmountInvalid(includingTaxAmount, excludingTaxAmount)) {
        // this.travelForm.controls.travelAmountwithTax.setValue(excludingTaxAmount)
        return true;
      }
    }
    else if (control == 'accomAmountWithTax') {
      excludingTaxAmount = this.accomodationForm.value.accomAmountWithoutTax;
      includingTaxAmount = this.accomodationForm.value.accomAmountWithTax;
      if (this._isAmountInvalid(includingTaxAmount, excludingTaxAmount)) {
        // this.accomodationForm.controls.accomAmountWithTax.setValue(excludingTaxAmount)
        return true;
      }
    }
    else if (control == 'localAmountWithTax') {
      excludingTaxAmount = this.localConveyanceForm.value.localAmountWithoutTax;
      includingTaxAmount = this.localConveyanceForm.value.localAmountWithTax;
      if (this._isAmountInvalid(includingTaxAmount, excludingTaxAmount)) {
        // this.localConveyanceForm.controls.localAmountWithTax.setValue(excludingTaxAmount)
        return true;
      }
    }

    // console.log(excludingTaxAmount);
  }

  private _isAmountInvalid(includingTaxAmount: number, excludingTaxAmount: number) {
    if (includingTaxAmount < excludingTaxAmount) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AMOUNT_INCLUDING_TAX, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      return true;
    }
  }


  private _createUpdateVendor() {
    console.log('vendor details ', this._vendorDetails);
    let roleDetails = this._authService.decodeToken();
    if (this.filteredVendorsForMatAutoComplete.length == 1) {
      const vendorUpdate = {
        VendorId: (this._vendorDetails.VendorId) ? this._vendorDetails.VendorId : '',
        InitiatorNameName: roleDetails.unique_name || ' ',
        InitiatorEmail: roleDetails.email || ' ',
        VendorAccount: (this._vendorDetails.VendorAccount) ? this._vendorDetails.VendorAccount : '',
        MisCode: '',
        BenificiaryName: this.benificiaryName || this.internationalBenficiaryName,
        PanCardName: (this.benificiaryForm.value.nameAsPerPAN) ? this.benificiaryForm.value.nameAsPerPAN : '',
        PanNumber: (this.benificiaryForm.value.panCardNumber) ? this.benificiaryForm.value.panCardNumber : '',
        BankAccountNumber: (this.benificiaryForm.value.bankAccountNumber) ? this.benificiaryForm.value.bankAccountNumber + '' :
          (this.internationalBenificiaryForm.value.bankAccountNumberForInternational) ? this.internationalBenificiaryForm.value.bankAccountNumberForInternational + '' : '',
        IfscCode: (this.benificiaryForm.value.ifscCode) ? this.benificiaryForm.value.ifscCode + '' : '',
        SwiftCode: (this.internationalBenificiaryForm.value.swiftCode) ? this.internationalBenificiaryForm.value.swiftCode : '',
        IbnNumber: (this.internationalBenificiaryForm.value.ibnNumber) ? this.internationalBenificiaryForm.value.ibnNumber : '',
        Email: (this.benificiaryForm.value.emailId) ? this.benificiaryForm.value.emailId :
          (this.internationalBenificiaryForm.value.emailIdForInternational) ? this.internationalBenificiaryForm.value.emailIdForInternational : '',
        TaxResidenceCertificateDate: (this.internationalBenificiaryForm.value.taxResidenceCertificateDate) ? this.internationalBenificiaryForm.value.taxResidenceCertificateDate : "2024-02-28T10:25:52.848Z",
        PanCardDocument: (!this.isInternationalSpeaker) ? this._panCardFile.split(':')[1] : '',
        ChequeDocument: (!this.isInternationalSpeaker) ? this._chequeFile.split(':')[1] : '',
        TaxResidenceCertificate: (this.isInternationalSpeaker) ? (this._taxResidenceFile.split(':')[1]) : ''
      }
      console.log('updating vendor data', vendorUpdate);
      if (vendorUpdate) {
        this._utilityService.putVendorDetails(vendorUpdate).subscribe(res => {
          console.log('vendor updated successfully', res)
        })
      }
    }
    else {
      const vendorCreate = {
        InitiatorNameName: roleDetails.unique_name || ' ',
        InitiatorEmail: roleDetails.email || ' ',
        VendorAccount: '',
        MisCode: '',
        BenificiaryName: this.benificiaryName || this.internationalBenficiaryName,
        PanCardName: (this.benificiaryForm.value.nameAsPerPAN) ? this.benificiaryForm.value.nameAsPerPAN : '',
        PanNumber: (this.benificiaryForm.value.panCardNumber) ? this.benificiaryForm.value.panCardNumber : '',
        BankAccountNumber: (this.benificiaryForm.value.bankAccountNumber) ? this.benificiaryForm.value.bankAccountNumber + '' :
          (this.internationalBenificiaryForm.value.bankAccountNumberForInternational) ? this.internationalBenificiaryForm.value.bankAccountNumberForInternational + '' : '',
        IfscCode: (this.benificiaryForm.value.ifscCode) ? this.benificiaryForm.value.ifscCode + '' : '',
        SwiftCode: (this.internationalBenificiaryForm.value.swiftCode) ? this.internationalBenificiaryForm.value.swiftCode : '',
        IbnNumber: (this.internationalBenificiaryForm.value.ibnNumber) ? this.internationalBenificiaryForm.value.ibnNumber : '',
        Email: (this.benificiaryForm.value.emailId) ? this.benificiaryForm.value.emailId :
          (this.internationalBenificiaryForm.value.emailIdForInternational) ? this.internationalBenificiaryForm.value.emailIdForInternational : '',
        TaxResidenceCertificateDate: (this.internationalBenificiaryForm.value.taxResidenceCertificateDate) ? this.internationalBenificiaryForm.value.taxResidenceCertificateDate : "2024-02-28T10:25:52.848Z",
        PanCardDocument: (!this.isInternationalSpeaker) ? this._panCardFile.split(':')[1] : '',
        ChequeDocument: (!this.isInternationalSpeaker) ? this._chequeFile.split(':')[1] : '',
        TaxResidenceCertificate: (this.isInternationalSpeaker) ? (this._taxResidenceFile.split(':')[1]) : ''
      }
      console.log('vendor created data', vendorCreate);
      if (vendorCreate) {
        this._moduleService.addVendorCreationDetails(vendorCreate).subscribe(res => {
          console.log('vendor created succssfully', res)
        })
      }
    }

  }

  public addToHCPTable() {



    // Need API so emptying the files
    this._otherFiles = [];
    this._deviationFiles = [];


    let formValidity: number = 0;
    let totalAggregateSpend: number = 0;
    if (!this.isInternationalSpeaker) {

      if (this.showAccomodationForm) {
        totalAggregateSpend += (this.accomodationForm.value.accomAmountWithoutTax + this.accomodationForm.value.accomAmountWithTax);
      }
      if (this.showTravelForm) {
        totalAggregateSpend += (this.travelForm.value.travelAmountwithTax + this.travelForm.value.travelAmountwithoutTax)
      }
      if (this.showLocalConveyanceForm) {
        totalAggregateSpend += (this.localConveyanceForm.value.localAmountWithoutTax + this.localConveyanceForm.value.localAmountWithTax)
      }

      if (totalAggregateSpend + this._aggregateLimit > 300000) {
        this.showExpenseAggregateDeviation = true;
      }
      else {
        this.showExpenseAggregateDeviation = false;
      }
    }

    if (this.showHonorariumForm) {
      if (this.amountIncludingTaxCheck(this.honorariumForm.value.honorariumAmountIncludingTax, 'honorariumAmountIncludingTax')) {
        this.showHonorariumAmountError = true;
        formValidity++;
      }
      else {
        this.showHonorariumAmountError = false;
      }
    }

    if (this.showTravelForm) {
      if (this.amountIncludingTaxCheck(this.travelForm.value.travelAmountwithTax, 'travelAmountwithTax')) {
        this.showTravelAmountError = true;
        formValidity++;
      }
      else {
        this.showTravelAmountError = false;
      }
    }

    if (this.showAccomodationForm) {
      if (this.amountIncludingTaxCheck(this.accomodationForm.value.accomAmountWithTax, 'accomAmountWithTax')) {
        this.showAccomAmountError = true;
        formValidity++;
      }
      else {
        this.showAccomAmountError = false;
      }
    }

    if (this.showLocalConveyanceForm) {
      if (this.amountIncludingTaxCheck(this.localConveyanceForm.value.localAmountWithTax, 'localAmountWithTax')) {
        this.showLCAmountError = true;
        formValidity++;
      }
      else {
        this.showLCAmountError = false;
      }
    }



    if (this.showExpenseAggregateDeviation && this.aggregateDeviationForm.invalid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.AGGREGATES_LIMIT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.hcpRoleSelectionForm.invalid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }


    if (this.showSpeakerForm && !Boolean(this.speakerMisCode)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.showTrainerForm && !Boolean(this.trainerMisCode)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.showOtherForm && !Boolean(this.OtherMisCode)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.showOtherForm && !Boolean(this.otherRole)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.isInternationalSpeaker) {
      if (this.showSpeakerForm && !Boolean(this.speakerForm.value.speakerName)) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        formValidity++;
      }
      if (this.showTrainerForm && !Boolean(this.trainerForm.value.trainerName)) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        formValidity++;
      }
      if (this.showOtherForm && (!Boolean(this.otherForm.value.otherName || !Boolean(this.speakerForm.value.speakerName)))) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HCP_ROLE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        formValidity++;
      }
    }


    if (this.showRationaleForm && this.rationaleForm.invalid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_RATIONALE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.showFcpaForm && this.fcpaForm.invalid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_FCPA, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }


    if (this.showHonorariumForm && (this.totalHours <= 0 || this.honorariumForm.value.honorariumAmountIncludingTax <= 0)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HONARARIUM, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }



    if (this.showTravelForm && (this.travelForm.invalid || this.travelForm.value.travelAmountwithTax <= 0)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_TRAVEL, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.showAccomodationForm && (this.accomodationForm.invalid || this.accomodationForm.value.accomAmountWithTax <= 0)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_ACCOMODATION, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.showLocalConveyanceForm && (this.localConveyanceForm.invalid || this.localConveyanceForm.value.localAmountWithTax <= 0)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_LOCAL_CONVEYANCE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }


    if (this.showBenificiaryForm && this.benificiaryForm.invalid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_BENIFICIARY, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.showInternationalBenificiaryForm && this.internationalBenificiaryForm.invalid) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_BENIFICIARY, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }

    if (this.isInternationalSpeaker && this.showHonorariumForm) {
      if (!Boolean(this.honorariumForm.value.globalFmvCheck) || !Boolean(this._internationalSpeakerAgreementFile)) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_HONARARIUM, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        formValidity++;
      }
    }

    if (!this.isInternationalSpeaker) {

      if (this.showVendorChequeUpload && !Boolean(this._chequeFile)) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_BENIFICIARY, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        formValidity++;
      }

      if (this.showVendorPanUpoad && !Boolean(this._panCardFile)) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_BENIFICIARY, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        formValidity++;
      }
    }

    if (this.isInternationalSpeaker) {
      if (this.showInternationalVendorTaxUpload && !Boolean(this._taxResidenceFile)) {
        this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_BENIFICIARY, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
        formValidity++;
      }
    }




    if (this.showCurrencyTextBox && !Boolean(this.benificiaryForm.value.otherCurrencyType)) {
      this._snackBarService.showSnackBar(Config.MESSAGE.ERROR.FILL_BENIFICIARY, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR);
      formValidity++;
    }





    if (formValidity == 0) {
      let hcpName: string;
      let misCode: string;
      let hcpType: string;
      let hcpSpeciality: string;
      let hcpTier: string;
      let speakerCode: string = ' ';
      let trainerCode: string = ' ';

      if (this.showSpeakerForm) {
        hcpName = this.speakerForm.value.speakerName || this.speakerName;
        misCode = this.speakerMisCode + '';
        hcpType = this.speakerForm.value.speakerType || 'NA';
        hcpSpeciality = this.speakerForm.value.speakerSpeciality || 'NA';
        hcpTier = this.speakerForm.value.speakerTier + '' || 'NA';
        speakerCode = this.speakerForm.value.speakerCode + '' || 'NA';
      }
      else if (this.showTrainerForm) {
        hcpName = this.trainerForm.value.trainerName || this.trainerName;
        misCode = this.trainerMisCode + '';
        hcpType = this.trainerForm.value.trainerType || 'NA';
        hcpSpeciality = this.trainerForm.value.trainerSpeciality || 'NA';
        hcpTier = this.trainerForm.value.trainerTier || 'NA';
        trainerCode = this.trainerForm.value.trainerCode || 'NA';
      }
      else if (this.showOtherForm) {
        hcpName = this.otherForm.value.otherName || this.otherName;
        misCode = this.OtherMisCode + '';
        hcpType = this.otherForm.value.otherType || 'NA';
        hcpSpeciality = this.otherForm.value.otherSpeciality || 'NA';
        hcpTier = this.otherForm.value.otherTier || 'NA';
      }

      this._createUpdateVendor();

      const HcpData = {
        // For API
        EventIdorEventRequestId: " ",
        SpeakerCode: speakerCode,
        TrainerCode: trainerCode,
        Speciality: hcpSpeciality,
        Tier: hcpTier,
        Rationale: (this.showRationaleForm) ? this.rationaleForm.value.rationaleText : 'None',
        PresentationDuration: (this.showHonorariumForm) ? this.honorariumForm.value.presentationDuration + '' : '0',
        PanelSessionPreperationDuration: (this.showHonorariumForm) ? this.honorariumForm.value.panelSessionPreparation + '' : '0',
        PanelDisscussionDuration: (this.showHonorariumForm) ? this.honorariumForm.value.panelDiscussionDuration + '' : '0',
        QaSessionDuration: (this.showHonorariumForm) ? this.honorariumForm.value.qaSession + '' : '0',
        BriefingSession: (this.showHonorariumForm) ? this.honorariumForm.value.briefingDuration + '' : '0',
        TotalSessionHours: (Boolean(this.totalHours)) ? this.totalHours + '' : '0',
        IsInclidingGst: "Yes",
        AgreementAmount: '',

        // For Amount
        isTravelBTC: this.travelForm.value.travelBTC,
        isAccomBTC: this.accomodationForm.value.accomBTC,


        // For Table
        HcpRole: (!this.showOtherForm) ? this.hcpRoleSelectionForm.value.hcpRole : this.otherRole,
        HcpName: hcpName + '' || ' ',
        MisCode: misCode + '' || ' ',
        GOorNGO: hcpType + '' || ' ',
        HonorariumRequired: (this.showHonorariumForm) ? 'Yes' : 'No',
        HonarariumAmount: (this.showHonorariumForm) ? this.honorariumForm.value.honorariumAmountIncludingTax + '' : '0',
        Travel: (this.showTravelForm) ? this.travelForm.value.travelAmountwithTax + '' : '0',
        LocalConveyance: (this.showLocalConveyanceForm) ? this.localConveyanceForm.value.localAmountWithTax + '' : '0',
        Accomdation: (this.showAccomodationForm) ? this.accomodationForm.value.accomAmountWithTax + '' : '0',
        FinalAmount: ''
      }


      HcpData.FinalAmount = (+HcpData.Travel + +HcpData.LocalConveyance + +HcpData.Accomdation + +HcpData.HonarariumAmount) + '';
      HcpData.AgreementAmount = HcpData.HonarariumAmount;

      this.eachHCPTotalAmount = +HcpData.FinalAmount;

      this.hcpTableDetails.push(HcpData);
      this._pushFiles();

      this._removePanelistsFromOptionOnceAdded();
      this._BTCBTESummary();
      // console.log(this.hcpTableDetails);

      let dataToSend = {
        from: 'PanelComponent',
        panelists: this.hcpTableDetails,
        btcSummary: this.BTCSummaryTable,
        bteSummary: this.BTESummaryTable,
        btcTotalAmount: this.BTCTotalAmount,
        bteTotalAmount: this.BTETotalAmount,
        totalPanelAmount: this.totalPanelAmount,
        otherFiles: this._otherFiles,
        deviationFiles: this._deviationFiles
      }

      this._sendDataToParent(dataToSend);

      this.speakerMisCode = '';
      this.trainerMisCode = '';
      this.isHonorarium = 'No';
      this.expenseType = '';
      this.benificiaryName = '';
      this.internationalBenficiaryName = '';
      this.otherRole = '';
      this.OtherMisCode = '';
      this.speakerName = '';
      this.trainerName = ''

      // Auto Complete Reset
      this.filteredSpeakersForMatAutoComplete = [];
      this.filteredSpeakerNameForMatOption = [];
      this.filteredTrainersForMatAutoComplete = [];
      this.filteredSpeakerNameForMatOption = [];
      this.filteredOthersForMatAutoComplete = [];



      // Form Reset
      this.hcpRoleSelectionForm.reset();
      this.speakerForm.reset();
      this.trainerForm.reset();
      this.otherForm.reset();
      this.rationaleForm.reset();
      this.fcpaForm.reset();
      this.hcpRoleSelectionForm.reset();
      this.localConveyanceForm.reset();
      this.travelForm.reset();
      this.accomodationForm.reset();
      this.internationalHonorariumForm.reset();
      this.honorariumForm.reset();
      this.benificiaryForm.reset();
      this.internationalBenificiaryForm.reset();
      this.aggregateDeviationForm.reset();


      // Hide All
      this.showSpeakerForm = false;
      this.showTrainerForm = false;
      this.showOtherForm = false;
      this.showInternationHcpForm = false;

      this.showAccomodationForm = false;
      this.showRationaleForm = false;
      this.showFcpaDownloadLink = false;
      this.showFcpaForm = false;
      this.showTravelForm = false;
      this.showLocalConveyanceForm = false;

      this.showHonorariumForm = false;
      this.showInternationalHonorariumForm = false;
      this.showMisCode = false;
      this.showInternationalBenificiaryForm = false;
      this.showBenificiaryForm = false;

      this.showHonorariumAmountField = true;
      this.showExpenseAggregateDeviation = false;
      this._aggregateLimit = 0;
      this._remunerationToCalculate = 0;

      // File Preview
      this.showVendorPanPreview = false;
      this.showVendorPanUpoad = false;
      this.showVendorChequePreview = false;
      this.showVendorChequeUpload = false;
      this.showInternaionalVendorTaxPreview = false;
      this.showInternationalVendorTaxUpload = false;


      this.showHonorariumAmountError = false;
      this.showTravelAmountError = false;
      this.showAccomAmountError = false;
      this.showLCAmountError = false;

    }
  }

  // BTC BTE Summary
  private _BTCBTESummary() {

    if (this.showHonorariumForm) {
      let honorariumAmount = this.honorariumForm.value.honorariumAmountIncludingTax;
      let honorariumSummary = this.BTCSummaryTable.find(data => data.expense == 'Honorarium');
      this.BTCTotalAmount += honorariumAmount;
      if (!honorariumSummary) {
        this.BTCSummaryTable.push({
          expense: 'Honorarium',
          amount: honorariumAmount,
          includingTax: (this.honorariumForm.value.honorariumAmountIncludingTax > 0) ? 'Yes' : 'No'
        })
      }
      else {
        honorariumSummary.amount += honorariumAmount
      }
    }


    if (this.showAccomodationForm) {
      let accomAmount = this.accomodationForm.value.accomAmountWithTax;
      let accomSummaryBTC = this.BTCSummaryTable.find(data => data.expense == 'Accomodation Allowance');
      let accomSummaryBTE = this.BTESummaryTable.find(data => data.expense == 'Accomodation Allowance');
      if (this.accomodationForm.value.accomBTC == 'BTC') {
        this.BTCTotalAmount += +accomAmount;
        if (!accomSummaryBTC) {
          this.BTCSummaryTable.push({
            expense: 'Accomodation Allowance',
            amount: +accomAmount,
            includingTax: (this.accomodationForm.value.accomAmountWithTax > 0) ? 'Yes' : 'No'
          })
        }
        else {
          accomSummaryBTC.amount += +accomAmount;
        }
      }
      else {
        this.BTETotalAmount += accomAmount;
        if (!accomSummaryBTE) {
          this.BTESummaryTable.push({
            expense: 'Accomodation Allowance',
            amount: +accomAmount,
            includingTax: 'No'
          })
        }
        else {
          accomSummaryBTE.amount += +accomAmount;
        }
      }
    }
    if (this.showTravelForm) {
      let travelAmount = this.travelForm.value.travelAmountwithTax;
      let travelSummaryBTC = this.BTCSummaryTable.find(data => data.expense == 'Travel Allowance');
      let travelSummaryBTE = this.BTESummaryTable.find(data => data.expense == 'Travel Allowance');
      if (this.travelForm.value.travelBTC == 'BTC') {
        this.BTCTotalAmount += travelAmount;
        if (!travelSummaryBTC) {
          this.BTCSummaryTable.push({
            expense: 'Travel Allowance',
            amount: +travelAmount,
            includingTax: (this.travelForm.value.travelAmountwithTax > 0) ? 'Yes' : 'No'
          })
        }
        else {
          travelSummaryBTC.amount += +travelAmount;
        }
      }
      else {
        this.BTETotalAmount += travelAmount
        if (!travelSummaryBTE) {
          this.BTESummaryTable.push({
            expense: 'Travel Allowance',
            amount: travelAmount,
            includingTax: 'No'
          })
        }
        else {
          travelSummaryBTE.amount += travelAmount
        }
      }
    }

    if (this.showLocalConveyanceForm) {
      let localAmount = this.localConveyanceForm.value.localAmountWithTax;
      let localConveyanceSummartBTC = this.BTCSummaryTable.find(data => data.expense == 'Local Conveyance');
      let localConveyanceSummartBTE = this.BTESummaryTable.find(data => data.expense == 'Local Conveyance');
      if (this.localConveyanceForm.value.localBTC == 'BTC') {
        this.BTCTotalAmount += localAmount
        if (!localConveyanceSummartBTC) {
          this.BTCSummaryTable.push({
            expense: 'Local Conveyance',
            amount: localAmount,
            includingTax: (this.localConveyanceForm.value.localAmountWithTax > 0) ? 'Yes' : 'No'
          })
        }
        else {
          localConveyanceSummartBTC.amount += localAmount
        }

      }
      else {
        this.BTETotalAmount += localAmount
        if (!localConveyanceSummartBTE) {
          this.BTESummaryTable.push({
            expense: 'Local Conveyance',
            amount: localAmount,
            includingTax: (this.localConveyanceForm.value.localAmountWithTax > 0) ? 'Yes' : 'No'
          })
        }
        else {
          localConveyanceSummartBTE.amount += localAmount;
        }
      }
    }

    // console.log(this.BTESummaryTable);
    // console.log('BTE Total', this.BTETotalAmount);
    // console.log('BTC Total', this.BTCTotalAmount);
    // console.log(this.BTCSummaryTable);

    this.totalPanelAmount = this.BTETotalAmount + this.BTCTotalAmount;
  }

  //  To Remove Added Panelist
  private _addedSpeakers: any[] = [];
  private _addedTrainers: any[] = [];
  private _addedOthers: any[] = []
  private _removePanelistsFromOptionOnceAdded() {
    // Logic to remove added panelists
    let index: number = -1;
    // 1.Speaker
    if (this.showSpeakerForm && this.speakerMisCode.toLowerCase() !== 'na') {
      for (let i = 0; i < this.approvedSpeakersFromSheet.length; i++) {
        if (this.approvedSpeakersFromSheet[i].MisCode == this.speakerMisCode) {
          // console.log(this.approvedSpeakers[i])
          index = i;
        }
      }
      this._addedSpeakers.push(this.approvedSpeakersFromSheet[index]);
      this.approvedSpeakersFromSheet.splice(index, 1)
    }

    if (this.showTrainerForm && this.trainerMisCode.toLowerCase() !== 'na') {
      for (let i = 0; i < this.approvedTrainersFromSheet.length; i++) {
        if (this.approvedTrainersFromSheet[i].MisCode == this.trainerMisCode) {
          // console.log(this.approvedTrainersFromSheet[i])
          index = i;
        }
      }
      this._addedTrainers.push(this.approvedTrainersFromSheet[index]);
      this.approvedTrainersFromSheet.splice(index, 1)
    }
    if (this.showOtherForm && this.OtherMisCode.toLowerCase() !== 'na') {
      for (let i = 0; i < this.otherPanelistsFromSheet.length; i++) {
        if (this.otherPanelistsFromSheet[i].MisCode == this.OtherMisCode) {

          index = i;
        }
      }

      this._addedOthers.push(this.otherPanelistsFromSheet[index]);
      this.otherPanelistsFromSheet.splice(index, 1);
    }
  }

  private _addDeletedPanelistsToOption(misCode: string) {
    // console.log(this._addedSpeakers);
    // console.log(this._addedTrainers)

    if (this._addedSpeakers && this._addedSpeakers.find(spk => spk.MisCode == misCode)) {
      this.approvedSpeakersFromSheet.push(this._addedSpeakers.find(speaker => speaker.MisCode == misCode));
      this.approvedSpeakersFromSheet.sort((asp1, asp2) => {
        return asp1.SpeakerName.localeCompare(asp2.SpeakerName)
      })
    }
    else if (this._addedTrainers && this._addedTrainers.find(tra => tra.MisCode == misCode)) {
      this.approvedTrainersFromSheet.push(this._addedTrainers.find(tariner => tariner.MisCode == misCode));
      this.approvedTrainersFromSheet.sort((atr1, atr2) => {
        return atr1.TrainerName.localeCompare(atr2.TrainerName)
      })
    }
    else if (this._addedOthers.find(hcp => hcp.MisCode == misCode)) {
      this.otherPanelistsFromSheet.push(this._addedOthers.find(inv => inv.MisCode == misCode));
      this.otherPanelistsFromSheet.sort((inv1, inv2) => {
        return inv1.HCPName.localeCompare(inv2.HCPName)
      })
    }
  }

  openHCPTableUpdateModal(hcpData: any) {
    const dialogRef = this._dialog.open(ModalComponent, {
      width: '800px',
      data: hcpData
    });

  }

  deletHcp(id: number, panelist: any) {
    this.hcpTableDetails.splice(id, 1);
    this._addDeletedPanelistsToOption(panelist.MisCode);
    // this.isStep4Valid = (this.hcpTableDetails.length > 0) ? true : false;

    // for (let i = 0; i < this.hcpTableDetails.length; i++) {
    //   this.slideKitTableInput.push('slideBrand' + i);
    //   this.slideKitTableRadio.push('radio' + i)
    // }

    let dataToSend = {
      from: 'PanelComponent',
      panelists: this.hcpTableDetails,
      btcSummary: this.BTCSummaryTable,
      bteSummary: this.BTESummaryTable,
      btcTotalAmount: this.BTCTotalAmount,
      bteTotalAmount: this.BTETotalAmount,
      totalPanelAmount: this.totalPanelAmount,
      otherFiles: this._otherFiles,
      deviationFiles: this._deviationFiles
    }

    this._sendDataToParent(dataToSend);
  }
  // File Handling
  onFileSelected(event: any, type: string, control: string) {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {

      if (file.size >= Config.FILE.MIN_SIZE && file.size < Config.FILE.MAX_SIZE) {

        const extension = file.name.split('.')[1];

        const reader = new FileReader();

        // console.log('extension', this._allowedTypes.includes(extension))
        if (this._allowedTypes.indexOf(extension) > -1) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;

            // console.log(base64String)

            if (type == 'deviation') {
              if (control == 'aggregateDeviationUpload') {
                // this.aggregateDeviationFile = base64String.split(',')[1];
                this.aggregateDeviationFile = file.name + ':' + base64String.split(',')[1];
                // console.log(this.aggregateDeviationFile)
              }
              if (control == 'honorariumDeviationUpload') {
                // this._honorariumDeviationFile = base64String.split(',')[1];
                this._honorariumDeviationFile = file.name + ':' + base64String.split(',')[1];
              }
            }

            if (type == 'other') {
              if (control == 'nocUpload') {
                // this._nocFile = base64String.split(',')[1];
                this._nocFile = file.name + ':' + base64String.split(',')[1];
              }
              else if (control == 'fcpaUpload') {
                // this._fcpaFile = base64String.split(',')[1];
                this._fcpaFile = file.name + ':' + base64String.split(',')[1];
              }
              else if (control == 'uploadPAN') {
                // this._panCardFile = base64String.split(',')[1];
                this._panCardFile = file.name + ':' + base64String.split(',')[1];
              }
              else if (control == 'uploadCheque') {
                // this._chequeFile = base64String.split(',')[1];
                this._chequeFile = file.name + ':' + base64String.split(',')[1];
              }
              else if (control == 'uploadTaxResidenceCertificate') {
                // this._taxResidenceFile = base64String.split(',')[1];
                this._taxResidenceFile = file.name + ':' + base64String.split(',')[1];
              }
              else if (control == 'uploadBrochure') {
                // this._brocchureFile = base64String.split(',')[1];
                this._brocchureFile = file.name + ':' + base64String.split(',')[1];
              }
              else if (control == 'internationalSpeakerDocument') {
                // this._internationalSpeakerAgreementFile = base64String.split(',')[1];
                this._internationalSpeakerAgreementFile = file.name + ':' + base64String.split(',')[1];
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
      case 'nocUpload':
        this.rationaleForm.controls.nocUpload.reset();
        break;

      case 'fcpaUpload':
        this.fcpaForm.controls.fcpaUpload.reset();
        break;

      case 'uploadPAN':
        this.benificiaryForm.controls.uploadPAN.reset();
        break;

      case 'uploadCheque':
        this.benificiaryForm.controls.uploadCheque.reset();
        break;

      case 'uploadTaxResidenceCertificate':
        this.internationalBenificiaryForm.controls.uploadTaxResidenceCertificate.reset();
        break;

      case 'aggregateDeviationUpload':
        this.aggregateDeviationForm.controls.aggregateDeviationUpload.reset();
        break;

      case 'internationalSpeakerDocument':
        this.honorariumForm.controls.internationalSpeakerDocument.reset();
        break;

      case 'honorariumDeviationUpload':
        this.honorariumForm.controls.honorariumDeviationUpload.reset();
        break;
    }
  }


  private _pushFiles() {
    if (Boolean(this.aggregateDeviationFile)) this._deviationFiles.push(this.aggregateDeviationFile);
    if (Boolean(this._honorariumDeviationFile)) this._deviationFiles.push(this._honorariumDeviationFile);
    if (Boolean(this._nocFile)) this._otherFiles.push(this._nocFile);
    if (Boolean(this._fcpaFile)) this._otherFiles.push(this._fcpaFile);
    if (Boolean(this._panCardFile)) this._otherFiles.push(this._panCardFile);
    if (Boolean(this._chequeFile)) this._otherFiles.push(this._chequeFile);
    if (Boolean(this._taxResidenceFile)) this._otherFiles.push(this._taxResidenceFile);
    if (Boolean(this._brocchureFile)) this._otherFiles.push(this._brocchureFile);

    // console.log('Other', this._otherFiles);
    // console.log('Deviation', this._deviationFiles)

  }


  private _sendDataToParent(data: any) {
    // console.log('Sent')
    this._utilityService.sendData(data);
  }


  // Benificiary Update Logic:
  public updateBenificiary(type: string) {
    if (type == 'international') {
      this._selectedVendor.for = 'InternationalBenificiaryUpdate'
    }
    else {
      this._selectedVendor.for = 'NormalBenificiaryUpdate'
    }
    const dialogRef = this._dialog.open(ModalComponent, {
      width: '800px',
      data: this._selectedVendor
    });

    console.log(this._selectedVendor)
  }
}

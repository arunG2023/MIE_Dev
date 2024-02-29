import { Component, HostListener, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
//import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, ValidationErrors, Validators } from '@angular/forms';
// import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// import { ModalComponent } from 'src/app/utility/modal/modal.component';
// import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';

// import { Subject, takeUntil } from 'rxjs';
// import { Config } from 'src/app/shared/config/common-config';
// import { ModuleService } from 'src/app/shared/services/event-utility/module.service';
// import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-speaker-code-creation',
  templateUrl: './speaker-code-creation.component.html',
  styleUrls: ['./speaker-code-creation.component.css']
})
export class SpeakerCodeCreationComponent implements OnInit {

  public selectedActionEvent: number

  constructor(private _router: ActivatedRoute) { }

  ngOnInit(): void {
    this._router.queryParams
      .subscribe(params => {
        console.log('params', params['action']);
        this.selectedActionEvent = (params['action'] === 'add' ? 1 : 0)
      }
    );
  }

}

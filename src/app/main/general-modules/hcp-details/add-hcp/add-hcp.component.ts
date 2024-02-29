import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, map, of, takeUntil } from 'rxjs';
import { Config } from 'src/app/shared/config/common-config';
import { ModuleService } from 'src/app/shared/services/event-utility/module.service';
import { UtilityService } from 'src/app/shared/services/event-utility/utility-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

import { ModalComponent } from 'src/app/utility/modal/modal.component';

@Component({
  selector: 'app-add-hcp',
  templateUrl: './add-hcp.component.html',
  styleUrls: ['./add-hcp.component.css']
})
export class AddHcpComponent implements OnInit {

  public sourceFile$ = null;
  public loadingIndicator = false

   // Form group name
  public addHcpForm : FormGroup;
  private _ngUnSubscribe: Subject<void> = new Subject<void>();

  constructor(private _http : HttpClient,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _moduleService: ModuleService) { }

  ngOnInit(): void {
    this.addHcpForm = this._formBuilder.group({
      hcpUpload: ['',Validators.required],
    });

  }

  public FileUpload(fileInput: any): void {

    const source = of(fileInput);
    source
      .pipe(
        map(files => files[0])
      )
      .subscribe(file => {
        this.sourceFile$ = file;
    });
  }

  public submit() {
    this.loadingIndicator = true
    const formData = new FormData();
    const data = {
      enclosure: '"',
      delimiter: ','
    };
   
    formData.append('data', JSON.stringify(data));
    formData.append('file', this.sourceFile$);

    this._moduleService.uploadHcpList(formData)
    .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
    .subscribe(res => {
      this.loadingIndicator = false
      console.log(`Here`, res);
      if(res && res.message) {
        this._snackBarService.showSnackBar(res.message, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS)
      } else {
        this._snackBarService.showSnackBar(Config.HCP_MASTER.ERROR.INVALID_FILE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      }
    },
    err => {
      this.loadingIndicator = false
      if(err['error'] && err['error']['errors']['file'][0]) {
        this._snackBarService.showSnackBar(err['error'] && err['error']['errors']['file'][0], Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      } else {
        this._snackBarService.showSnackBar(Config.HCP_MASTER.ERROR.INVALID_FILE, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.ERROR)
      }
      // console.log(err)
    })
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }  

}

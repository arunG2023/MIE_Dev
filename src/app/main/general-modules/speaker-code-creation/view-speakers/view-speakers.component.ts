import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
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
import { MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { EditSpeakerComponent } from 'src/app/main/general-modules/speaker-code-creation/edit-speaker/edit-speaker.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-speakers',
  templateUrl: './view-speakers.component.html',
  styleUrls: ['./view-speakers.component.css'],
  host: {
    '[style.overflow]': '"auto"'
  }
})
export class ViewSpeakersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchInput: string = '';
  public loadingIndicator = false;

  private _ngUnSubscribe: Subject<void> = new Subject<void>();
  // MatTableDataSource for the saved speaker codes
  savedSpeakerCodesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'sno',
    'misCode',
    'speakerName',
    'specialty',
    'qualification',
    'speakerType',
    'country',
    'speakerCode',
    'speakerCategory',
    'actions',
  ];


  constructor(private _http : HttpClient,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _moduleService: ModuleService) { }

  ngOnInit(): void {

      this._loadSavedSpeakerCodes();
  }


  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }  

  public _loadSavedSpeakerCodes(): void{

    this.loadingIndicator = true;
        // Assuming you have an API service method to get saved speaker codes
    this._moduleService.getApprovedSpeakerCodeCreationDetails().subscribe(
      (savedSpeakerCodes) => {

        this.loadingIndicator = false;
        console.log(['savedSpeakerCodes',savedSpeakerCodes]);
        this.savedSpeakerCodesDataSource.data = savedSpeakerCodes;
        this.savedSpeakerCodesDataSource.paginator = this.paginator;
      },
      (error) => {
        this.loadingIndicator = false;
        console.error('Error loading saved speakers codes:', error);
      }
    );
  }
  // Filter the saved speaker codes based on the search input
  _applySavedSpeakerCodesFilter(filterValue: string) {
    this.savedSpeakerCodesDataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearchInput() {
    // Clear the search input
    this.searchInput = '';
    this._applySavedSpeakerCodesFilter('');
  }  

  editSpeakerCode(speaker): void {
    console.log(speaker);
    const dialogRef = this._dialog.open(EditSpeakerComponent, {
      width: '80%', // Adjust the width as needed
      data: speaker,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Edit Speaker CLOSED");
      //this._loadSavedSpeakerCodes();
      //this.reloadInvitees();
      // Handle the result if needed
    });
  }

}

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
import { EditTrainerComponent } from 'src/app/main/general-modules/trainer-code-creation/edit-trainer/edit-trainer.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-trainers',
  templateUrl: './view-trainers.component.html',
  styleUrls: ['./view-trainers.component.css']
})
export class ViewTrainersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchInput: string = '';
  public loadingIndicator = false;
  private _ngUnSubscribe: Subject<void> = new Subject<void>();
  // MatTableDataSource for the saved speaker codes
  savedTrainerCodesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  
  displayedColumns: string[] = [
    'sno',
    'misCode',
    'trainerName',
    'specialty',
    'qualification',
    'trainerType',
    'country',
    'trainerCode',
    'trainerCategory',
    'actions',
  ];


  constructor(private _http : HttpClient,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _moduleService: ModuleService) { }

  ngOnInit(): void {
      this._loadSavedTrainerCodes();
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }  


  public _loadSavedTrainerCodes(): void{

    this.loadingIndicator = true;
        // Assuming you have an API service method to get saved speaker codes
    this._moduleService.getApprovedTrainerCodeCreationDetails().subscribe(
      (savedTrainerCodes) => {

        this.loadingIndicator = false;
        console.log(['savedTrainerCodes',savedTrainerCodes]);
        this.savedTrainerCodesDataSource.data = savedTrainerCodes;
        this.savedTrainerCodesDataSource.paginator = this.paginator;
      },
      (error) => {
        this.loadingIndicator = false;
        console.error('Error loading saved trainers codes:', error);
      }
    );
  }
  // Filter the saved speaker codes based on the search input
  _applySavedTrainerCodesFilter(filterValue: string) {
    this.savedTrainerCodesDataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearchInput() {
    // Clear the search input
    this.searchInput = '';
    this._applySavedTrainerCodesFilter('');
  }
  editTrainerCode(trainer): void {
    console.log(trainer);
    const dialogRef = this._dialog.open(EditTrainerComponent, {
      width: '80%', // Adjust the width as needed
      data: trainer,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Edit Trainer CLOSED");
      this._loadSavedTrainerCodes();
      //this.reloadInvitees();
      // Handle the result if needed
    });
  }
}

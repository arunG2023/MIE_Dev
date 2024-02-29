import { Component, HostListener, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-view-vendors',
  templateUrl: './view-vendors.component.html',
  styleUrls: ['./view-vendors.component.css']
})
export class ViewVendorsComponent implements OnInit {


  searchInput: string = '';
  public loadingIndicator = false;
  private _ngUnSubscribe: Subject<void> = new Subject<void>();
  // MatTableDataSource for the saved speaker codes
  savedVendorsDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  
  displayedColumns: string[] = [
    'sno',
    'misCode',
    'vendorAccount',
    'benificiaryName',
    'panCardName',
    'bankAccountNumber',
    'ifscCode',
    'swiftCode',
    'ibnNumber',
    //'actions',
  ];


  constructor(private _http : HttpClient,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _moduleService: ModuleService) { }

  ngOnInit(): void {
      this._loadSavedVendors();
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }  


  public _loadSavedVendors(): void{

    this.loadingIndicator = true;
        // Assuming you have an API service method to get saved speaker codes
    this._moduleService.getVendorCreationDetails().subscribe(
      (savedVendors) => {

        this.loadingIndicator = false;
        console.log(['savedVendors',savedVendors]);
        this.savedVendorsDataSource.data = savedVendors;
      },
      (error) => {
        this.loadingIndicator = false;
        console.error('Error loading saved vendors codes:', error);
      }
    );
  }
  // Filter the saved speaker codes based on the search input
  _applySavedVendorsFilter(filterValue: string) {
    this.savedVendorsDataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearchInput() {
    // Clear the search input
    this.searchInput = '';
    this._applySavedVendorsFilter('');
  }
}

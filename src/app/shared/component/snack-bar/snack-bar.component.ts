import { Component, Inject, OnInit } from '@angular/core';

import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent implements OnInit {

  public snackBarRef: MatSnackBarRef<SnackBarComponent>;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  public ngOnInit(): void {
    // console.log(`Here`, this.snackBarRef);
  }

}

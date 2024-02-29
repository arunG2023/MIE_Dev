
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css'],
})
export class ErrorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { errors: string[] },
    private dialogRef: MatDialogRef<ErrorDialogComponent>
  ) {}
  closeDialog(): void {
    this.dialogRef.close();
  }
}
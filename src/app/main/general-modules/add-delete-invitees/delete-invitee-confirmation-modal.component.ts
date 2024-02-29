import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-invitee-confirmation-modal',
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>Are you sure you want to delete this invitee?</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button  class="btn btn-secondary" (click)="dialogRef.close(false)">Cancel</button>
      <button mat-button class="btn btn-danger" (click)="dialogRef.close(true)">Delete</button>
    </mat-dialog-actions>
  `,
})
export class DeleteInviteeConfirmationModalComponent {
  constructor(public dialogRef: MatDialogRef<DeleteInviteeConfirmationModalComponent>) {}
}
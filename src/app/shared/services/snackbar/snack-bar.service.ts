import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarComponent } from "../../component/snack-bar/snack-bar.component";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  
export class SnackBarService {

    constructor(
      private _matSnackBar: MatSnackBar
    ) { }
  
    public showSnackBar(message: string, duration?: number, status?: string): void {
  
      if (message) {
        this._matSnackBar.openFromComponent(SnackBarComponent, {
          data: message,
          panelClass: status,
          duration: (duration ? duration : 2000),
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
  
    }
  
  }
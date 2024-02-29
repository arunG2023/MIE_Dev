import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-masters-list',
  templateUrl: './masters-list.component.html',
  styleUrls: ['./masters-list.component.css']
})
export class MastersListComponent implements OnInit {
  tokenDecode: any;
  userRoles: any;

  constructor(private _router: Router,private auth: AuthService) {
    this.tokenDecode = auth.decodeToken();
    // console.log(this.tokenDecode)
    this.userRoles = this.tokenDecode.role;
   }

  ngOnInit(): void {
  }

  public navAction(action) {
    console.log(action);
    switch(action) {
      case 'add_hcp':
        this._router.navigate(['/master-list/hcp-master'], { queryParams: { action: 'add' }})
        break;
        case 'view_hcp':
          this._router.navigate(['/master-list/hcp-master'], { queryParams: { action: 'view' } })
          break;
        case 'add-speaker':
          this._router.navigate(['/master-list/speaker-code-creation/add-speaker'], { queryParams: { action: 'add' } })
          break;
        case 'view-speakers':
          this._router.navigate(['/master-list/speaker-code-creation/view-speakers'], { queryParams: { action: 'view' } })
          break;
        case 'add-trainer':
          this._router.navigate(['/master-list/trainer-code-creation/add-trainer'], { queryParams: { action: 'add' } })
          break;
        case 'view-trainers':
          this._router.navigate(['/master-list/trainer-code-creation/view-trainers'], { queryParams: { action: 'view' } })
          break;
        case 'add-vendor':
          this._router.navigate(['/master-list/vendor-creation/add-vendor'], { queryParams: { action: 'add' } })
          break;
        case 'view-vendors':
          this._router.navigate(['/master-list/vendor-creation/view-vendors'], { queryParams: { action: 'view' } })
          break;
      default:  
    }
  }

}

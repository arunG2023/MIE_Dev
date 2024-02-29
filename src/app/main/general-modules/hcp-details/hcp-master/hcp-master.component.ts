import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-hcp-master',
  templateUrl: './hcp-master.component.html',
  styleUrls: ['./hcp-master.component.css']
})
export class HcpMasterComponent implements OnInit {

  public selectedActionEvent: number
  tokenDecode: any;
  userRoles: any;
  constructor(private _router: ActivatedRoute,private auth: AuthService) {
    this.tokenDecode = auth.decodeToken();
    this.userRoles = this.tokenDecode.role;
   }

  ngOnInit(): void {
    this._router.queryParams
      .subscribe(params => {
        console.log('params', params['action']);
        this.selectedActionEvent = (params['action'] === 'add' ? 1 : 0)
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-creation',
  templateUrl: './vendor-creation.component.html',
  styleUrls: ['./vendor-creation.component.css']
})
export class VendorCreationComponent implements OnInit {

  public selectedActionEvent: number

  constructor(private _router: ActivatedRoute) { }

  ngOnInit(): void {
    this._router.queryParams
      .subscribe(params => {
        console.log('params', params['action']);
        this.selectedActionEvent = (params['action'] === 'add' ? 1 : 0)
      }
    );
  }

}

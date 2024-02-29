import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trainer-code-creation',
  templateUrl: './trainer-code-creation.component.html',
  styleUrls: ['./trainer-code-creation.component.css']
})
export class TrainerCodeCreationComponent implements OnInit {

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

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-event-bte-btc-summary',
  templateUrl: './pre-event-bte-btc-summary.component.html',
  styleUrls: ['./pre-event-bte-btc-summary.component.css']
})
export class PreEventBteBtcSummaryComponent implements OnInit {

  // declearing the variable for to store BTE data
  @Input() BTESummary: any;
  @Input() BTCSummary: any;

  // BTC summary 
  BTCSummaryTable: any[] = [];
  hpcBTCTotalAmount: number = 0;

  // BTE Summary
  BTESummaryTable: any[] = [];
  hpcBTETotalAmount: number = 0;

  constructor() { }

  ngOnInit(): void {
   

  }
x

}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Config } from 'src/app/shared/config/common-config';
import { ModuleService } from 'src/app/shared/services/event-utility/module.service';

@Component({
  selector: 'app-view-hcp',
  templateUrl: './view-hcp.component.html',
  styleUrls: ['./view-hcp.component.css']
})
export class ViewHcpComponent implements OnInit {
  
  searchInput: string = '';
  private _ngUnSubscribe: Subject<void> = new Subject<void>();
  // MatTableDataSource for the saved HCP Master List
  // public hcpMasterListDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumns: string[] = [
    'sno',
    'HCPName',
    'FirstName',
    'LastName',
    'misCode',
  ];
  public loadingIndicator = false
  public pageRowLimit: number = Config.PAGINATION.ROW_LIMIT
  public hcpMasterListDataSource: any[] = [];
  public hcpMasterListDataSourceFiltered: any[] = [];
  public page: number = 1;
  public searchText: string = ''

  constructor(private _http : HttpClient,
    private _moduleService: ModuleService) { }

  ngOnInit(): void {
      this.loadHcpMasterData();
  }

  public pageChanged(thisPage) {
    this.page = thisPage
  }

  public ngOnDestroy(): void {
    this._ngUnSubscribe.next();
    this._ngUnSubscribe.complete();
  }  

  public editHcp(element) {
    // Edit code
  }

  public loadHcpMasterData(): void{
    this.loadingIndicator = true;
    this._moduleService.getHcpMasterList()
    .pipe(takeUntil(this._ngUnSubscribe.asObservable()))
    .subscribe(res => {
      // console.log(res.length);
      this.loadingIndicator = false;

      let row = 1
      res.forEach(event => {
          event.row = row++
          // this.collection.push(event)
          this.hcpMasterListDataSource.push(event)
      })
      
      
      // const result = res.slice(0,Config.HCP_MASTER.FILTER_LIMIT)
      // if(result.length > 0) {
      //   this.hcpMasterListDataSource.data = result;
      // } else {
      //   this.hcpMasterListDataSource.data = [];
      // }
      console.log(`KKKK`);
      console.log(this.hcpMasterListDataSource);
      this.filterHcpMasterList("");
    })

  }


  clearSearchInput() {
    // Clear the search input
    this.searchInput = '';
    this.filterHcpMasterList('');
  }  
  // Filter the saved HCP Master List based on the search input
  public filterHcpMasterList(filterValue: string) {
    const searchText = filterValue.toLowerCase();
    if(searchText=='')
    {
      this.hcpMasterListDataSourceFiltered = this.hcpMasterListDataSource;
      return;
    }
    this.hcpMasterListDataSourceFiltered = this.hcpMasterListDataSource.filter((speaker) => {

    //console.log(speaker);
      for (const key in speaker) {

    //console.log(key,speaker[key]);
        if (Object.prototype.hasOwnProperty.call(speaker, key)) {
          if(speaker[key])
          {
            const value = speaker[key].toString().toLowerCase();
            if (value.includes(searchText)) {
              return true;
            }
          }
        }
      }
      return false;
    });
    console.log(this.hcpMasterListDataSourceFiltered);
  }

}

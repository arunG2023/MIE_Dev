import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/shared/config/common-config';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles?: string[]; // roles allowed to access the route
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', roles: [] },
    { path: '/new-event-request', title: 'New Event Request',  icon:'post_add', class: '', roles: ['ABM','KAM','SALES HEAD','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },
    { path: '/honararium-payment-request', title: 'Honararium Payment Request',  icon:'post_add', class: '', roles: ['ABM','KAM','SALES HEAD','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },
    { path: '/post-event-settlement', title: 'Post Event Settlement Request',  icon:'post_add', class: '', roles: ['ABM','KAM','SALES HEAD','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },
    { path: '/post-event-follow-up', title: ' Post Event Follow Up',  icon:'post_add', class: '', roles: ['ABM','KAM','SALES HEAD','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },
    { path: '/view-event-list', title: 'View Event Requests',  icon:'event', class: '', roles: ['ABM','KAM','SALES HEAD','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },
    { path: '/view-pre-event-list', title: 'View Pre Event Requests',  icon:'event', class: '', roles: ['AM','RBM','BM'] },
    { path: '/view-honararium-event-list', title: 'View Honararium Event Requests',  icon:'event', class: '', roles: ['AM','RBM','BM'] },
    { path: '/post-event-list', title: 'View Post Event Requests',  icon:'event', class: '', roles: ['AM','RBM','BM'] },    
    // { path: '/view-honararium-list', title: 'View Honararium Payment Request',  icon:'event', class: '' },
    // { path: '/post-event-list', title: 'View Post Event Settlement Request',  icon:'event', class: '' },
    // { path: '/add-employees', title: 'Add Roles',  icon:'perm_contact_calendar', class: '' },

      // Added by Sunil
      // { path: '/hcp-master', title: 'HCP Master',  icon:'post_add', class: '' },
      { path: '/master-list', title: 'Add/New Masters',  icon:'post_add', class: '' },
    
    //For Speaker Code Creation
     //{ path: '/speaker-code-creation', title: 'Speaker Code Creation',  icon:'post_add', class: '', roles: ['AM','ABM','KAM','SALES HEA','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },
    //For trainer  Code Creation
     //{ path: '/trainer-code-creation', title: 'Trainer Code Creation',  icon:'post_add', class: '', roles: ['AM','ABM','KAM','SALES HEA','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },     
      //{ path: '/speaker_code_creation/view-speakers', title: 'View Existing Speakers',  icon:'post_add', class: '', roles: ['ABM','KAM','SALES HEA','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },
     // { path: '/speaker_code_creation/add-speaker', title: 'Add New Speaker',  icon:'post_add', class: '', roles: ['ABM','KAM','SALES HEA','MARKETING HEAD','FINANCE ACCOUNTS','FINANCE TREASURY','COMPLIANCE'] },
     { path: 'finance-payment', title: 'Finanace Accounts',  icon:'post_add', class: '',roles: ['FINANCE ACCOUNTS']  },
    //  { path: '/FinanceposteventComponent', title: 'Post Event Settlement',  icon:'post_add', class: '' },

     { path: '/finance-treasury', title: 'Finance Treasury', icon: 'assignment', class: '', roles: ['FINANCE TREASURY'] },
    //  { path: 'Honararium payment', title: 'Honararium Finance Account',  icon:'post_add', class: '' },
    //  { path: '/FinanceposteventComponent', title: 'Post Event Settlement',  icon:'post_add', class: ''},
    ];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems!: any[];
  userPayload: any;
  userRoles: string ;

  // Private
  public username: string
  public userrole:string

  constructor(private auth: AuthService,
    private _snackBarService : SnackBarService) { 
    this.userPayload = auth.decodeToken();
    this.userRoles = this.userPayload.role;
  }

  ngOnInit() {

    this.auth.getUserDetails$
    .subscribe(res => {
        if(res) {
            this.username = res.unique_name
            this.userrole = res.role
        }        
    })

    this.menuItems = ROUTES.filter((menuItem) => 
        (!menuItem.roles || menuItem.roles.length === 0 || menuItem.roles.some((role) => this.userRoles.toLowerCase().includes(role.toLowerCase())))
      );
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

   // Log Out method
   logOut(){
    this.auth.logOut();
    this._snackBarService.showSnackBar(Config.MESSAGE.SUCCESS.LOG_OUT, Config.SNACK_BAR.DELAY, Config.SNACK_BAR.SUCCESS);
  }
}

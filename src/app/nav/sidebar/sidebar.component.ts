import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/new-event-request', title: 'New Event Request',  icon:'post_add', class: '' },
    { path: '/honararium-payment-request', title: 'New Honararium Payment Request',  icon:'post_add', class: '' },
    { path: '/post-event-settlement', title: 'New Post Event Settlement Request',  icon:'post_add', class: '' },
    { path: '/view-event-list', title: 'View Event Requests',  icon:'event', class: '' },
    { path: '/view-honararium-list', title: 'View Honararium Payment Request',  icon:'event', class: '' },
    { path: '/post-event-list', title: 'View Post Event Settlement Request',  icon:'event', class: '' },
    { path: '/add-employees', title: 'Add Roles',  icon:'perm_contact_calendar', class: '' },
    
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems!: any[];

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
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
}
}

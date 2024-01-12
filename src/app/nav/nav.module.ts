import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';

import {MatMenuModule} from '@angular/material/menu';




@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    RouterModule
  ],
  exports : [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    
  ]
})
export class NavModule { }

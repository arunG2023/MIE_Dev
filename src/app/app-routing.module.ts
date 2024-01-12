import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

// import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { LoginComponent } from './login/login.component';

const routes: Routes =[
  {
    path: '',
    component: LoginComponent
  }, {
    path: '',
    component: PublicLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./public-layout/public-layout.module').then(m => m.PublicLayoutModule) 
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }

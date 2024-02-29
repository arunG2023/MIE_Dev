import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
// import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';

import { NavModule } from './nav/nav.module';
import { PublicLayoutComponent } from './layout/public-layout.component';
import { LoginComponent } from './login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSnackBarModule } from '@angular/material/snack-bar'
import { SnackBarComponent } from './shared/component/snack-bar/snack-bar.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiInterceptor } from './shared/interceptors/api.interceptor';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NavModule,
    RouterModule,
    AppRoutingModule,

     // Added by Sunil
     MatSnackBarModule,
     MatTooltipModule,
     MatProgressSpinnerModule
    
  ],
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    LoginComponent,

    // Added by Sunil
    SnackBarComponent,
    

  ],
  providers: [
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    // {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

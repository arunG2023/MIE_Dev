import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
// import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';

import { NavModule } from './nav/nav.module';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { LoginComponent } from './login/login.component';



@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NavModule,
    RouterModule,
    AppRoutingModule
    
  ],
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    LoginComponent

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

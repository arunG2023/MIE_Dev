import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AdminLayoutRoutes } from './admin-layout.routing';
import { PublicLayoutRoutes } from './public-layout-routing.module';


// Material Importss
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatStepperModule} from '@angular/material/stepper';
import { MatRadioModule} from '@angular/material/radio'




// // New Componenets

import { DashboardComponent } from '../dashboard/dashboard.component';
import { NewEventRequestComponent } from '../new-event-request/new-event-request.component';
import { HonarariumListComponent } from '../honararium-list/honararium-list.component';
import { PostEventListComponent } from '../post-event-list/post-event-list.component';
import { PostEventSettlementComponent } from '../post-event-settlement/post-event-settlement.component';
import { EventListComponent } from '../event-list/event-list.component';
import { HonarariumPaymentRequestComponent } from '../honararium-payment-request/honararium-payment-request.component';

// Under Dev
import { AddEmployeesComponent } from '../add-employees/add-employees.component';
import { UtilityModule } from '../utility/utility.module';

import { Class1EventRequestComponent } from '../event-request-form/class1-event-request/class1-event-request.component';
import { WebinarEventRequestComponent } from '../event-request-form/webinar-event-request/webinar-event-request.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PublicLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatRadioModule,
    UtilityModule
  ],
  declarations: [
    DashboardComponent,
    NewEventRequestComponent,
    HonarariumPaymentRequestComponent,
    PostEventSettlementComponent,
    EventListComponent,
    HonarariumListComponent,
    PostEventListComponent,
    AddEmployeesComponent,
    Class1EventRequestComponent,
    WebinarEventRequestComponent
    
  ]
})

export class PublicLayoutModule {}

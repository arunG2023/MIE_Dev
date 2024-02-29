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
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

// Added by Sunil
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

// Added by Alhad
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

//toastr module



// // New Componenets

import { DashboardComponent } from '../main/dashboard/dashboard.component';
import { NewEventRequestComponent } from '../main/new-event-request/new-event-request.component';
import { HonarariumListComponent } from '../main/honararium-list/honararium-list.component';
import { PostEventListComponent } from '../main/post-event-list/post-event-list.component';
import { PostEventSettlementComponent } from '../main/post-event-settlement/post-event-settlement.component';
import { EventListComponent } from '../main/event-list/event-list.component';
import { HonarariumPaymentRequestComponent } from '../main/honararium-payment-request/honararium-payment-request.component';


// Under Dev
import { AddEmployeesComponent } from '../main/add-employees/add-employees.component';
import { UtilityModule } from '../utility/utility.module';

import { Class1EventRequestComponent } from '../main/event-request-form/class1-event-request/class1-event-request.component';
import { StallFabricationEventRequestComponent } from '../main/event-request-form/stall-fabrication-event-request/stall-fabrication-event-request/stall-fabrication-event-request.component';
import { WebinarEventRequestComponent } from '../main/event-request-form/webinar-event-request/webinar-event-request.component';
import { Class1HonorariumRequestComponent } from '../main/event-honorarium-request/class1-honorarium-request/class1-honorarium-request.component';
import { WebinarHonorariumRequestComponent } from '../main/event-honorarium-request/webinar-honorarium-request/webinar-honorarium-request.component';
import { Class1PostEventSettlementComponent } from '../main/post-event-settlement-requests/class1-post-event-settlement/class1-post-event-settlement.component';
import { WebinarPostEventSettlementComponent } from '../main/post-event-settlement-requests/webinar-post-event-settlement/webinar-post-event-settlement.component';

import { SpeakerCodeCreationComponent } from '../main/general-modules/speaker-code-creation/speaker-code-creation.component';
import { AddSpeakerComponent } from '../main/general-modules/speaker-code-creation/add-speaker/add-speaker.component';
import { ViewSpeakersComponent } from '../main/general-modules/speaker-code-creation/view-speakers/view-speakers.component';

import { TrainerCodeCreationComponent } from '../main/general-modules/trainer-code-creation/trainer-code-creation.component';
import { AddTrainerComponent } from '../main/general-modules/trainer-code-creation/add-trainer/add-trainer.component';
import { ViewTrainersComponent } from '../main/general-modules/trainer-code-creation/view-trainers/view-trainers.component';

import { PreEventListComponent } from '../main/pre-event-list/pre-event-list.component';
import { HonorariumEventListComponent } from '../main/honorarium-event-list/honorarium-event-list.component';

import { HcpConsultantsEventRequestComponent } from '../main/event-request-form/hcp-consultants-event-request/hcp-consultants-event-request.component';
import { EventPendingComponent } from '../shared/component/event-pending/event-pending.component';
// Added by Sunil
import { AddHcpComponent } from '../main/general-modules/hcp-details/add-hcp/add-hcp.component';
import { ViewHcpComponent } from '../main/general-modules/hcp-details/view-hcp/view-hcp.component';
import { HcpMasterComponent } from '../main/general-modules/hcp-details/hcp-master/hcp-master.component';
import { SpinnerLoaderComponent } from '../shared/component/spinner-loader/spinner-loader.component';
import { MastersListComponent } from '../main/general-modules/masters-list/masters-list.component';
import { PostEventFollowUpComponent } from '../main/post-event-follow-up/post-event-follow-up.component';
import { HcpPostEventFollowUpComponent } from '../main/post-event-follow-up/hcp-post-event-follow-up/hcp-post-event-follow-up.component';
import {NgxPaginationModule} from 'ngx-pagination';

import { VendorCreationComponent } from '../main/general-modules/vendor-creation/vendor-creation.component';
import { AddVendorComponent } from '../main/general-modules/vendor-creation/add-vendor/add-vendor.component';
import { ViewVendorsComponent } from '../main/general-modules/vendor-creation/view-vendors/view-vendors.component';
import { StallPosteventsettlementComponent } from '../main/post-event-settlement-requests/stall-posteventsettlement/stall-posteventsettlement.component';


import { MedicalUtilityRequestComponent } from '../main/event-request-form/medical-utility-request/medical-utility-request.component';

// Added by Arun
import { HcpPostEventSettlementComponent } from '../main/post-event-settlement-requests/hcp-post-event-settlement/hcp-post-event-settlement.component';
import { MedicalUtilityPostEventSettlementComponent } from '../main/post-event-settlement-requests/medical-utility-post-event-settlement/medical-utility-post-event-settlement.component';
import { Class2EventRequestComponent } from '../main/event-request-form/class2-event-request/class2-event-request.component';
import { PostEventDataFollowUpComponent } from '../main/post-event-follow-up/post-event-data-follow-up/post-event-data-follow-up.component';
import { HonarariumPaymentComponent } from '../main/honararium-payment/honararium-payment.component';
import { FinanceposteventComponent } from '../main/financepostevent/financepostevent.component';
import { FinanceTreasuryComponent } from '../main/finance-treasury/finance-treasury.component';

import { AddInviteeModalComponent } from '../main/general-modules/add-delete-invitees/add-invitee-modal.component';
import { DeleteInviteeConfirmationModalComponent } from '../main/general-modules/add-delete-invitees/delete-invitee-confirmation-modal.component';
import { PanelSelectionComponent } from '../shared/component/panel-selection/panel-selection.component';
import { InviteeSelectionComponent } from '../shared/component/invitee-selection/invitee-selection.component';
import { PostEventSettlementInviteesSummaryComponent } from '../shared/component/post-event-settlement-invitees-summary/post-event-settlement-invitees-summary.component';
import { PostEventSettlementExpenseSummaryComponent } from '../shared/component/post-event-settlement-expense-summary/post-event-settlement-expense-summary.component';

import { EditTrainerComponent } from '../main/general-modules/trainer-code-creation/edit-trainer/edit-trainer.component';
import { EditSpeakerComponent } from '../main/general-modules/speaker-code-creation/edit-speaker/edit-speaker.component';
import { ErrorDialogComponent } from '../main/general-modules/error-dialog/error-dialog.component';

import { PreEventBteBtcSummaryComponent } from '../shared/component/pre-event-bte-btc-summary/pre-event-bte-btc-summary.component';
import { PostEventSettlementOtherDeviationComponent } from '../shared/component/post-event-settlement-other-deviation/post-event-settlement-other-deviation.component';


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
    UtilityModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,

    // Added by Sunil
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,

    // Added By Alhad
    MatDatepickerModule,
    MatNativeDateModule,

    
    
    
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
    StallFabricationEventRequestComponent,
    WebinarEventRequestComponent,
    Class1HonorariumRequestComponent,
    WebinarHonorariumRequestComponent,
    Class1PostEventSettlementComponent,
    WebinarPostEventSettlementComponent,
    HcpConsultantsEventRequestComponent,

     // Added by Sunil
    //  HcpAddComponent,
    PostEventFollowUpComponent,
    HcpPostEventFollowUpComponent,
    PostEventDataFollowUpComponent,

     //Added by jasper
     EventPendingComponent,
     StallPosteventsettlementComponent,
     HcpMasterComponent,
     AddHcpComponent,
     ViewHcpComponent,
     SpinnerLoaderComponent,
     MastersListComponent,
     HonarariumPaymentComponent,
     FinanceposteventComponent,

     // Added by Alhad
     PreEventListComponent,
     HonorariumEventListComponent,
     SpeakerCodeCreationComponent,
     AddSpeakerComponent,
     ViewSpeakersComponent,     
     TrainerCodeCreationComponent,
     AddTrainerComponent,
     ViewTrainersComponent,     
     VendorCreationComponent,
     AddVendorComponent,
     ViewVendorsComponent,
     MedicalUtilityRequestComponent,
     AddInviteeModalComponent,
     DeleteInviteeConfirmationModalComponent,

    //  Added by Arun
    HcpPostEventSettlementComponent,
    MedicalUtilityPostEventSettlementComponent,
    Class2EventRequestComponent,
    FinanceTreasuryComponent,
    PostEventSettlementInviteesSummaryComponent,
    PostEventSettlementExpenseSummaryComponent,

    // Shared Step Components
    PanelSelectionComponent,
    InviteeSelectionComponent,

    EditTrainerComponent,
    EditSpeakerComponent,
    ErrorDialogComponent,

    PreEventBteBtcSummaryComponent,
    PostEventSettlementOtherDeviationComponent
    

    
  ]
})

export class PublicLayoutModule {}

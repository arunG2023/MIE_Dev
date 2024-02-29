import { Routes } from '@angular/router';




// New Componenets
// import { New } from 'app/new-event-request/new-event-request.component';
// import { HonarariumPaymentRequestComponent } from 'app/honararium-payment-request/honararium-payment-request.component';
// import { PostEventSettlementComponent } from 'app/post-event-settlement/post-event-settlement.component';
// import { EventListComponent } from 'app/event-list/event-list.component';
// import { HonarariumListComponent } from 'app/honararium-list/honararium-list.component';
// import { PostEventListComponent } from 'app/post-event-list/post-event-list.component';
// import { AuthGuard } from 'app/guards/auth.guard';

import { DashboardComponent } from '../main/dashboard/dashboard.component';
import { NewEventRequestComponent } from '../main/new-event-request/new-event-request.component';
import { HonarariumListComponent } from '../main/honararium-list/honararium-list.component';
import { HonarariumPaymentRequestComponent } from '../main/honararium-payment-request/honararium-payment-request.component';
import { PostEventListComponent } from '../main/post-event-list/post-event-list.component';
import { PostEventSettlementComponent } from '../main/post-event-settlement/post-event-settlement.component';
import { EventListComponent } from '../main/event-list/event-list.component';
import { PreEventListComponent } from '../main/pre-event-list/pre-event-list.component';
import { SpeakerCodeCreationComponent } from '../main/general-modules/speaker-code-creation/speaker-code-creation.component';
import { AddSpeakerComponent } from '../main/general-modules/speaker-code-creation/add-speaker/add-speaker.component';
import { EditSpeakerComponent } from '../main/general-modules/speaker-code-creation/edit-speaker/edit-speaker.component';
import { ViewSpeakersComponent } from '../main/general-modules/speaker-code-creation/view-speakers/view-speakers.component';
import { TrainerCodeCreationComponent } from '../main/general-modules/trainer-code-creation/trainer-code-creation.component';
import { AddTrainerComponent } from '../main/general-modules/trainer-code-creation/add-trainer/add-trainer.component';
import { EditTrainerComponent } from '../main/general-modules/trainer-code-creation/edit-trainer/edit-trainer.component';
import { ViewTrainersComponent } from '../main/general-modules/trainer-code-creation/view-trainers/view-trainers.component';
import { HonorariumEventListComponent } from '../main/honorarium-event-list/honorarium-event-list.component';
import { AddEmployeesComponent } from '../main/add-employees/add-employees.component';
import { AuthGuard } from '../shared/routeguard/auth.guard';
import { Class1HonorariumRequestComponent } from '../main/event-honorarium-request/class1-honorarium-request/class1-honorarium-request.component';
import { Class1PostEventSettlementComponent } from '../main/post-event-settlement-requests/class1-post-event-settlement/class1-post-event-settlement.component';
import { WebinarHonorariumRequestComponent } from '../main/event-honorarium-request/webinar-honorarium-request/webinar-honorarium-request.component';
import { WebinarPostEventSettlementComponent } from '../main/post-event-settlement-requests/webinar-post-event-settlement/webinar-post-event-settlement.component';
import { HcpPostEventSettlementComponent } from '../main/post-event-settlement-requests/hcp-post-event-settlement/hcp-post-event-settlement.component';
import { MedicalUtilityPostEventSettlementComponent } from '../main/post-event-settlement-requests/medical-utility-post-event-settlement/medical-utility-post-event-settlement.component';
import { PostEventFollowUpComponent } from '../main/post-event-follow-up/post-event-follow-up.component';
import { HonarariumPaymentComponent } from '../main/honararium-payment/honararium-payment.component';
import { FinanceposteventComponent } from '../main/financepostevent/financepostevent.component';
import { FinanceTreasuryComponent } from '../main/finance-treasury/finance-treasury.component';




export const PublicLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'new-event-request', component: NewEventRequestComponent, canActivate: [AuthGuard] },
  { path: 'view-event-list', component: EventListComponent, canActivate: [AuthGuard] },
  { path: 'view-pre-event-list', component: PreEventListComponent, canActivate: [AuthGuard] },
  { path: 'view-honararium-event-list', component: HonorariumEventListComponent, canActivate: [AuthGuard] },
  { path: 'view-honararium-list', component: HonarariumListComponent, canActivate: [AuthGuard] },
  { path: 'post-event-list', component: PostEventListComponent, canActivate: [AuthGuard] },
  { path: 'add-employees', component: AddEmployeesComponent, canActivate: [AuthGuard] },
  { path: 'finance-payment', component: HonarariumPaymentComponent,canActivate: [AuthGuard] },
  // { path: 'FinanceposteventComponent', component: FinanceposteventComponent },
  
  { path: 'finance-treasury', component: FinanceTreasuryComponent, canActivate: [AuthGuard]},

  // Added by Sunil
  {
    path: 'master-list', children: [
      {
        path: '',
        loadChildren: () => import('../main/general-modules/masters-list/masters-list.module').then(m => m.MastersListModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'post-event-follow-up', children: [
      {
        path: '',
        loadChildren: () => import('../main/post-event-follow-up/post-event-follow-up.module').then(m => m.PostEventFollowUpModule),
        canActivate: [AuthGuard]
      }
    ]
  },

  // Added by Arun

  // Routing For Honorarium Payment
  {
    path: 'honararium-payment-request', children: [
      {
        path: '',
        loadChildren: () => import('../main/honararium-payment-request/honorarium-payment-request-module/honorarium-payment-request-module.module').then(m => m.HonorariumPaymentRequestModuleModule),
        canActivate: [AuthGuard]
      }
    ]
  },

  // Routing For Event Settlement
  {
    path: 'post-event-settlement', children: [
      {
        path: '',
        loadChildren: () => import('../main/post-event-settlement/post-event-settlement-module/post-event-settlement-module.module').then(m => m.PostEventSettlementModuleModule),
        canActivate: [AuthGuard]
      }
    ]
  }




];



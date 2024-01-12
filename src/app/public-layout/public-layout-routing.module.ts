import { Routes } from '@angular/router';

// import { DashboardComponent } from '../../dashboard/dashboard.component';



// New Componenets
// import { New } from 'app/new-event-request/new-event-request.component';
// import { HonarariumPaymentRequestComponent } from 'app/honararium-payment-request/honararium-payment-request.component';
// import { PostEventSettlementComponent } from 'app/post-event-settlement/post-event-settlement.component';
// import { EventListComponent } from 'app/event-list/event-list.component';
// import { HonarariumListComponent } from 'app/honararium-list/honararium-list.component';
// import { PostEventListComponent } from 'app/post-event-list/post-event-list.component';
// import { AuthGuard } from 'app/guards/auth.guard';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { NewEventRequestComponent } from '../new-event-request/new-event-request.component';
import { HonarariumPaymentRequestComponent } from '../honararium-payment-request/honararium-payment-request.component';
import { PostEventListComponent } from '../post-event-list/post-event-list.component';
import { PostEventSettlementComponent } from '../post-event-settlement/post-event-settlement.component';
import { EventListComponent } from '../event-list/event-list.component';
import { HonarariumListComponent } from '../honararium-list/honararium-list.component';

import { AuthGuard } from '../guard/auth.guard';
import { AddEmployeesComponent } from '../add-employees/add-employees.component';

export const PublicLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard] },
    { path: 'new-event-request', component: NewEventRequestComponent,canActivate:[AuthGuard]  },
    { path: 'honararium-payment-request', component: HonarariumPaymentRequestComponent,canActivate:[AuthGuard]  },
    { path: 'post-event-settlement', component: PostEventSettlementComponent,canActivate:[AuthGuard]   },
    { path: 'view-event-list', component: EventListComponent,canActivate:[AuthGuard]   },
    { path: 'view-honararium-list', component: HonarariumListComponent,canActivate:[AuthGuard]  },
    { path: 'post-event-list', component: PostEventListComponent,canActivate:[AuthGuard]  },
    { path: 'add-employees' , component: AddEmployeesComponent, canActivate:[AuthGuard]}
  

];



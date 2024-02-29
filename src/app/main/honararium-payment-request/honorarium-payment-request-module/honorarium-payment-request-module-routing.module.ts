import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HonarariumPaymentRequestComponent } from '../honararium-payment-request.component';
import { Class1HonorariumRequestComponent } from '../../event-honorarium-request/class1-honorarium-request/class1-honorarium-request.component';
import { WebinarHonorariumRequestComponent } from '../../event-honorarium-request/webinar-honorarium-request/webinar-honorarium-request.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', component: HonarariumPaymentRequestComponent},
  { path: 'honararium-request', component : Class1HonorariumRequestComponent},
  { path: 'honararium-request-webinar', component : WebinarHonorariumRequestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HonorariumPaymentRequestModuleRoutingModule { }

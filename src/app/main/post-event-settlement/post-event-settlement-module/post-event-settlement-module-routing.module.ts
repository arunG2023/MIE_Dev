import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostEventSettlementComponent } from '../post-event-settlement.component';
import { Class1PostEventSettlementComponent } from '../../post-event-settlement-requests/class1-post-event-settlement/class1-post-event-settlement.component';
import { HcpPostEventSettlementComponent } from '../../post-event-settlement-requests/hcp-post-event-settlement/hcp-post-event-settlement.component';
import { MedicalUtilityPostEventSettlementComponent } from '../../post-event-settlement-requests/medical-utility-post-event-settlement/medical-utility-post-event-settlement.component';
import { WebinarPostEventSettlementComponent } from '../../post-event-settlement-requests/webinar-post-event-settlement/webinar-post-event-settlement.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: PostEventSettlementComponent},
  { path: 'event-settlement', component : Class1PostEventSettlementComponent},
  { path: 'event-settlement-webinar', component : WebinarPostEventSettlementComponent},
  { path: 'event-settlement-hcp-consultants', component: HcpPostEventSettlementComponent},
  { path: 'event-settlement-medical-utility', component: MedicalUtilityPostEventSettlementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostEventSettlementModuleRoutingModule { }

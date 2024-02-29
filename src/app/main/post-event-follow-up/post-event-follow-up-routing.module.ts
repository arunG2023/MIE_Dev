import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostEventFollowUpComponent } from './post-event-follow-up.component';
import { HcpPostEventSettlementComponent } from '../post-event-settlement-requests/hcp-post-event-settlement/hcp-post-event-settlement.component';
import { HcpPostEventFollowUpComponent } from './hcp-post-event-follow-up/hcp-post-event-follow-up.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: PostEventFollowUpComponent},
  {path: 'hcp-consultant', component: HcpPostEventFollowUpComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostEventFollowUpRoutingModule { }

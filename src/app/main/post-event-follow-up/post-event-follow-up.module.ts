import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostEventFollowUpRoutingModule } from './post-event-follow-up-routing.module';
import { PostEventDataFollowUpComponent } from './post-event-data-follow-up/post-event-data-follow-up.component';


@NgModule({
  declarations: [
    // PostEventDataFollowUpComponent
  ],
  imports: [
    CommonModule,
    PostEventFollowUpRoutingModule
  ]
})
export class PostEventFollowUpModule { }

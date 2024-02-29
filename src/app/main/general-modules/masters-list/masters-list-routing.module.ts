import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MastersListComponent } from './masters-list.component';
import { HcpMasterComponent } from '../hcp-details/hcp-master/hcp-master.component';

import { SpeakerCodeCreationComponent } from '../speaker-code-creation/speaker-code-creation.component';
import { AddSpeakerComponent } from '../speaker-code-creation/add-speaker/add-speaker.component';
import { ViewSpeakersComponent } from '../speaker-code-creation/view-speakers/view-speakers.component';

import { TrainerCodeCreationComponent } from '../trainer-code-creation/trainer-code-creation.component';
import { AddTrainerComponent } from '../trainer-code-creation/add-trainer/add-trainer.component';
import { ViewTrainersComponent } from '../trainer-code-creation/view-trainers/view-trainers.component';
import { VendorCreationComponent } from '../vendor-creation/vendor-creation.component';
import { AddVendorComponent } from '../vendor-creation/add-vendor/add-vendor.component';
import { ViewVendorsComponent } from '../vendor-creation/view-vendors/view-vendors.component';


const routes: Routes = [  
  {path: 'hcp-master', component: HcpMasterComponent},
  {path: '', pathMatch: 'full', component: MastersListComponent},
  { path: 'speaker-code-creation' , component: SpeakerCodeCreationComponent, children: [
          { path: 'view-speakers', component: ViewSpeakersComponent},
          { path: 'add-speaker', component: AddSpeakerComponent}
        ]
  },  
  { path: 'trainer-code-creation' , component: TrainerCodeCreationComponent, children: [
      { path: 'view-trainers', component: ViewTrainersComponent},
      { path: 'add-trainer', component: AddTrainerComponent}
    ]
  },  
  { path: 'vendor-creation' , component: VendorCreationComponent, children: [
      { path: 'view-vendors', component: ViewVendorsComponent},
      { path: 'add-vendor', component: AddVendorComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersListRoutingModule { }

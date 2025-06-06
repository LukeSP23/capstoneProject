import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditFormPageRoutingModule } from './edit-form-routing.module';

import { EditFormPage } from './edit-form.page';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditFormPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditFormPage]
})
export class EditFormPageModule {}

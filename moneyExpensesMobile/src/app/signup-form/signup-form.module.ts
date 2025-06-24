import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupFormPageRoutingModule } from './signup-form-routing.module';

import { SignupFormPage } from './signup-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupFormPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SignupFormPage]
})
export class SignupFormPageModule {}

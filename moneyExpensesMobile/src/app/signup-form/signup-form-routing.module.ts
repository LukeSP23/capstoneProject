import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupFormPage } from './signup-form.page';

const routes: Routes = [
  {
    path: '',
    component: SignupFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupFormPageRoutingModule {}

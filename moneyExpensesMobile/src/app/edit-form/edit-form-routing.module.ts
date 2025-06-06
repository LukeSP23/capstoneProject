import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditFormPage } from './edit-form.page';

const routes: Routes = [
  {
    path: '',
    component: EditFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditFormPageRoutingModule {}

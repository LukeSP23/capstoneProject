import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BalanceComponent } from './balance/balance.component';
import { FormComponent } from './form/form.component';
import { EditFormComponent } from './edit-form/edit-form.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'balance', component: BalanceComponent },
  { path: 'form', component: FormComponent },
  {path: 'edit-form', component: EditFormComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

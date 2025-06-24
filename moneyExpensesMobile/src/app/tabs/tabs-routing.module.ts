import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { Tab3Page } from '../tab3/tab3.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'Home',
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'Balance',
        loadChildren: () =>
          import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'tabs/Into-Pocket--Out-of-Pocket/:trans_id',
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
      },
      {
        path: 'Into-Pocket--Out-of-Pocket',
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
      },
      {
        path: 'Login',
        loadChildren: () =>
          import('../login-form/login-form.module').then((m) => m.LoginFormPageModule),
      },
       {
        path: 'Signup',
        loadChildren: () =>
          import('../signup-form/signup-form.module').then((m) => m.SignupFormPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/Home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/Home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

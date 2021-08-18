import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// app layout components
import { AppLayoutComponent } from './components/layout/app-layout/app-layout.component';

// authentication guard
import { AuthGuard } from './_helpers';

// app modules
const homeModule = () => import('./components/home/home.module').then(x => x.HomeModule);
const authModule = () => import('./components/auth/auth.module').then(x => x.AuthModule);
const storeModule = () => import('./components/store/store.module').then(x => x.StoreModule);

// app routes
const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      // { path: '', loadChildren: homeModule, canActivate: [AuthGuard] },
      { path: '', loadChildren: homeModule },
      { path: '', loadChildren: authModule },
      { path: 'store', loadChildren: storeModule },

      // otherwise redirect on the basis of authentication
      { path: '**', redirectTo: '' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

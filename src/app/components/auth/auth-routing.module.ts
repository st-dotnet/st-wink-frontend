import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@app/_helpers/can-deactivate-guard';
import { AccountSettingComponent } from '../account-setting/account-setting.component';


// auth components
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

// auth routes
const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent,canDeactivate: [CanDeactivateGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password/:id', component: ForgotPasswordComponent },
  { path: 'accountSetting', component: AccountSettingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
 export class AuthRoutingModule { }

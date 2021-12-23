import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@app/_helpers/can-deactivate-guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AddressesComponent } from './account-settings/addresses/addresses.component';
import { LoyaltyPointsComponent } from './account-settings/loyalty-points/loyalty-points.component';
import { OrdersComponent } from './account-settings/orders/orders.component';
import { PaymentsComponent } from './account-settings/payments/payments.component';
import { ProfileComponent } from './account-settings/profile/profile.component';
import { SubscriptionsComponent } from './account-settings/subscriptions/subscriptions.component';




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
  { path: 'accountSettings', redirectTo: 'profile', component: AccountSettingsComponent,},
  { path: 'account-settings/profile', component: ProfileComponent },
  { path: 'account-settings/addresses', component: AddressesComponent },
  { path: 'account-settings/orders', component: OrdersComponent },
  { path: 'account-settings/loyaltypoints', component: LoyaltyPointsComponent },
  { path: 'account-settings/subscriptions', component: SubscriptionsComponent },
  { path: 'account-settings/payments', component: PaymentsComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
 export class AuthRoutingModule { }

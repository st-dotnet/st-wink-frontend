import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/_helpers/auth.guard';
import { CanDeactivateGuard } from '@app/_helpers/can-deactivate-guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AddressesComponent } from './account-settings/addresses/addresses.component';
import { InvoiceComponent } from './account-settings/invoice/invoice.component';

import { LoyaltyPointsComponent } from './account-settings/loyalty-points/loyalty-points.component';
import { OrdersComponent } from './account-settings/orders/orders.component';
import { PaymentsComponent } from './account-settings/payments/payments.component';

import { ProfileComponent } from './account-settings/profile/profile.component';
import { EditSubscriptionsComponent } from './account-settings/subscriptions/edit-subscriptions/edit-subscriptions.component';
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
  { path: 'accountSettings', redirectTo: 'profile', component: AccountSettingsComponent,canActivate: [AuthGuard]},
  { path: 'account-settings/profile', component: ProfileComponent,canActivate: [AuthGuard] },
  { path: 'account-settings/addresses', component: AddressesComponent,canActivate: [AuthGuard] },
  { path: 'account-settings/orders', component: OrdersComponent,canActivate: [AuthGuard] },
  { path: 'account-settings/loyaltypoints', component: LoyaltyPointsComponent,canActivate: [AuthGuard] },
  { path: 'account-settings/subscriptions', component: SubscriptionsComponent,canActivate: [AuthGuard] },
  { path: 'account-settings/subscriptions/edit-subscription', component: EditSubscriptionsComponent },
  { path: 'account-settings/payments', component: PaymentsComponent,canActivate: [AuthGuard] },
  { path: 'invoice/:id', component: InvoiceComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
 export class AuthRoutingModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

// auth routing module
import { AuthRoutingModule } from './auth-routing.module';

// auth components
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    RecaptchaFormsModule,
    RecaptchaModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LfKNi0cAAAAACeYwFRY9_d_qjGhpiwYUo5gNW5-',
      } as RecaptchaSettings,
    },
  ],
})
export class AuthModule {
 }

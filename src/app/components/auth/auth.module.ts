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
import { CanDeactivateGuard } from '@app/_helpers/can-deactivate-guard';

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
  providers: [CanDeactivateGuard,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
       // siteKey: '6Lc7B1AdAAAAAM39-h6SVw-Cto_oLDL_FGxSb-2e',
       siteKey: '6Lcrd1odAAAAADJjzNMBVyE67Az5LO5M14uu5Qoc',
      } as RecaptchaSettings,
    },
  ],
})
export class AuthModule {
 }

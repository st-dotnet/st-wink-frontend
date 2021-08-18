import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '@app/_helpers/must-match.validator';
import { AccountService, SessionService } from '@app/_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  submitted = false;
  processing = false;
  resetPasswordForm: FormGroup;
  loading: boolean;
  customerId: number;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastrService: ToastrService,
    private sessionService: SessionService,) {
    this.sessionService.scrollToTop();
  }

  ngOnInit(): void {
    debugger
    this.route.params.subscribe((params) => {
      this.customerId = parseInt(params["id"]);
    });
    console.log("CustomerId", this.customerId);
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  resetPasswordFormSubmit() {
    debugger
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    const passwordModel = {
      newPassword: this.f.password.value,
      customerId: this.customerId
    }
    this.loading = true;
    this.spinner.show();
    this.accountService
      .resetPassword(passwordModel)
      .pipe(first())
      .subscribe({
        next: (result: any) => {
          debugger
          if (result) {
            this.spinner.hide();
            this.toastrService.success('Password reset succesfully');
            this.router.navigate(['/sign-in']);
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.toastrService.error(error);
          this.spinner.hide();
          this.loading = false;
        },
      });
  }
}

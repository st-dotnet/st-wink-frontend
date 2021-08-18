import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AccountService, SessionService } from '@app/_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toast, ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  emailForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private sessionService: SessionService,) {
    this.sessionService.scrollToTop();
  }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      emailAddress: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  get f() {
    return this.emailForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    debugger;
    // stop here if form is invalid
    if (this.emailForm.invalid) {
      return;
    }
    const emailModel = {
      email: this.f.emailAddress.value,
      customerId: 0,
      loginName: "",
      newPassword: "",
      url: "http://localhost:4200/forgot-password",
    };
    this.loading = true;
    this.spinner.show();
    this.accountService.forgetPasswordEmail(emailModel)
      .pipe(first())
      .subscribe({
        next: (result: any) => {
          debugger
          if (result) {
            this.spinner.hide();
            this.toastrService.success('Password Reset Link has been sent to your registered email.');
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

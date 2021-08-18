import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '@app/_services';
import { AccountService } from '@app/_services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  showPassword: boolean = false;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private accountService: AccountService,
    private sessionService: SessionService) {
    this.sessionService.scrollToTop();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      // emailAddress: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      emailAddress: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    debugger
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const model = {
      loginName: this.f.emailAddress.value,
      password: this.f.password.value
    }
    this.spinner.show();
    this.loading = true;
    this.accountService.login(model)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          if (!res.token) {
            this.toastrService.error(res.message);
            this.spinner.hide();
            this.loading = false;
            return false;
          }
          // get return url from query parameters or default to home page
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
          this.router.navigateByUrl(returnUrl);
          this.loading = false;
          this.spinner.hide();
        },
        error: error => {
          this.spinner.hide();
          this.toastrService.error(error);
          this.loading = false;
        }
      });
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

}

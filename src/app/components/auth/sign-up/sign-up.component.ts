import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '@app/_helpers/must-match.validator';
import { User } from '@app/_models/user';
import { SessionService } from '@app/_services';
import { AccountService } from '@app/_services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})

export class SignUpComponent implements OnInit {
  checkage: boolean = false;
  unSaved: boolean = true;
  form!: FormGroup;
  public recaptchaMode = 'v3';
  loading = false;
  submitted = false;
  maxDate = new Date();
  maskMobileNo = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  //datemask= [/\d/, /\d/, '/', /\d/, /\d/, '/',/\d/, /\d/,/\d/, /\d/];

  isTrue: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private accountService: AccountService,
    private sessionService: SessionService) {
    this.sessionService.scrollToTop();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userName: ['', Validators.required],
        emailAddress: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          ],
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(15),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        dateOfBirth: ['', [Validators.required]],
        recaptcha: ['', [Validators.required]]
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  public addTokenLog(message: string, token: string | null) {
    // this.log.push(`${message}: ${this.formatToken(token)}`);
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // let dirty = this.form.dirty;
    // if (dirty == false) {
    //   return true;
    // } else if (dirty == true) {
    //   return false;
    // }
    return true;
  }

  getAge(fromdate: Date, todate) {
    if (todate) todate = new Date(todate);
    else todate = new Date();

    var age = [], fromdate = new Date(fromdate),
      y = [todate.getFullYear(), fromdate.getFullYear()],
      ydiff = y[0] - y[1],
      m = [todate.getMonth(), fromdate.getMonth()],
      mdiff = m[0] - m[1],
      d = [todate.getDate(), fromdate.getDate()],
      ddiff = d[0] - d[1];

    if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
    if (mdiff < 0) mdiff += 12;
    if (ddiff < 0) {
      fromdate.setMonth(m[1] + 1, 0);
      ddiff = fromdate.getDate() - d[1] + d[0];
      --mdiff;
    }
    if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
    if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
    if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));

    return ydiff;
  }

  onSubmit() {
    debugger;
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    var today = new Date();
    var age = this.getAge(this.f.dateOfBirth.value, today);

    if (age < 14) {
      this.checkage = true;
      //this.toastrService.error('Must be 14 years or older to create an account');
      return;
    }
    this.checkage = false;
    const model = {
      customerID: 0,
      insertEnrollerTree: '',
      firstName: this.f.firstName.value ? this.f.firstName.value : '',
      lastName: this.f.lastName.value ? this.f.lastName.value : '',
      mobilePhone: this.f.phoneNumber.value ? this.f.phoneNumber.value : '',
      canLogin: true,
      recaptcha: this.f.recaptcha.value ? this.f.recaptcha.value : '',
      dateOfBirth: this.f.dateOfBirth.value ? this.f.dateOfBirth.value : '',
      email: this.f.emailAddress.value.toLowerCase( ) ? this.f.emailAddress.value.toLowerCase( ) : '',
      loginName: this.f.userName.value,
      loginPassword: this.f.confirmPassword.value
        ? this.f.confirmPassword.value
        : '',
      customerType: '',
      customerStatus: '',
      entryDate: '',
      defaultWarehouseID: '',
      currencyCode: '',
      languageID: '',
      enrollerID: 0,
      mainCountry: '',
    };
    this.loading = true;
    this.spinner.show();
    this.accountService
      .register(model)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.isTrue = this.sessionService.getSessionItem('isTrue');
          if (this.isTrue == "true") {
            setTimeout(() => {
              this.form.reset();
              this.router.navigate(["/store/checkout"]);
              this.spinner.hide();
            }, 1000);
          } else if (res.errorMessage != null && res.errorMessage != "") {
            this.toastrService.error(res.errorMessage);
          } else {
            debugger;
            this.form.reset();
            this.router.navigate([''], { relativeTo: this.route });
            this.toastrService.success('User registration successfully');
            this.spinner.hide();
          }
          // this.toastrService.success('Please check your email in order to verify the registration');
          this.spinner.hide();
        },
        error: (error) => {
          this.toastrService.error(error);
          this.spinner.hide();
          this.loading = false;
        },
      });
  }

  validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  emailVerify(type: any) {
    const emailModel = {
      userName: this.f.userName.value,
      email: this.f.emailAddress.value
    }
    this.spinner.show();
    this.accountService
      .emailVerify(emailModel)
      .pipe(first())
      .subscribe({
        next: (result: any) => {
          if (result) {
            if (type == "Email") {
              this.form.get("emailAddress").setValue("");
            } else {
              this.form.get("userName").setValue("");
            }
            this.toastrService.error(`${type} Already existed`);
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

  verifyDate(type: any){
    var today = new Date();
    var age = this.getAge(this.f.dateOfBirth.value, today);

    if (age < 14) {
      this.checkage = true;
      //this.toastrService.error('Must be 14 years or older to create an account');
      return;
    }
    this.checkage = false;
  }
}

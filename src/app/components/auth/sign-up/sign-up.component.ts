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

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  maxDate = new Date();
  maskMobileNo = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
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
        username: ['', Validators.required],
        emailAddress: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
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
        dateOfBirth: [''],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    debugger
    let dirty=this.form.dirty;
    if(dirty==false){ 
      return true;
    }else if(dirty==true){
      return false;
    }
  }

  onSubmit() {
    this.submitted = true;
    debugger;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const model = {
      customerID: 0,
      insertEnrollerTree: '',
      firstName: this.f.firstName.value ? this.f.firstName.value : '',
      lastName: this.f.lastName.value ? this.f.lastName.value : '',
      mobilePhone: this.f.phoneNumber.value ? this.f.phoneNumber.value : '',
      canLogin: true,
      email: this.f.emailAddress.value ? this.f.emailAddress.value : '',
      loginName: this.f.username.value,
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
          console.log("Result", res);
          debugger
          this.isTrue = this.sessionService.getSessionItem('isTrue');
          if(this.isTrue == "true"){            
            setTimeout(() => {              
            this.router.navigate(["/store/checkout"]);
              this.spinner.hide();  
                }, 1000);
          }else{
            this.router.navigate([''], { relativeTo: this.route }) ;            
             this.spinner.hide();  
          }                            
          this.toastrService.success('User registration successfully');
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

  validateEmail(email: any) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  emailVerify(type:any){
    const emailModel ={
      userName : this.f.username.value,
      email : this.f.emailAddress.value
    }
    this.accountService
      .emailVerify(emailModel)
      .pipe(first())
      .subscribe({
        next: (result:any) => {
          debugger         
          if(result){
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
}

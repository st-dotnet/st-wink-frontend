import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  fieldprofile1: any;
  fieldprofile2: any;
  UserDetails: any;
  currentuser: any;
  password: any;

  onFirstNameSubmitForm: FormGroup;
  onloginNamSubmitForm: FormGroup;
  onPasswordSubmitForm: FormGroup;
  onEmailSubmitForm: FormGroup;
  onPhoneSubmitForm: FormGroup;

  firstnameSubmitted: boolean = false;
  loginNameSubmitted: boolean = false;
  PasswordSubmitted: boolean = false;
  emailSubmitted: boolean = false;
  mobilePhoneSubmitted: boolean = false;

  maskMobileNo = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


    constructor(private accountService: AccountService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private sessionService: SessionService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
     this.getuserdetails();
     this.onFirstNameSubmitForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
     });
     this.onloginNamSubmitForm = this.formBuilder.group({
      loginName: ['', [Validators.required]],
    });
    this.onPasswordSubmitForm = this.formBuilder.group({
      Password: ['', [Validators.required,Validators.minLength(6)]],
    });
    this.onEmailSubmitForm = this.formBuilder.group({
      email: ['', [Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),]]
    });
    this.onPhoneSubmitForm = this.formBuilder.group({
      mobilePhone: ['', [Validators.required,Validators.minLength(10),
        Validators.maxLength(15)]],
      phone: ['', [Validators.required,Validators.minLength(10),
        Validators.maxLength(15),]]
    });
  }

  get f() {
    return this.onFirstNameSubmitForm.controls;
  }
  get l() {
    return this.onloginNamSubmitForm.controls;
  }
  get p() {
    return this.onPasswordSubmitForm.controls;
  }
  get e() {
    return this.onEmailSubmitForm.controls;
  }
  get m() {
    return this.onPhoneSubmitForm.controls;
  }


  getuserdetails(){
    this.spinner.show();
    this.currentuser = this.sessionService.getSessionObject("user");
    this.accountService.getCustomer(this.currentuser.customerId).subscribe((response) => {
      this.UserDetails = response[0];
      this.spinner.hide();
    });
  }


  updateFirstName(){
    this.firstnameSubmitted=true;
    if (this.onFirstNameSubmitForm.invalid) {
      return;
    }
    this.submit('First Name');
  }

  updateLoginName(){
    this.loginNameSubmitted = true;
    if (this.onloginNamSubmitForm.invalid) {
      return;
    }
    this.submit('login Name');
  }

  updatePassword(){
    this.PasswordSubmitted = true;
    if (this.onPasswordSubmitForm.invalid) {
      return;
    }

    this.spinner.show();
     this.accountService.updateCustomer(this.UserDetails).subscribe((Response) => {
     console.log(Response);
     this.toastrService.success('password is updated successfully.');
     });
      this.spinner.hide();

}

  updateEmail(){
    this.emailSubmitted = true;
    if (this.onEmailSubmitForm.invalid) {
      return;
    }
    this.submit('email');
 }
  updatemobilePhone(){
    this.mobilePhoneSubmitted = true;
    if (this.onPhoneSubmitForm.invalid) {
      return;
    }
    this.submit('mobilePhone and Phone');
  }

     submit(feildname:string){
     this.spinner.show();
     this.accountService.updateCustomer(this.UserDetails).subscribe((Response) => {
     console.log(Response);
     this.toastrService.success(`${feildname} is updated successfully.`);
     this.getuserdetails();
      this.spinner.hide();
     });
  }
  validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  validateMobile(mobile: string) {
    const re =
    /^\d{10}$/;
    return re.test(String(mobile).toLowerCase());
  }
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sessionService.logout();
        this.sessionService.removeSessionItem("user");
        this.sessionService.removeSessionItem("promoCode");
        this.sessionService.cartSession(0);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
}

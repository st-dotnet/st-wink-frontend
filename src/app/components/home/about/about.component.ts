import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '@app/_helpers/CommonModel';
import { ContactService, SessionService } from '@app/_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  contactform!: FormGroup;
  loading = false;
  submitted = false;
  maskMobileNo = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private sessionService: SessionService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService) {
    this.sessionService.scrollToTop();
  }

  ngOnInit() {
    this.contactform = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: [
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
        notes: ['', [Validators.required]],
      });
  }

  get f() {
    return this.contactform.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.contactform.invalid) {
      return;
    }
    this.spinner.show();
    const user = new User();
    user.name = this.f.name.value;
    user.mobile = this.f.phoneNumber.value;
    user.email = this.f.email.value;
    user.notes = this.f.notes.value;
    this.contactService.createContact(user)
      .subscribe(response => {
        this.spinner.hide();
        this.toastrService.success('Contact information saved successfully');
        console.log(response)
      }, error => {
        this.spinner.hide();
        console.warn(error.responseText);
        this.toastrService.error(error);
        console.log({ error })
      });
  }
}


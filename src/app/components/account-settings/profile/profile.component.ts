import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models/user';
import { AccountService, SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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


  constructor(private accountService: AccountService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private shopService: ShopService,
    private sessionService: SessionService) { }

  ngOnInit(): void {
    this.getuserdetails();
  }

  getuserdetails(){
    this.spinner.show();
    this.currentuser = this.sessionService.getSessionObject("user");
    this.accountService.getCustomer(this.currentuser.customerId).subscribe((response) => {
      this.UserDetails = response.result.customers[0];
      console.log(this.UserDetails);
      this.spinner.hide();
    });
  }

  submit(fieldName: string,feildname:string) {
    if(feildname=='' || feildname==null){
      this.toastrService.error(`${fieldName} is required.`);
      return;
    }

   if(fieldName=='email'){
    if(!this.validateEmail(this.UserDetails.email))
    {
      this.toastrService.error(`email format is not valid.`);
      return;
    }
   }
     this.spinner.show();
    this.accountService.updateCustomer(this.UserDetails).subscribe((Response) => {
    console.log(Response);
     this.toastrService.success(`${fieldName} is updated successfully.`);
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

}

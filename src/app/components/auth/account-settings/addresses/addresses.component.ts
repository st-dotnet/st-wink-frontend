import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  user: any;
  addressess:any[]=[];
  shippingAddressForm: FormGroup;
  addressSubmitted: boolean = false;
  constructor(private shopService: ShopService, private accountService: AccountService, private sessionService: SessionService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,    private formBuilder: FormBuilder) { }

   
  ngOnInit(): void {
    this.user = this.sessionService.getSessionObject('user');
    if(this.user){
      this.getAddressByCustomerId(this.user.customerId);
    }
    this.shippingAddressForm = this.formBuilder.group({
      streetAddress: ['',[Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['',[Validators.required]],
    });
  }
  getAddressByCustomerId(id) {
    debugger;
    this.spinner.show();
    this.shopService.getCustomerAddressById(id).subscribe((result: any) => {
   this.spinner.hide();
      if (result!=null) {
      this.addressess = result?.customers;   
      }});
  };
  get s() {
    return this.shippingAddressForm.controls;
  }
  onAddressSubmit(){
    debugger;
    this.addressSubmitted =true;
    this.spinner.show();

    if (this.shippingAddressForm.invalid) {
      this.spinner.hide();
      return;
    }
    let address = {
      address1: this.s.streetAddress.value,
      address2: "",
      city: this.s.city.value,
      state: this.s.state.value,
      zip: this.s.zip.value
     // country: this.s.country.value
   
    };
    this.accountService.SaveAddress(address).subscribe((Response) => {
      console.log(Response);
      this.getAddressByCustomerId(this.user.customerId);
       this.spinner.hide();
     });
  }
}

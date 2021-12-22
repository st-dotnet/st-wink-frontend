import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@app/_services';
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
  constructor(private shopService: ShopService,  private sessionService: SessionService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService) { }

   
  ngOnInit(): void {
    this.user = this.sessionService.getSessionObject('user');
    if(this.user){
      this.getAddressByCustomerId(this.user.customerId);
    }
  
  }
  getAddressByCustomerId(id) {
    debugger;
    this.spinner.show();
    this.shopService.getCustomerAddressById(id).subscribe((result: any) => {
   this.spinner.hide();
      if (result!=null) {
      this.addressess = result?.result?.customers;   
      }});
  };

}

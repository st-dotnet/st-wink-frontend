import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

customerOrderData:any;

  constructor(private accountService: AccountService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService){
 }

  ngOnInit(): void {
  this.getCustomerAutoOrders();
  }
  getCustomerAutoOrders(){
    this.spinner.show();
    this.accountService.getCustomerAutoOrders().subscribe((response)=>{
      this.customerOrderData=response;
     
      this.spinner.hide();
   });
  }


}

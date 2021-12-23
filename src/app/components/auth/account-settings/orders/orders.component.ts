import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  customerOrderData:any;
  constructor(private accountService: AccountService, private spinner: NgxSpinnerService){
 }

  ngOnInit(): void {
  this.getCustomerAutoOrders();
  }

  getCustomerAutoOrders(){
    this.spinner.show();
    this.accountService.getCustomerOrders().subscribe((response)=>{
     // this.customerOrderData=response.result.orders;
      console.log(response);
      this.spinner.hide();
   });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  invoiceHtml:any;
  constructor(private accountService: AccountService, private spinner: NgxSpinnerService,private router: Router){
    
 }

  ngOnInit(): void {
  this.getCustomerAutoOrders();
  }

  getCustomerAutoOrders(){
    this.spinner.show();
    this.accountService.getCustomerOrders().subscribe((response)=>{
     this.customerOrderData=response.orders;
     // console.log(response);
      this.spinner.hide();
   });
  }

  viewInvoice(orderId:any){
    debugger;
    this.router.navigate(['/invoice', orderId]);
    
 
  }
}

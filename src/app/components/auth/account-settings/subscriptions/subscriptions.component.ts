import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

customerOrderData:any;
  subscribeId: number;

  constructor(private accountService: AccountService, private spinner: NgxSpinnerService,   private modalService: NgbModal,
    private toastrService: ToastrService,private router: Router){
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

  viewEditDetail(subscriptionId:any){
    this.router.navigate(['/edit-subscription', subscriptionId]);
  }

  deleteSubscription(){
    this.spinner.show();
    this.accountService.deleteSubscription(this.subscribeId).subscribe((response)=>{
      this.modalService.dismissAll();
   this.getCustomerAutoOrders();
      this.spinner.hide();
   });
  }

  openModal(id: any,subscribeId:any){
      this.subscribeId=subscribeId;
      this.modalService.open(id);
  };
  closeModal(){
    this.subscribeId=0;
    this.modalService.dismissAll();
  }
}

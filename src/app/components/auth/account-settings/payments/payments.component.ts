import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
paymentCards: any[]=[];
  secondaryCards: any[];
  primaryCards: any[];


  constructor(private accountService: AccountService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getCustomerCardDetails();
  }

  getCustomerCardDetails(){
    this.spinner.show();
    this.accountService.GetCustomerBilling().subscribe((response) => {
      //this.UserDetails = response.result.customers[0]
      this.paymentCards = response?.filter(x=>x.cardNumber !=null);
      this.secondaryCards =   this.paymentCards?.filter(x=>x.type==2);
      this.primaryCards = this.paymentCards?.filter(x=>x.type==1);
      console.log(response);
      this.spinner.hide();
    });
  }

  DeleteCard(){

  }
}

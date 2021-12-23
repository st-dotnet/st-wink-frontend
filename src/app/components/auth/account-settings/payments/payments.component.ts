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
  constructor(private accountService: AccountService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getCustomerCardDetails();
  }

  getCustomerCardDetails(){
    this.spinner.show();
    this.accountService.GetCustomerBilling().subscribe((response) => {
      //this.UserDetails = response.result.customers[0]
      debugger;
      this.paymentCards = response?.result?.filter(x=>x.cardNumber !=null);
      console.log(response);
      this.spinner.hide();
    });
  }
}

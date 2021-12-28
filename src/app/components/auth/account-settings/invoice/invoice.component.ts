import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '@app/_services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  orderId: number;
  invoiceHtml: string;

  constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService,) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderId = params['id'];
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.accountService.getOrderInvoice(this.orderId).subscribe((response) => {
      console.log(atob(response));
      this.invoiceHtml = atob(response);
      this.spinner.hide();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '@app/_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { SafeResourceUrl,DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  orderId: number;
  invoiceHtml: any;
    html:any;
  constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService,sanitizer: DomSanitizer) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderId = params['id'];
      this.spinner.show();
      this.accountService.getOrderInvoice(this.orderId).subscribe((response) => {
        this.html = atob(response);
        this.invoiceHtml =  sanitizer.bypassSecurityTrustHtml(this.html);
        this.spinner.hide();
      });
    });
  }

  ngOnInit(): void {
   
  }

}

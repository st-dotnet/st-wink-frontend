import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-enrollment-packs',
    templateUrl: './enrollmentinfo.component.html',
    styleUrls: ['./enrollmentinfo.component.css']
})
export class EnrollmentInfoComponent implements OnInit {
    addrnew = false;
    ngOnInit(): void {
    }

    
  shippingAddressType(billingAddressType: string) {
    if (billingAddressType == 'shippingAddress') {
      this.addrnew = false;
    } else {
      this.addrnew = true;
    }
  }
  
}
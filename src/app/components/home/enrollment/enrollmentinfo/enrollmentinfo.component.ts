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
    
    isCardDisabled: boolean = false;
    isCardType: number;
    newAddress: any;

    onSelectCardChange(id: number) {
      switch (id) {
        case 1:
          //prepare existing card value;
          this.isCardDisabled = false;
          this.isCardType = id;
          //console.log(id);
  
          break;
        case 2:
          // take new card value and create token and store it to database and get;
          this.isCardDisabled = true;
          this.isCardType = id;
          break;
        default:
          break;
      }
    }
    
  shippingAddressType(billingAddressType: string) {
    if (billingAddressType == 'shippingAddress') {
      this.addrnew = false;
    } else {
      this.addrnew = true;
    }
  }
  
  
}
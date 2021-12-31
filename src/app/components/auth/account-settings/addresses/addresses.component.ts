import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, SessionService } from '@app/_services';
import { EnrollmentService } from '@app/_services/enrollment.service';
import { ShopService } from '@app/_services/shop.service';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  user: any;
  addressess: any[] = [];
  shippingAddressForm: FormGroup;
  address: any[] = [];
  country: string = 'US';
  verifyAddressResponse: any;

  editShippingAddressForm: FormGroup;

  addressSubmitted: boolean = false;
  editAddressSubmitted: boolean = false;
  closeResult: string;

  modalOptions: NgbModalOptions = {
    //backdrop: 'static',
    backdropClass: 'customBackdrop',
    windowClass: 'prodview-modal'
  };
  isEdit: boolean;
  constructor(private shopService: ShopService, private accountService: AccountService, private sessionService: SessionService,
    private router: Router, private enrollmentService: EnrollmentService,
    private spinner: NgxSpinnerService, private modalService: NgbModal,
    private toastrService: ToastrService, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.user = this.sessionService.getSessionObject('user');
    if (this.user) {
      this.getAddressByCustomerId(this.user.customerId, true);
    }
    this.shippingAddressForm = this.formBuilder.group({
      type: [''],
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });

    this.editShippingAddressForm = this.formBuilder.group({
      streetAddress1: ['', [Validators.required]],
      city1: ['', [Validators.required]],
      state1: ['', [Validators.required]],
      zip1: ['', [Validators.required]],
      country1: ['', [Validators.required]],
    });
  }


  deleteCustomerAddress(type: string) {
    
    // New = 0,
    // Main = 1,
    //Mailing = 2,
    //Other = 3
    this.spinner.show();
    this.accountService.deleteCustomerAddress(type).subscribe((response) => {
      this.toastrService.success('Address Deleted Successfully.');
      console.log(response);
      this.getAddressByCustomerId(this.user.customerId, false);
    });
  }

  getAddressByCustomerId(id, spinner) {
    
    if (spinner) {
      this.spinner.show();
    }
    this.shopService.getCustomerAddressById(id).subscribe((result: any) => {
      console.log(result);
      if (result != null) {
        this.addressess = [];
        this.addressess = result;
        console.log("this.addressess", result);
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    });
  };


  filterAddress(type: any) {
    switch (type) {
      case 1:
        return this.addressess.filter(x => x.addressType == type && x.address1 != '');
      case 2:
        return this.addressess.filter(x => x.addressType == type && x.mailingAddress1 != '');
      case 3:
        return this.addressess.filter(x => x.addressType == type && x.otherAddress1 != '');
      default:
        break;
    }
  }


  get s() {
    return this.shippingAddressForm.controls;
  }

  get e() {
    return this.editShippingAddressForm.controls;
  }

  makeCardPrimary(data: any, type: any) {
    
    // let addressdata = {
    //   addressType: 0,
    //   address1: '',
    //   address2: '',
    //   city: '',
    //   state: '',
    //   zip: '',
    //   country: ''
    // };

    // if(type=='Other')
    // {
    //   addressdata.addressType=3
    //   addressdata.address1=data.otherAddress1,
    //   addressdata.address2=data.otherAddress2,
    //   addressdata.city=data.otherCity,
    //   addressdata.state=data.otherState,
    //   addressdata.zip=data.otherZip,
    //   addressdata.country='United States'
    //   //addressdata.oldAddressType=1;
    // }
    // else if(type=='Mailing'){
    //   addressdata.addressType=2
    //   addressdata.address1=data.mailAddress1,
    //   addressdata.address2=data.mailAddress2,
    //   addressdata.city=data.mailCity,
    //   addressdata.state=data.mailState,
    //   addressdata.zip=data.mailZip,
    //   addressdata.country='United States'
    //   //addressdata.oldAddressType=1;
    // }

    this.spinner.show();
    this.accountService.makeAddressPrimary(parseInt(type)).subscribe((Response) => {
      console.log(Response);
      this.toastrService.success('Address Updated Successfully.');
      this.getAddressByCustomerId(this.user.customerId, false);
    });
  }


  onAddressSubmit(isEdit: any) {
    
    this.addressSubmitted = true;
    if (this.shippingAddressForm.invalid) {
      this.spinner.hide();
      return;
    }
    let verifyaddress = {
      Address: this.s.streetAddress.value,
      City: this.s.city.value,
      State: this.s.state.value,
      Zip: this.s.zip.value,
      Country: 'United States',
    };
    this.spinner.show();
    this.enrollmentService.verifyAddress(verifyaddress).subscribe((response: any) => {
      this.verifyAddressResponse = response;
      console.log(response);
      console.log(this.verifyAddressResponse);
      if (this.verifyAddressResponse.address) {
        
        if (this.filterAddress(3).length == 0) {
          let address = {
            addressType: 0,
            OtherAddress1: this.s.streetAddress.value,
            OtherAddress2: "",
            city: this.s.city.value,
            state: this.s.state.value,
            zip: this.s.zip.value,
            country: 'United States',
            saveType: 'Other'
          };
          
          this.accountService.SaveAddress(address).subscribe((Response) => {
            console.log(Response);
            this.toastrService.success('Address save Successfully.');
            this.getAddressByCustomerId(this.user.customerId, false);
          });
        }
        else if (this.filterAddress(2).length == 0) {
          let address = {
            addressType: 0,
            MailingAddress1: this.s.streetAddress.value,
            MailingAddress2: "",
            city: this.s.city.value,
            state: this.s.state.value,
            zip: this.s.zip.value,
            country: 'United States',
            saveType: 'Mail'
          };
          
          this.accountService.SaveAddress(address).subscribe((Response) => {
            console.log(Response);
            this.toastrService.success('Address save Successfully.');
            this.getAddressByCustomerId(this.user.customerId, false);
          });
        }

        else if ((this.filterAddress(2).length > 0) && (this.filterAddress(3).length > 0)) {

          let address = {
            addressType: 0,
            OtherAddress1: this.s.streetAddress.value,
            OtherAddress2: "",
            city: this.s.city.value,
            state: this.s.state.value,
            zip: this.s.zip.value,
            country: 'United States',
            saveType: 'Other'
          };
          
          this.accountService.SaveAddress(address).subscribe((Response) => {
            console.log(Response);
            this.toastrService.success('Address save Successfully.');
            this.getAddressByCustomerId(this.user.customerId, false);
          });
        }

      } else {
        this.toastrService.error('Address is Not Verified');
        this.spinner.hide();
      }
    });
  }

  oneEditAddressSubmit() {
    
    this.editAddressSubmitted = false;
    if (this.shippingAddressForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.s.type.value == 1) {
      let address = {
        addressType: this.s.type.value,
        address1: this.s.streetAddress.value,
        address2: "",
        city: this.s.city.value,
        state: this.s.state.value,
        zip: this.s.zip.value,
        country: 'US'
        //saveType :'Other'
      };
      console.log(" this.s.type.value", address)
      this.accountService.EditAddress(address).subscribe((Response) => {
        console.log(Response);
        this.toastrService.success('Address updated Successfully.');
        this.getAddressByCustomerId(this.user.customerId, false);
      });
      this.spinner.show();
    }
    else if (this.s.type.value == 2) {
      let address = {
        addressType: this.s.type.value,
        mailingAddress1: this.s.streetAddress.value,
        mailingAddress2: "",
        city: this.s.city.value,
        state: this.s.state.value,
        zip: this.s.zip.value,
        country: 'US'
        //saveType :'Other'
      };
      console.log(" this.s.type.value", address)
      this.accountService.EditAddress(address).subscribe((Response) => {
        console.log(Response);
        this.toastrService.success('Address updated Successfully.');
        this.getAddressByCustomerId(this.user.customerId, false);
      });
      this.spinner.show();
    }
    else if (this.s.type.value == 3) {
      let address = {
        addressType: this.s.type.value,
        otherAddress1: this.s.streetAddress.value,
        otherAddress2: "",
        city: this.s.city.value,
        state: this.s.state.value,
        zip: this.s.zip.value,
        country: 'US'
        //saveType :'Other'
      };
      console.log(" this.s.type.value", address)
      this.accountService.EditAddress(address).subscribe((Response) => {
        console.log(Response);
        this.toastrService.success('Address updated Successfully.');
        this.getAddressByCustomerId(this.user.customerId, false);
      });
      this.spinner.show();
      this.shippingAddressForm.reset(); 
    }

  }

  open(content: any, address: any) {
    console.log(address);
    this.address = address;
    this.editAddressSubmitted = true;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editAddress(address: any) {
    
    this.isEdit = true;
    switch (address?.addressType) {
      case 1:
        this.shippingAddressForm.get("type").setValue(address?.addressType);
        this.shippingAddressForm.get("streetAddress").setValue(address.address1);
        this.shippingAddressForm.get("city").setValue(address.city);
        this.shippingAddressForm.get("state").setValue(address.state);
        this.shippingAddressForm.get("zip").setValue(address.zip);
        this.shippingAddressForm.get("country").setValue(address.country);
        break;
      case 2:
        this.shippingAddressForm.get("type").setValue(address?.addressType);
        this.shippingAddressForm.get("streetAddress").setValue(address.mailingAddress1);
        this.shippingAddressForm.get("city").setValue(address.city);
        this.shippingAddressForm.get("state").setValue(address.state);
        this.shippingAddressForm.get("zip").setValue(address.zip);
        this.shippingAddressForm.get("country").setValue(address.country);
        break;
      case 3:
        this.shippingAddressForm.get("type").setValue(address?.addressType);
        this.shippingAddressForm.get("streetAddress").setValue(address.otherAddress1);
        this.shippingAddressForm.get("city").setValue(address.city);
        this.shippingAddressForm.get("state").setValue(address.state);
        this.shippingAddressForm.get("zip").setValue(address.zip);
        this.shippingAddressForm.get("country").setValue(address.country);
        break;
      default:
        break;
    }
  }


}

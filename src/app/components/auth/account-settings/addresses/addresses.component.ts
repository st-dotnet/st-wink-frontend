import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, SessionService } from '@app/_services';
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
  addressess:any;
  shippingAddressForm: FormGroup;
  address:any[]=[];
  country:string='US';

  editShippingAddressForm: FormGroup;

  addressSubmitted: boolean = false;
  editAddressSubmitted: boolean = false;
  closeResult: string;

  modalOptions: NgbModalOptions = {
    //backdrop: 'static',
    backdropClass: 'customBackdrop',
    windowClass: 'prodview-modal'
  };
  constructor(private shopService: ShopService, private accountService: AccountService, private sessionService: SessionService,
    private router: Router,
    private spinner: NgxSpinnerService,private modalService: NgbModal,
    private toastrService: ToastrService,    private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.user = this.sessionService.getSessionObject('user');
    if(this.user){
      this.getAddressByCustomerId(this.user.customerId);
    }
    this.shippingAddressForm = this.formBuilder.group({
      streetAddress: ['',[Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['',[Validators.required]],
    });

    this.editShippingAddressForm = this.formBuilder.group({
      streetAddress1: ['',[Validators.required]],
      city1: ['', [Validators.required]],
      state1: ['', [Validators.required]],
      zip1: ['', [Validators.required]],
      country1: ['',[Validators.required]],
    });
  }


  getAddressByCustomerId(id) {
    debugger;
    this.spinner.show();
    this.shopService.getCustomerAddressById(id).subscribe((result: any) => {
     this.spinner.hide();
      if (result!=null) {
      this.addressess = result?.customers;
      }});

  };
  get s() {
    return this.shippingAddressForm.controls;
  }

  get e() {
    return this.editShippingAddressForm.controls;
  }

  onAddressSubmit(){
    debugger;
    this.addressSubmitted =true;
    this.spinner.show();

    if (this.shippingAddressForm.invalid) {
      this.spinner.hide();
      return;
    }
    let address = {
      address1: this.s.streetAddress.value,
      address2: "",
      city: this.s.city.value,
      state: this.s.state.value,
      zip: this.s.zip.value
     // country: this.s.country.value

    };
    this.accountService.SaveAddress(address).subscribe((Response) => {
      console.log(Response);
      this.getAddressByCustomerId(this.user.customerId);
       this.spinner.hide();
     });
  }

  oneEditAddressSubmit(){
    debugger;
    this.editAddressSubmitted=false;
    if (this.editShippingAddressForm.invalid) {
      return;
    }

    this.spinner.show();
    let address = {
      address1: this.e.streetAddress1.value,
      address2: "",
      city: this.e.city1.value,
      state: this.e.state1.value,
      zip: this.e.zip1.value
     // country: this.s.country.value

    };
     this.accountService.SaveAddress(address).subscribe((Response) => {
      //console.log(Response);
      this.toastrService.success('Address updated Successfully.');
      this.getAddressByCustomerId(this.user.customerId);
      this.modalService.dismissAll();
       this.spinner.hide();
     });
  }


  open(content: any,address:any) {
    console.log(address);
    this.address=address;

    this.editAddressSubmitted=true;
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
}

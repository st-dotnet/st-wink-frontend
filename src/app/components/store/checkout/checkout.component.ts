import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartTypeEnum } from '@app/_models/cart-type-enum';
import {
  ChargeCreditCardTokenRequest,
  CreateAutoOrderRequest,
  CreateCustomerRequest,
  CreateOrderRequest,
  OrderDetailRequest,
  SetAccountCreditCardTokenRequest,
} from '@app/_models/checkout';
import { Payment } from '@app/_models/payment';
import { SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TransactionalRequestModel } from 'src/app/_models/checkout';
import * as braintree from 'braintree-web';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  hostedFieldsInstance: braintree.HostedFields;
  cardholdersName: string;

  addrnew = false;
  sidebartoggle: boolean = true;
  sidebartoggle1: boolean = false;
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  shippingAddressForm: FormGroup;
  onPaymentSubmitForm: FormGroup;
  inputdata: any;
  promocodepay: any;
  loyalpointz: any;
  filterTerm: any;
  cartItems: any[] = [];
  submitted = false;
  subscriptionCartItems: any[] = [];
  oneTimePriceCartItems: any[] = [];
  subtotalOneTimePrice: any = 0;
  subtotalSubscriptionTimePrice: any = 0;
  orderDetails: any[] = [];
  subscriptionTotalPrice: any;
  unSubscriptionTotalPrice: any;
  minDate = new Date();
  startDate: any;
  paramsProductPrice: any;
  promocode_onetime: string;
  UserDetails: any;
  modalOptions: NgbModalOptions = {
    // backdrop: 'static',
    backdropClass: 'customBackdrop',
  };
  discount15Percent: number = 0;
  subTotalSubscriptionPrice: number = 0;
  subTotalSubscriptionPriceAfterDiscount: number = 0;
  orderTotal: number = 0;
  cartSummaryTotal: number = 0;
  promoItem: any;
  isDisabled: boolean = true;
  totalDiscount: any;
  promoPercentage: any;
  isPromocode = false;
  specialOffer: any[];
  specialOfferPrice: number = 0;
  promocodeObject: any;
  customerId: number;
  newAddress: any;
  showPanel1 = false;
  showPanel2 = true;
  showPanel3 = true;

  enablebtn: boolean;
  //Shipping Address Variables
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: number;
  country: string;
  isShipmentMethod: any;
  shippingAddressParam: any;
  //Card Information Variables
  isCardType: number;
  //if card type 2 means new card details
  cardName: string;
  cardNumber: number;
  expiryMonth: number;
  expiryYear: number;
  cardCVV: number;
  isCardDisabled: boolean = true;
  isMakePrimaryCard: boolean = false;
  paymentParam: any;
  // New Billing Address
  billingAddress: any;
  newStreetAddress: string;
  newCity: string;
  newState: string;
  newZip: number;
  newCountry: string;
  displayAddress: string;
  shopProductsRequest: any[];

  constructor(
    private modalService: NgbModal,
    private shopService: ShopService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService
  ) {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.UserDetails = JSON.parse(localStorage.getItem('user'));
    this.customerId = this.UserDetails.customerId;
    this.totalDiscount = 0;
    this.orderTotal = 0;
    this.subtotalOneTimePrice = 0;
    this.subTotalSubscriptionPrice = 0;
    this.discount15Percent = 0;
    this.subTotalSubscriptionPriceAfterDiscount = 0;
    this.cartSummaryTotal = 0;
    this.startDate = this.sessionService.getSessionItem('startDate');
    this.subscriptionTotalPrice =
      this.sessionService.getSessionObject('subscriptionTotal');
    this.unSubscriptionTotalPrice = this.sessionService.getSessionObject(
      'unSubscriptionTotal'
    );
    this.cartItems = this.sessionService.getSessionObject('productCartItems');
    this.newAddress = JSON.parse(localStorage.getItem('newShippingAddress'))
      ? JSON.parse(localStorage.getItem('newShippingAddress'))
      : '';
    if (
      this.newAddress != '' ||
      this.newAddress != undefined ||
      this.newAddress != null
    ) {
      this.displayAddress =
        this.newAddress?.addressDisplay +
        ' ' +
        this.newAddress?.streetAddress +
        ' ' +
        this.newAddress?.city +
        ' ' +
        this.newAddress?.state +
        ' ' +
        this.newAddress?.zip +
        ' ' +
        this.newAddress?.country;
      this.firstName = this.newAddress?.firstName;
      this.lastName = this.newAddress?.lastName;
      this.streetAddress = this.newAddress?.streetAddress;
      this.city = this.newAddress?.city;
      this.state = this.newAddress?.state;
      this.zip = this.newAddress?.zip;
      this.country = this.newAddress?.country;
      this.showPanel2 = false;
    }
    this.subscriptionCartItems = this.cartItems.filter(
      (x) => x.selectDelivery == CartTypeEnum.Subscription
    );
    this.oneTimePriceCartItems = this.cartItems.filter(
      (x) => x.selectDelivery == CartTypeEnum.OneTimePrice
    );
    this.sidebartoggle = true;
    this.cartCalculation();
    this.getAddressByCustomerId(this.customerId);
    this.shippingAddressForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });

    this.onPaymentSubmitForm = this.formBuilder.group({
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiryMonth: ['', [Validators.required]],
      expiryYear: ['', [Validators.required]],
      cardCVV: ['', [Validators.required]],
      isMakePrimaryCard: [''],
      newStreetAddress: [''],
      newCity: [''],
      newState: [''],
      newZip: [''],
      newCountry: [''],
    });
    this.sidebartoggle1 = false;
  }

  createBraintreeUI(clientToken: string) {
    braintree.client.create({
      authorization: clientToken
    }).then((clientInstance) => {
      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          // Override styles for the hosted fields
        },

        // The hosted fields that we will be using
        // NOTE : cardholder's name field is not available in the field options
        // and a separate input field has to be used incase you need it
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '1111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '111'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: 'MM/YY'
          }
        }
      }).then((hostedFieldsInstance) => {

        this.hostedFieldsInstance = hostedFieldsInstance;

        hostedFieldsInstance.on('focus', (event) => {
          const field = event.fields[event.emittedBy];
          const label = this.findLabel(field);
          label.classList.remove('filled'); // added and removed css classes
          // can add custom code for custom validations here
        });

        hostedFieldsInstance.on('blur', (event) => {
          const field = event.fields[event.emittedBy];
          const label = this.findLabel(field); // fetched label to apply custom validations
          // can add custom code for custom validations here
        });

        hostedFieldsInstance.on('empty', (event) => {
          const field = event.fields[event.emittedBy];
          // can add custom code for custom validations here
        });

        hostedFieldsInstance.on('validityChange', (event) => {
          const field = event.fields[event.emittedBy];
          const label = this.findLabel(field);
          if (field.isPotentiallyValid) { // applying custom css and validations
            label.classList.remove('invalid');
          } else {
            label.classList.add('invalid');
          }
          // can add custom code for custom validations here
        });
      });
    });
  }

  tokenizeUserDetails() {
    this.hostedFieldsInstance.tokenize({cardholderName: this.cardholdersName}).then((payload) => {
      console.log(payload);
      // submit payload.nonce to the server from here
    }).catch((error) => {
      console.log(error);
      // perform custom validation here or log errors
    });
  }

  // Fetches the label element for the corresponding field
  findLabel(field: braintree.HostedFieldsHostedFieldsFieldData) {
    return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.shippingAddressForm.controls;
  }

  get p() {
    return this.onPaymentSubmitForm.controls;
  }

  getAddressByCustomerId(id) {
    this.spinner.show();
    this.shopService.getAddressById(id).subscribe((result: any) => {
      if (result.length > 0) {
        this.displayAddress =
          result[1].address1 +
          ' ' +
          result[1].city +
          ' ' +
          result[1].state +
          ' ' +
          result[1].zip +
          ' ' +
          result[1].country;
        this.shippingAddressForm.get('firstName').setValue(result[1].firstName);
        this.shippingAddressForm.get('lastName').setValue(result[1].lastName);
        this.shippingAddressForm
          .get('streetAddress')
          .setValue(result[1].address1);
        this.shippingAddressForm.get('city').setValue(result[1].city);
        this.shippingAddressForm.get('state').setValue(result[1].state);
        this.shippingAddressForm.get('zip').setValue(result[1].zip);
        this.shippingAddressForm.get('country').setValue(result[1].country);
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    });
  }

  onAddressSubmit() {
    debugger;
    this.submitted = true;
    if (this.shippingAddressForm.invalid) {
      return;
    }
    this.spinner.show();
    this.shippingAddressParam = this.getShippingAddressParam(1);
    this.shopService
      .postAddress(this.customerId, this.shippingAddressParam)
      .subscribe((result: any) => {
        if (result.result) {
          this.spinner.hide();
          this.showPanel2 = false;
          this.toastrService.success('Shipping address saved successfully');
          this.displayAddress =
            result.result.address1 +
            ' ' +
            result.result.city +
            ' ' +
            result.result.state +
            ' ' +
            result.result.zip +
            ' ' +
            result.result.country;
        } else {
          this.toastrService.error(result.message);
          this.spinner.hide();
        }
        this.getAddressByCustomerId(this.customerId);
      });
  }

  onPaymentSubmit() {
    debugger;
    this.submitted = true;
    if (this.onPaymentSubmitForm.invalid) {
      return;
    }
    this.spinner.show();
    const payment = new Payment();
    payment.name = this.f.firstName.value;
    if (this.addrnew) {
      payment.address1 = this.p.newStreetAddress.value;
      payment.state = this.p.newState.value;
      payment.phone = "";
      payment.city = this.p.newCity.value;
      payment.country = this.p.newCountry.value;
      payment.zip = this.p.newZip.value;
    } else {
      (payment.address1 = this.f.streetAddress.value),
        (payment.city = this.f.city.value),
        payment.state = this.f.state.value,
        (payment.zip = this.f.zip.value),
      payment.country = this.f.country.value;
    }
    payment.amount = this.cartSummaryTotal;
    payment.cardNumber = this.p.cardNumber.value;
    payment.cvv = this.p.cardCVV.value;
    payment.expMonth = this.p.expiryMonth.value;
    payment.expYear = this.p.expiryYear.value;
    payment.primary =true;
    payment.active =true;
    payment.cardType =1;
    payment.customerId =this.customerId;
    payment.accountNo = '';
    payment.emailAddress = '';
    payment.externalId1 = '';
    payment.externalId2 ='';

    this.shopService.addPayment(payment).subscribe((result: any) => {
      if (result.isCompletedSuccessfully == true) {
        this.spinner.hide();
        this.showPanel3 = true;
        this.toastrService.success('Payment is succesfull');
        this.showPanel2 = false;
      } else {
        this.spinner.hide();
        this.toastrService.error('Payment is not unsuccessfull');
      }
    });
  }

  getShippingAddressParam(type: number) {
    let firstName;
    let lastName;
    let address1;
    let city;
    let state;
    let zip;
    let country;
    let addressType;
    if (type == 1) {
      let addressParam = {
        firstName: this.f.firstName.value,
        lastName: this.f.lastName.value,
        address1: this.f.streetAddress.value,
        city: this.f.city.value,
        state: this.f.state.value,
        zip: this.f.zip.value,
        country: this.f.country.value,
        addressType: 2,
      };
      return addressParam;
    } else {
      if (
        this.newAddress?.firstName != '' ||
        this.newAddress?.firstName != undefined ||
        this.newAddress?.firstName != null
      ) {
        firstName = this.newAddress?.firstName;
      }
      if (
        this.newAddress?.lastName != '' ||
        this.newAddress?.lastName != undefined ||
        this.newAddress?.lastName != null
      ) {
        lastName = this.newAddress?.lastName;
      }
      if (
        this.newAddress?.streetAddress != '' ||
        this.newAddress?.streetAddress != undefined ||
        this.newAddress?.streetAddress != null
      ) {
        address1 = this.newAddress?.streetAddress;
      }
      if (
        this.newAddress?.city != '' ||
        this.newAddress?.city != undefined ||
        this.newAddress?.city != null
      ) {
        city = this.newAddress?.city;
      }
      if (
        this.newAddress?.state != '' ||
        this.newAddress?.state != undefined ||
        this.newAddress?.state != null
      ) {
        state = this.newAddress?.state;
      }
      if (
        this.newAddress?.zip != 0 ||
        this.newAddress?.zip != undefined ||
        this.newAddress?.zip != null
      ) {
        zip = this.newAddress?.zip;
      }
      if (
        this.newAddress?.country != '' ||
        this.newAddress?.country != undefined ||
        this.newAddress?.country != null
      ) {
        country = this.newAddress?.country;
      }

      let addressParam = {
        AddressType: 0,
        StreetAddress: address1,
        City: city,
        State: state,
        Zip: zip,
        Country: country,
        FirstName: firstName,
        LastName: lastName,
      };
      return addressParam;
    }
  }

  getNewCreditCardParam() {
    let cardName;
    let cardNumber;
    let expiryMonth;
    let expiryYear;
    let cardCVV;
    let isMakePrimaryCard;

    if (
      this.cardName != '' ||
      this.cardName != undefined ||
      this.cardName != null
    ) {
      cardName = this.cardName;
    }
    if (
      this.cardNumber != 0 ||
      this.cardNumber != undefined ||
      this.cardNumber != null
    ) {
      cardNumber = this.cardNumber;
    }
    if (
      this.expiryMonth != 0 ||
      this.expiryMonth != undefined ||
      this.expiryMonth != null
    ) {
      expiryMonth = this.expiryMonth;
    }
    if (
      this.expiryYear != 0 ||
      this.expiryYear != undefined ||
      this.expiryYear != null
    ) {
      expiryYear = this.expiryYear;
    }
    if (
      this.cardCVV != 0 ||
      this.cardCVV != undefined ||
      this.cardCVV != null
    ) {
      cardCVV = this.cardCVV;
    }
    if (this.isMakePrimaryCard != undefined || this.isMakePrimaryCard != null) {
      isMakePrimaryCard = this.isMakePrimaryCard;
    }
    let newCardParam = {
      CardName: cardName,
      cardNumber: cardNumber,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      cardCVV: cardCVV,
      isMakePrimaryCard: isMakePrimaryCard,
    };
    return newCardParam;
  }

  shippingAddressType(billingAddressType: string) {
    if (billingAddressType == 'shippingAddress') {
      this.addrnew = false;
    } else {
      this.addrnew = true;
    }
  }

  getBillingAddressParam() {
    let firstName;
    let lastName;
    let newStreetAddress;
    let newCity;
    let newState;
    let newZip;
    let newCountry;

    if (
      this.firstName != '' ||
      this.firstName != undefined ||
      this.firstName != null
    ) {
      firstName = this.firstName;
    }
    if (
      this.lastName != '' ||
      this.lastName != undefined ||
      this.lastName != null
    ) {
      lastName = this.lastName;
    }
    if (
      this.newStreetAddress != '' ||
      this.newStreetAddress != undefined ||
      this.newStreetAddress != null
    ) {
      newStreetAddress = this.newStreetAddress;
    }
    if (
      this.newCity != '' ||
      this.newCity != undefined ||
      this.newCity != null
    ) {
      newCity = this.newCity;
    }
    if (
      this.newState != '' ||
      this.newState != undefined ||
      this.newState != null
    ) {
      newState = this.newState;
    }
    if (this.newZip != 0 || this.newZip != undefined || this.newZip != null) {
      newZip = this.newZip;
    }
    if (
      this.newCountry != '' ||
      this.newCountry != undefined ||
      this.newCountry != null
    ) {
      newCountry = this.newCountry;
    }
    let newBillingAddressParam = {
      FirstName: firstName,
      LastName: lastName,
      StreetAddress: newStreetAddress,
      City: newCity,
      State: newState,
      Zip: newZip,
      Country: newCountry,
    };
    return newBillingAddressParam;
  }

  onCheckboxChange(event: any) {
    this.isMakePrimaryCard = event.target.checked;
  }

  // convenience getter for easy access to form fields
  // get f() { return this.checkoutForm.controls; }
  //  get shippingAddress(): FormArray {
  //    return this.ShippingAddressForm.get("shippingAddressFormGroup") as FormArray;
  //  }

  //  get cardForm(): FormArray {
  //    return this.checkoutForm.get("cardFormGroup") as FormArray;
  //  }

  onSelectCardChange(id: number) {
    switch (id) {
      case 1:
        //prepare existing card value;
        this.isCardDisabled = true;
        this.isCardType = id;
        //console.log(id);

        break;
      case 2:
        // take new card value and create token and store it to database and get;
        this.isCardDisabled = false;
        this.isCardType = id;
        //console.log(id);
        setTimeout(() => {
          this.shopService.getClientToken()
            .subscribe(
              (data: any) => {
                console.log("Client Token", data.token);
                this.createBraintreeUI(data.token);
              });
        }, 1000);
        break;
      default:
        break;
    }

  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

  onItemChange(id: number) {
    this.isShipmentMethod = id;
    console.log(this.isShipmentMethod);
  }

  addPromo(type: number) {
    this.promoPercentage = 0;
    // this.sessionService.removeSessionItem('promoCode')
    let oneTimePriceWithoutOffer = this.cartItems.filter(
      (x) =>
        x.selectDelivery == CartTypeEnum.OneTimePrice &&
        x.bundle != 'specialOffer'
    );
    if (oneTimePriceWithoutOffer.length > 0) {
      if (
        this.promocode_onetime != null ||
        this.promocode_onetime != '' ||
        this.promocode_onetime != undefined
      ) {
        this.spinner.show();
        this.shopService
          .getPromoData(this.promocode_onetime)
          .subscribe((result) => {
            this.promoItem = result;
            if (this.promoItem.errorMessage == null) {
              this.promoPercentage =
                (this.subtotalOneTimePrice * this.promoItem.discountPer) / 100;
              // this.subtotalOneTimePrice = this.subtotalOneTimePrice - this.promoPercentage;
              this.cartCalculation();
              //this.isDisabled=true;
              if (type == 0) {
                this.toastrService.success(
                  "Promo code applied succesfully you save $'" +
                    this.promoPercentage.toFixed(2) +
                    "'."
                );
              }
              this.spinner.hide();
            } else {
              // this.isDisabled=false;
              this.toastrService.error(this.promoItem.errorMessage);
              this.sessionService.removeSessionItem('promoCode');
              this.cartCalculation();
              this.spinner.hide();
            }
          });
      }
    } else {
      this.sessionService.removeSessionItem('promoCode');
      this.promocode_onetime = '';
      this.promoPercentage = 0;
      this.cartCalculation();
    }
  }

  clearPromo(event: any) {
    if (
      event.target.value == '' ||
      event.target.value == undefined ||
      event.target.value == null
    ) {
      this.sessionService.removeSessionItem('promoCode');
      this.promocode_onetime = '';
      this.promoPercentage = 0;
      this.cartCalculation();
    } else {
      this.sessionService.setSessionItem('promoCode', this.promocode_onetime);
      //this.addPromo();
    }
  }

  cartCalculation() {
    this.orderTotal = 0;
    this.subtotalOneTimePrice = 0;
    this.subTotalSubscriptionPrice = 0;
    this.discount15Percent = 0;
    this.subTotalSubscriptionPriceAfterDiscount = 0;
    this.totalDiscount = 0;
    this.cartSummaryTotal = 0;
    this.orderTotal = this.getOrderTotal();
    this.cartItems = this.sessionService.getSessionObject('productCartItems');
    //subsciption item List
    this.subscriptionCartItems = this.cartItems.filter(
      (x) => x.selectDelivery == CartTypeEnum.Subscription
    );
    //onetime item list
    this.oneTimePriceCartItems = this.cartItems.filter(
      (x) => x.selectDelivery == CartTypeEnum.OneTimePrice
    );
    //special offer item
    this.specialOffer = this.oneTimePriceCartItems.filter(
      (x) => x.bundle == 'specialOffer'
    );
    if (
      this.specialOffer != null &&
      this.specialOffer != undefined &&
      this.specialOffer.length > 0
    ) {
      let specialOfferItem = this.oneTimePriceCartItems.filter((x) => {
        if (
          x.selectDelivery == CartTypeEnum.OneTimePrice &&
          x.bundle == 'specialOffer'
        ) {
          return x;
        }
      });
      const index: number =
        this.oneTimePriceCartItems.indexOf(specialOfferItem);
      if (index !== -1) {
        this.oneTimePriceCartItems.splice(index, 1);
      }
    }

    this.subtotalOneTimePrice = this.getSubTotal(this.oneTimePriceCartItems);
    if (
      this.promocode_onetime != null &&
      this.promocode_onetime != undefined &&
      this.promocode_onetime != ''
    ) {
      this.subtotalOneTimePrice =
        this.subtotalOneTimePrice - this.promoPercentage;
      this.totalDiscount = this.totalDiscount + this.promoPercentage;
    }
    this.subTotalSubscriptionPrice = this.getSubTotal(
      this.subscriptionCartItems
    );
    this.discount15Percent = (this.subTotalSubscriptionPrice * 15) / 100;
    this.subTotalSubscriptionPriceAfterDiscount =
      this.subTotalSubscriptionPrice - this.discount15Percent;
    this.totalDiscount = this.totalDiscount + this.discount15Percent;
    this.cartSummaryTotal =
      this.subtotalOneTimePrice + this.subTotalSubscriptionPriceAfterDiscount;
  }

  getOrderTotal() {
    let multiplyprice = 0;
    let Temp = 0;
    for (var i = 0; i <= this.cartItems.length - 1; i++) {
      multiplyprice =
        parseFloat(this.cartItems[i].price) * this.cartItems[i].quantityModel;
      if (this.cartItems[i].bundle == 'multiple') {
        multiplyprice = parseFloat(this.cartItems[i].price) * 2;
        multiplyprice = multiplyprice * this.cartItems[i].quantityModel;
      } else {
        multiplyprice =
          parseFloat(this.cartItems[i].price) * this.cartItems[i].quantityModel;
      }
      Temp = Temp + multiplyprice;
    }
    return +Temp;
  }

  toggleShow() {
    this.sidebartoggle = !this.sidebartoggle;
    this.sidebartoggle1 = !this.sidebartoggle1;
    console.log(this.sidebartoggle);
  }

  isDataAvailable = false;
  toShowData = false;
  refId: any;
  refName: any;

  referrerRecords = [];

  selectedData = this.referrerRecords;

  filterItem(val) {
    //value not empty
    if (val !== '') {
      //Data filter method
      this.selectedData = this.referrerRecords.filter(
        (x) =>
          x.referrer_name.includes(val) ||
          x.referrer_name.includes(val.toUpperCase()) ||
          x.referrer_name.includes(val.toLowerCase()) ||
          x.id == parseInt(val)
      );
      if (this.selectedData.length == 0) {
        this.isDataAvailable = false;
      }
    } else {
      this.selectedData = this.referrerRecords;

      this.isDataAvailable = true;
    }
  }

  choose_referrer(data: any) {
    if (
      this.referrerRecords.filter((x) => x.id == parseInt(data.id)).length > 0
    ) {
      this.refId = data.id;
      this.refName = this.referrerRecords
        .filter((x) => x.id == parseInt(data.id))
        .map((ele) => ele.referrer_name);
      this.toShowData = true;
    } else {
      this.toShowData = false;
    }
  }

  getQuantityVal(qty: string) {
    var value = 0;
    if (qty == 'Qty1') {
      value = 1;
    }
    if (qty == 'Qty2') {
      value = 2;
    }
    if (qty == 'Qty3') {
      value = 3;
    }
    if (qty == 'Qty4') {
      value = 4;
    }
    return value;
  }

  getSubTotal(ProductList: any[]) {
    let multiplyprice = 0;
    let Temp = 0;
    for (var i = 0; i <= ProductList.length - 1; i++) {
      multiplyprice =
        parseFloat(ProductList[i].Price) * ProductList[i].quantityModel;
      Temp = Temp + multiplyprice;
    }
    return +Temp;
  }

  onSubmit() {
    debugger;
    this.submitted = true;
    // if (this.checkoutForm.invalid) {
    //   return this.toastrService.error("Please fill the required field shipping address and card");
    // }
    // if (this.startDate == null) {
    //   return this.toastrService.error("Please select the start date")
    // }
    this.hostedFieldsInstance.tokenize({cardholderName: this.cardholdersName}).then((payload) => {
      console.log(payload);
      debugger;
      var startDate;
      if (this.startDate == 'undefined') {
        startDate = new Date();
      } else {
        //startDate = new Date(this.startDate);
        startDate = new Date();
      }

      // let firstName = this.checkoutForm.get(['shippingAddressFormGroup', 'firstName']).value ? this.checkoutForm.get(['shippingAddressFormGroup', 'firstName']).value : '';
      // let lastName = this.checkoutForm.get(['shippingAddressFormGroup', 'lastName']).value ? this.checkoutForm.get(['shippingAddressFormGroup', 'lastName']).value : '';
      // let streetAddress = this.checkoutForm.get(['shippingAddressFormGroup', 'streetAddress']).value ? this.checkoutForm.get(['shippingAddressFormGroup', 'streetAddress']).value : '';
      // let city = this.checkoutForm.get(['shippingAddressFormGroup', 'city']).value ? this.checkoutForm.get(['shippingAddressFormGroup', 'city']).value : '';
      // let state = this.checkoutForm.get(['shippingAddressFormGroup', 'state']).value ? this.checkoutForm.get(['shippingAddressFormGroup', 'state']).value : '';
      // let zip = this.checkoutForm.get(['shippingAddressFormGroup', 'zip']).value ? this.checkoutForm.get(['shippingAddressFormGroup', 'zip']).value : '';
      // let country = this.checkoutForm.get(['shippingAddressFormGroup', 'country']).value ? this.checkoutForm.get(['shippingAddressFormGroup', 'country']).value : '';
      // let newStreetAddress = this.checkoutForm.get(['newShippingAddressFormGroup', 'newStreetAddress']).value ? this.checkoutForm.get(['newShippingAddressFormGroup', 'newStreetAddress']).value : '';
      // let newCity = this.checkoutForm.get(['newShippingAddressFormGroup', 'newCity']).value ? this.checkoutForm.get(['newShippingAddressFormGroup', 'newCity']).value : '';
      // let newState = this.checkoutForm.get(['newShippingAddressFormGroup', 'newState']).value ? this.checkoutForm.get(['newShippingAddressFormGroup', 'newState']).value : '';
      // let newZip = this.checkoutForm.get(['newShippingAddressFormGroup', 'newZip']).value ? this.checkoutForm.get(['newShippingAddressFormGroup', 'newZip']).value : '';
      // let newCountry = this.checkoutForm.get(['newShippingAddressFormGroup', 'newCountry']).value ? this.checkoutForm.get(['newShippingAddressFormGroup', 'newCountry']).value : '';
      // let cardName = this.checkoutForm.get(['cardFormGroup', 'cardName']).value ? this.checkoutForm.get(['cardFormGroup', 'cardName']).value : '';
      // let cardNumber = this.checkoutForm.get(['cardFormGroup', 'cardNumber']).value ? this.checkoutForm.get(['cardFormGroup', 'cardNumber']).value : 0;
      // let expiryMonth = this.checkoutForm.get(['cardFormGroup', 'expiryMonth']).value ? this.checkoutForm.get(['cardFormGroup', 'expiryMonth']).value : 0;
      // let expiryYear = this.checkoutForm.get(['cardFormGroup', 'expiryYear']).value ? this.checkoutForm.get(['cardFormGroup', 'expiryYear']).value : 0;
      // let cardCVV = this.checkoutForm.get(['cardFormGroup', 'cardCVV']).value ? this.checkoutForm.get(['cardFormGroup', 'cardCVV']).value : 0;
      // let isMakePrimaryCard = this.checkoutForm.get(['cardFormGroup', 'isMakePrimaryCard']).value ? this.checkoutForm.get(['cardFormGroup', 'isMakePrimaryCard']).value : '';
      this.spinner.show();

      this.cartItems.forEach((element) => {
        this.orderDetails.push({
          descriptionOverride: '',
          other10EachOverride: 0,
          other9EachOverride: 0,
          other8EachOverride: 0,
          other7EachOverride: 0,
          other6EachOverride: 0,
          other5EachOverride: 0,
          other4EachOverride: 0,
          other3EachOverride: 0,
          other2EachOverride: 0,
          other1EachOverride: 0,
          commissionableVolumeEachOverride:
            element.commissionableVolumeEachOverride,
          businessVolumeEachOverride: element.businessVolumeEachOverride,
          shippingPriceEachOverride: element.shippingPriceEachOverride,
          taxableEachOverride: element.taxableEachOverride,
          priceEachOverride: element.priceEachOverride,
          parentItemCode: element.parentItemCode,
          quantity: element.quantityModel,
          parentOrderDetailID: null,
          orderDetailID: null,
          itemCode: element.itemCode,
          reference1: null,
          advancedAutoOptions: '',
        });
      });

      const createOrderRequest = new CreateOrderRequest();
      createOrderRequest.other14 = '';
      createOrderRequest.other15 = '';
      createOrderRequest.other16 = '';
      createOrderRequest.other17 = '';
      createOrderRequest.other18 = '';
      createOrderRequest.other19 = '';
      createOrderRequest.other20 = '';
      createOrderRequest.other13 = '';
      createOrderRequest.taxRateOverride = 0;
      createOrderRequest.shippingAmountOverride = 0;
      createOrderRequest.transferVolumeToID = 0;
      createOrderRequest.returnOrderID = 0;
      createOrderRequest.overwriteExistingOrder = false;
      createOrderRequest.existingOrderID = 0;
      createOrderRequest.partyID = 1;
      createOrderRequest.details = this.orderDetails;
      createOrderRequest.suppressPackSlipPrice = true;
      createOrderRequest.transferVolumeToKey = '';
      createOrderRequest.returnOrderKey = '';
      createOrderRequest.manualOrderKey = '';
      createOrderRequest.manualOrderID = 0;
      createOrderRequest.existingOrderKey = '';
      createOrderRequest.other12 = '';
      createOrderRequest.notes = '';
      createOrderRequest.customerID = 0;
      createOrderRequest.orderStatus = 1;
      createOrderRequest.orderDate = startDate;
      createOrderRequest.currencyCode = '';
      createOrderRequest.warehouseID = 0;
      createOrderRequest.shipMethodID = 0;
      createOrderRequest.priceType = 0;
      createOrderRequest.firstName = this.f.firstName.value;
      createOrderRequest.middleName = '';
      createOrderRequest.lastName = this.f.lastName.value;
      createOrderRequest.other11 = '';
      createOrderRequest.nameSuffix = '';
      createOrderRequest.address1 = this.f.streetAddress.value;
      createOrderRequest.address2 = '';
      createOrderRequest.address3 = '';
      createOrderRequest.city = this.f.city.value;
      createOrderRequest.state = 'TX'; //this.f.state.value;
      createOrderRequest.zip = this.f.zip.value;
      createOrderRequest.country = 'US'; //this.f.country.value
      createOrderRequest.county = '';
      createOrderRequest.email = '';
      createOrderRequest.phone = '';
      createOrderRequest.company = '';
      createOrderRequest.customerKey = '';


      const chargeCreditCardTokenRequest = new ChargeCreditCardTokenRequest();
      chargeCreditCardTokenRequest.otherData9 = '';
      chargeCreditCardTokenRequest.otherData8 = '';
      chargeCreditCardTokenRequest.otherData7 = '';
      chargeCreditCardTokenRequest.otherData6 = '';
      chargeCreditCardTokenRequest.otherData5 = '';
      chargeCreditCardTokenRequest.otherData4 = '';
      chargeCreditCardTokenRequest.otherData3 = '';
      chargeCreditCardTokenRequest.otherData2 = '';
      chargeCreditCardTokenRequest.otherData1 = '';
      chargeCreditCardTokenRequest.clientIPAddress = '';
      chargeCreditCardTokenRequest.merchantWarehouseIDOverride = 0;
      chargeCreditCardTokenRequest.maxAmount = 0;
      chargeCreditCardTokenRequest.otherData10 = '';
      if (this.addrnew == false) {
        chargeCreditCardTokenRequest.billingCountry = '';
        chargeCreditCardTokenRequest.billingZip = '';
        chargeCreditCardTokenRequest.billingState = '';
        chargeCreditCardTokenRequest.billingCity = '';
        chargeCreditCardTokenRequest.billingAddress2 = '';
        chargeCreditCardTokenRequest.billingAddress = '';
      } else {
        chargeCreditCardTokenRequest.billingCountry = 'US'; //this.f.country.value
        chargeCreditCardTokenRequest.billingZip = this.f.zip.value;
        chargeCreditCardTokenRequest.billingState = 'TX'; //this.f.state.value;
        chargeCreditCardTokenRequest.billingCity = this.f.city.value;
        chargeCreditCardTokenRequest.billingAddress2 = '';
        chargeCreditCardTokenRequest.billingAddress = this.f.streetAddress.value;
      }
      chargeCreditCardTokenRequest.expirationMonth = this.p.expiryMonth.value;
      chargeCreditCardTokenRequest.creditCardType = 0;
      chargeCreditCardTokenRequest.cvcCode = this.p.cardCVV.value;
      chargeCreditCardTokenRequest.billingCountry = 'US'; //this.f.country.value
      chargeCreditCardTokenRequest.billingZip = this.f.zip.value;
      chargeCreditCardTokenRequest.billingState = 'TX'; //this.f.state.value;
      chargeCreditCardTokenRequest.billingCity = this.f.city.value;
      chargeCreditCardTokenRequest.billingAddress2 = '';
      chargeCreditCardTokenRequest.billingAddress = this.f.streetAddress.value;
      chargeCreditCardTokenRequest.creditCardToken = payload.nonce;
      chargeCreditCardTokenRequest.expirationYear = this.p.expiryYear.value;
      chargeCreditCardTokenRequest.orderKey = '';

      const transactionalRequestModel = new TransactionalRequestModel();
      transactionalRequestModel.createOrderRequest = createOrderRequest;
      transactionalRequestModel.chargeCreditCardTokenRequest = chargeCreditCardTokenRequest;
      transactionalRequestModel.setListItemRequest = this.cartItems;
      console.log("CART: ", this.cartItems);

      this.shopService
        .checkOutItems(transactionalRequestModel)
        .subscribe((result: any) => {
          console.log('Result', result);
          this.router.navigate(['/store/thankyou']);
          this.spinner.hide();
        });
      // submit payload.nonce to the server from here
    }).catch((error) => {
      console.log(error);
      // perform custom validation here or log errors
    });
  }
}

import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartTypeEnum } from '@app/_models/cart-type-enum';
import { ChargeCreditCardTokenRequest, CreateAutoOrderRequest, CreateCustomerRequest, CreateOrderRequest, OrderDetailRequest, SetAccountCreditCardTokenRequest, TransactionalRequestModel } from '@app/_models/checkout';
import { SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  addrnew = false;
  sidebartoggle: boolean = true;
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  checkoutForm: FormGroup;
  inputdata: any;
  promocodepay: any;
  loyalpointz: any;
  filterTerm: any;
  cartItems: any[] = [];
  submitted = false;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop'
  };
  subscriptionCartItems: any[] = [];
  oneTimePriceCartItems: any[] = [];
  subtotalOneTimePrice: any = 0;
  subtotalSubscriptionTimePrice: any = 0;
  TotalPrice: any;
  orderDetails: any[] = [];
  subscriptionTotalPrice: any;
  unSubscriptionTotalPrice: any;
  minDate = new Date();
  startDate: any;

  constructor(private modalService: NgbModal,
    private shopService: ShopService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
    private spinner: NgxSpinnerService,) {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    debugger
    this.startDate = this.sessionService.getSessionItem('startDate');
    this.subscriptionTotalPrice = this.sessionService.getSessionObject('subscriptionTotal');
    this.unSubscriptionTotalPrice = this.sessionService.getSessionObject('unSubscriptionTotal');
    this.TotalPrice = this.subscriptionTotalPrice + this.unSubscriptionTotalPrice;
    this.cartItems = this.sessionService.getSessionObject('productCartItems');
    this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
    this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
    this.oneTimePriceCartItems.forEach(element => {
      this.subtotalOneTimePrice += element.bv;
    });
    this.subtotalOneTimePrice = +this.subtotalOneTimePrice.toFixed(2);
    this.subscriptionCartItems.forEach(element => {
      this.subtotalSubscriptionTimePrice += element.bv;
    });
    this.subtotalSubscriptionTimePrice = +this.subtotalSubscriptionTimePrice.toFixed(2);
    //this.TotalPrice = this.subtotalSubscriptionTimePrice + this.subtotalOneTimePrice;
    this.sidebartoggle = true;
    this.checkoutForm = this.formBuilder.group(
      {
        SubsScheduleDate: [''],
        shippingAddressFormGroup: this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          streetAddress: ['', Validators.required],
          state: ['', Validators.required],
          city: ['', Validators.required],
          country: ['', Validators.required],
          zip: ['', [Validators.maxLength(5), Validators.minLength(5)]]
        }),
        isShipmentMethod: [''],
        promoCodePay: [''],
        loyalPointz: [''],
        isSelectCard: [''],
        cardFormGroup: this.formBuilder.group({
          cardName: [''],
          cardNumber: [''],
          expiryMonth: [''],
          expiryYear: [''],
          cardCVV: [''],
          newCustomRadio: [''],
          isMakePrimaryCard: ['']
        }),
        newShippingAddressFormGroup: this.formBuilder.group({
          newStreetAddress: [''],
          newCity: [''],
          newState: [''],
          newZip: [''],
          newCountry: ['']
        }),
        // reviewFormGroup: this.formBuilder.group({

        // })
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.checkoutForm.controls; }

  open(content) {
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


  toggleShow() {
    this.sidebartoggle = !this.sidebartoggle;
    console.log(this.sidebartoggle);
  }

  isDataAvailable = false;
  toShowData = false;
  refId: any;
  refName: any;


  referrerRecords = [
    {
      "id": 1,
      "referrer_name": "Amanda Rich",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 2,
      "referrer_name": "Amanda Walsh",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 3,
      "referrer_name": "John Carter",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 4,
      "referrer_name": "Mark Brown",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 5,
      "referrer_name": "Eliot Marshall",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 6,
      "referrer_name": "Amanda Boyce",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 7,
      "referrer_name": "James George",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 8,
      "referrer_name": "Casper Max",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
  ]

  selectedData = this.referrerRecords;
  filterItem(val) {
    //value not empty
    if (val !== "") {
      //Data filter method
      this.selectedData = this.referrerRecords.filter(x => (x.referrer_name.includes(val) || x.referrer_name.includes(val.toUpperCase()) || x.referrer_name.includes(val.toLowerCase())) || x.id == parseInt(val));
      if (this.selectedData.length == 0) {
        this.isDataAvailable = false;
      }
    }
    else {
      this.selectedData = this.referrerRecords;
      debugger;
      this.isDataAvailable = true;
    }
  }

  choose_referrer(data: any) {
    debugger;
    if (this.referrerRecords.filter(x => x.id == parseInt(data.id)).length > 0) {
      debugger;
      this.refId = data.id;
      debugger;
      this.refName = this.referrerRecords.filter(x => x.id == parseInt(data.id)).map(ele => ele.referrer_name);
      debugger;
      this.toShowData = true;
    }
    else {
      this.toShowData = false;
    }
  }

  differentAddress() {
    this.addrnew = true;
  }

  sameshippingAddress() {
    this.addrnew = false;
  }

  getQuantityVal(qty: string) {
    var value = 0;
    if (qty == "Qty1") {
      value = 1;
    }
    if (qty == "Qty2") {
      value = 2;
    }
    if (qty == "Qty3") {
      value = 3;
    }
    if (qty == "Qty4") {
      value = 4;
    }
    return value;
  }

  onSubmit() {
    debugger;
    this.submitted = true;
    if (this.checkoutForm.invalid) {
      return;
    }
    this.spinner.show();
    this.cartItems.forEach(element => {
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
        commissionableVolumeEachOverride: element.commissionableVolumeEachOverride,
        businessVolumeEachOverride: element.businessVolumeEachOverride,
        shippingPriceEachOverride: element.shippingPriceEachOverride,
        taxableEachOverride: element.taxableEachOverride,
        priceEachOverride: element.priceEachOverride,
        parentItemCode: element.parentItemCode,
        quantity: this.getQuantityVal(element.quantityModel),
        parentOrderDetailID: null,
        orderDetailID: null,
        itemCode: element.itemCode,
        reference1: null,
        advancedAutoOptions: ''
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
    createOrderRequest.orderDate = "2021-09-01T09:28:10.207Z";
    createOrderRequest.currencyCode = '';
    createOrderRequest.warehouseID = 0;
    createOrderRequest.shipMethodID = 0;
    createOrderRequest.priceType = 0;
    createOrderRequest.firstName = this.checkoutForm.value.shippingAddressFormGroup.firstName;
    createOrderRequest.middleName = '';
    createOrderRequest.lastName = this.checkoutForm.value.shippingAddressFormGroup.lastName;
    createOrderRequest.other11 = '';
    createOrderRequest.nameSuffix = '';
    createOrderRequest.address1 = this.checkoutForm.value.shippingAddressFormGroup.streetAddress;
    createOrderRequest.address2 = '';
    createOrderRequest.address3 = '';
    createOrderRequest.city = this.checkoutForm.value.shippingAddressFormGroup.city;
    createOrderRequest.state = this.checkoutForm.value.shippingAddressFormGroup.state;
    createOrderRequest.zip = this.checkoutForm.value.shippingAddressFormGroup.zip;
    createOrderRequest.country = this.checkoutForm.value.shippingAddressFormGroup.country;
    createOrderRequest.county = '';
    createOrderRequest.email = '';
    createOrderRequest.phone = '';
    createOrderRequest.company = '';
    createOrderRequest.customerKey = '';

    const createCustomerRequest = new CreateCustomerRequest();
    createCustomerRequest.subscribeFromIPAddress = '';
    createCustomerRequest.subscribeToBroadcasts = false;
    createCustomerRequest.field15 = '';
    createCustomerRequest.field14 = '';
    createCustomerRequest.field13 = '';
    createCustomerRequest.field12 = '';
    createCustomerRequest.field11 = '';
    createCustomerRequest.field10 = '';
    createCustomerRequest.field9 = '';
    createCustomerRequest.field8 = '';
    createCustomerRequest.field7 = '';
    createCustomerRequest.field6 = '';
    createCustomerRequest.field5 = '';
    createCustomerRequest.field4 = '';
    createCustomerRequest.field3 = '';
    createCustomerRequest.field2 = '';
    createCustomerRequest.field1 = '';
    createCustomerRequest.birthDate = "2021-09-01T09:28:10.207Z"
    createCustomerRequest.isSalesTaxExempt = false;
    createCustomerRequest.currencyCode = '';
    createCustomerRequest.salesTaxExemptExpireDate = '';
    createCustomerRequest.payableToName = '';
    createCustomerRequest.defaultWarehouseID = 0;
    createCustomerRequest.sponsorKey = '';
    createCustomerRequest.otherAddressVerified = true;
    createCustomerRequest.mailAddressVerified = true;
    createCustomerRequest.mainAddressVerified = true;
    createCustomerRequest.useBinaryHoldingTank = true;
    createCustomerRequest.binaryPlacementPreference = 0;
    createCustomerRequest.nameSuffix = '';
    createCustomerRequest.middleName = '';
    createCustomerRequest.date5 = '';
    createCustomerRequest.date4 = '';
    createCustomerRequest.date3 = '';
    createCustomerRequest.date2 = '';
    createCustomerRequest.date1 = '';
    createCustomerRequest.taxIDType = '';
    createCustomerRequest.checkThreshold = 0;
    createCustomerRequest.languageID = 0;
    createCustomerRequest.payableType = '';
    createCustomerRequest.entryDate = "2021-09-01T09:28:10.207Z";
    createCustomerRequest.salesTaxID = '';
    createCustomerRequest.taxID = '';
    createCustomerRequest.manualCustomerID = 0;
    createCustomerRequest.mainCounty = '';
    createCustomerRequest.mainCountry = '';
    createCustomerRequest.mainZip = '';
    createCustomerRequest.mainState = '';
    createCustomerRequest.mainCity = '';
    createCustomerRequest.mainAddress3 = '';
    createCustomerRequest.mainAddress2 = '';
    createCustomerRequest.mainAddress1 = '';
    createCustomerRequest.notes = '';
    createCustomerRequest.fax = '';
    createCustomerRequest.mobilePhone = '';
    createCustomerRequest.phone2 = '';
    createCustomerRequest.phone = '';
    createCustomerRequest.email = '';
    createCustomerRequest.customerStatus = 0;
    createCustomerRequest.customerType = 0;
    createCustomerRequest.company = '';
    createCustomerRequest.lastName = '';
    createCustomerRequest.firstName = '';
    createCustomerRequest.mailAddress1 = '';
    createCustomerRequest.mailAddress2 = '';
    createCustomerRequest.mailAddress3 = '';
    createCustomerRequest.mailCity = '';
    createCustomerRequest.useManualCustomerID = false;
    createCustomerRequest.sponsorID = 0;
    createCustomerRequest.insertUnilevelTree = false;
    createCustomerRequest.enrollerID = 0;
    createCustomerRequest.insertEnrollerTree = true;
    createCustomerRequest.loginPassword = '';
    createCustomerRequest.loginName = '';
    createCustomerRequest.canLogin = true;
    createCustomerRequest.otherCounty = '';
    createCustomerRequest.enrollerKey = '';
    createCustomerRequest.otherCountry = '';
    createCustomerRequest.otherState = '';
    createCustomerRequest.otherCity = '';
    createCustomerRequest.otherAddress3 = '';
    createCustomerRequest.otherAddress2 = '';
    createCustomerRequest.otherAddress1 = '';
    createCustomerRequest.mailCounty = '';
    createCustomerRequest.mailCountry = '';
    createCustomerRequest.mailZip = '';
    createCustomerRequest.mailState = '';
    createCustomerRequest.otherZip = '';
    createCustomerRequest.manualCustomerKey = '';

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
      chargeCreditCardTokenRequest.billingCountry = this.checkoutForm.value.shippingAddressFormGroup.country;
      chargeCreditCardTokenRequest.billingZip = this.checkoutForm.value.shippingAddressFormGroup.zip;
      chargeCreditCardTokenRequest.billingState = this.checkoutForm.value.shippingAddressFormGroup.state;
      chargeCreditCardTokenRequest.billingCity = this.checkoutForm.value.shippingAddressFormGroup.city;
      chargeCreditCardTokenRequest.billingAddress2 = '';
      chargeCreditCardTokenRequest.billingAddress = this.checkoutForm.value.shippingAddressFormGroup.streetAddress;

    } else{
      chargeCreditCardTokenRequest.billingCountry = this.checkoutForm.value.newShippingAddressFromGroup.country;
      chargeCreditCardTokenRequest.billingZip = this.checkoutForm.value.newShippingAddressFromGroup.zip;
      chargeCreditCardTokenRequest.billingState = this.checkoutForm.value.newShippingAddressFromGroup.state;
      chargeCreditCardTokenRequest.billingCity = this.checkoutForm.value.newShippingAddressFromGroup.city;
      chargeCreditCardTokenRequest.billingAddress2 = '';
      chargeCreditCardTokenRequest.billingAddress = this.checkoutForm.value.newShippingAddressFromGroup.streetAddress;

    }
    chargeCreditCardTokenRequest.expirationMonth = this.checkoutForm.value.CardFormGroup.expiryMonth;
    chargeCreditCardTokenRequest.creditCardType = 0;
    chargeCreditCardTokenRequest.cvcCode = this.checkoutForm.value.CardFormGroup.cardCVV;
    chargeCreditCardTokenRequest.billingCountry = this.checkoutForm.value.shippingAddressFormGroup.country;
    chargeCreditCardTokenRequest.billingZip = this.checkoutForm.value.shippingAddressFormGroup.zip;
    chargeCreditCardTokenRequest.billingState = this.checkoutForm.value.shippingAddressFormGroup.state;
    chargeCreditCardTokenRequest.billingCity = this.checkoutForm.value.shippingAddressFormGroup.city;
    chargeCreditCardTokenRequest.billingAddress2 = '';
    chargeCreditCardTokenRequest.billingAddress = this.checkoutForm.value.shippingAddressFormGroup.streetAddress;
    chargeCreditCardTokenRequest.creditCardToken = '';
    chargeCreditCardTokenRequest.expirationYear = this.checkoutForm.value.CardFormGroup.expiryYear;
    chargeCreditCardTokenRequest.orderKey = '';

    const createAutoOrderRequest = new CreateAutoOrderRequest();
    createAutoOrderRequest.county = '';
    createAutoOrderRequest.email = '';
    createAutoOrderRequest.phone = '';
    createAutoOrderRequest.notes = '';
    createAutoOrderRequest.other11 = '';
    createAutoOrderRequest.other12 = '';
    createAutoOrderRequest.other13 = '';
    createAutoOrderRequest.other14 = '';
    createAutoOrderRequest.other15 = '';
    createAutoOrderRequest.other16 = '';
    createAutoOrderRequest.other17 = '';
    createAutoOrderRequest.other18 = '';
    createAutoOrderRequest.other19 = '';
    createAutoOrderRequest.other20 = '';
    createAutoOrderRequest.country = '';
    createAutoOrderRequest.description = '';
    createAutoOrderRequest.overwriteExistingAutoOrder = true;
    createAutoOrderRequest.existingAutoOrderID = 0;
    createAutoOrderRequest.details = this.orderDetails;
    createAutoOrderRequest.other16 = '';
    createAutoOrderRequest.frequency = 1;
    createAutoOrderRequest.startDate = "2021-09-01T09:28:10.207Z";
    createAutoOrderRequest.stopDate = '';
    createAutoOrderRequest.specificDayInterval = 0;
    createAutoOrderRequest.currencyCode = '';
    createAutoOrderRequest.warehouseID = 0;
    createAutoOrderRequest.shipMethodID = 0;
    createAutoOrderRequest.priceType = 0;
    createAutoOrderRequest.processType = '';
    createAutoOrderRequest.firstName = '';
    createAutoOrderRequest.middleName = '';
    createAutoOrderRequest.lastName = '';
    createAutoOrderRequest.nameSuffix = '';
    createAutoOrderRequest.company = '';
    createAutoOrderRequest.address1 = '';
    createAutoOrderRequest.address2 = '';
    createAutoOrderRequest.address3 = '';
    createAutoOrderRequest.customerKey = '';
    createAutoOrderRequest.customFrequencyTy = 0;

    const setAccountCreditCardTokenRequest = new SetAccountCreditCardTokenRequest();
    setAccountCreditCardTokenRequest.tokenType = 0;
    setAccountCreditCardTokenRequest.movePrimaryToSecondary = true;
    setAccountCreditCardTokenRequest.hideFromWeb = true;
    setAccountCreditCardTokenRequest.billingCountry = '';
    setAccountCreditCardTokenRequest.billingZip = '';
    setAccountCreditCardTokenRequest.billingState = '';
    setAccountCreditCardTokenRequest.billingCity = '';
    setAccountCreditCardTokenRequest.firstSix = '';
    setAccountCreditCardTokenRequest.billingAddress2 = '';
    setAccountCreditCardTokenRequest.useMainAddress = true;
    setAccountCreditCardTokenRequest.billingName = '';
    setAccountCreditCardTokenRequest.creditCardType = 0;
    setAccountCreditCardTokenRequest.expirationYear = this.checkoutForm.value.CardFormGroup.expiryYear;
    setAccountCreditCardTokenRequest.expirationMonth = this.checkoutForm.value.CardFormGroup.expiryMonth;
    setAccountCreditCardTokenRequest.creditCardToken = '';
    setAccountCreditCardTokenRequest.creditCardAccountType = 1;
    setAccountCreditCardTokenRequest.customerID = 0;
    setAccountCreditCardTokenRequest.billingAddress = '';
    setAccountCreditCardTokenRequest.lastFour = '';


    const transactionalRequestModel = new TransactionalRequestModel();
    transactionalRequestModel.createOrderRequest = createOrderRequest;
    transactionalRequestModel.createCustomerRequest = createCustomerRequest;
    transactionalRequestModel.chargeCreditCardTokenRequest = chargeCreditCardTokenRequest;
    transactionalRequestModel.createAutoOrderRequest = createAutoOrderRequest;
    transactionalRequestModel.setAccountCreditCardTokenRequest = setAccountCreditCardTokenRequest;

    this.shopService.checkOutItems(transactionalRequestModel).subscribe(
      (result: any) => {
        console.log("Result", result);
        this.router.navigate(["/store/thankyou"]);
        this.spinner.hide();
      });
  }
}

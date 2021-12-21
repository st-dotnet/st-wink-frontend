import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '@app/_helpers/must-match.validator';
import { Payment } from '@app/_models/payment';
import { SessionService } from '@app/_services';
import { EnrollmentService } from '@app/_services/enrollment.service';
import { ShopService } from '@app/_services/shop.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  ChargeCreditCardTokenRequest,
  CreateAutoOrderRequest,
  CreateCustomerRequest,
  CreateOrderRequest,
  OrderDetailRequest,
  SetAccountCreditCardTokenRequest,
  TransactionalRequestModel,
} from '@app/_models/checkout';

@Component({
  selector: 'app-enrollment-packs',
  templateUrl: './enrollmentinfo.component.html',
  styleUrls: ['./enrollmentinfo.component.css'],
})
export class EnrollmentInfoComponent implements OnInit {
  addrnew = false;
  personalInfo!: FormGroup;
  shippingAddressForm: FormGroup;
  onPaymentSubmitForm: FormGroup;
  submitted: boolean = false;
  addressSubmitted: boolean = false;
  paymentSubmitted = false;
  states: any[] = [];
  isShipmentMethod: any;
  verifyAddressResponse: any;
  isAddressveify: boolean = false;
  isShipmentAddressveify: boolean = false;

  maskMobileNo = [/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/,];
  checkMonth: number;
  checkYear: number;
  monthError: boolean = false;
  yearError: boolean = false;
  cardvalidate = false;
  customerId: number;
  UserDetails: any;
  cardToken: string;
  cartSummaryTotal: number = 0;
  cartItems: any[] = [];
  user: any;
  personalInfoPannel:boolean=false;
  shippingAddressPannel:boolean=false;
  paymentPannel:boolean=false;
  reviewOrderPannel:boolean=true;

  activeIds: string[] = ['checkoutstep1'];
  enrollmentdata:any[]=[];

  constructor(
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private enrollmentService: EnrollmentService,
    private toastrService: ToastrService,
    private shopService: ShopService,
    private sessionService: SessionService
  ) {
    this.states = [
      {
        id: 1,
        name: 'AA Military',
        val: 'AA',
      },
      {
        id: 2,
        name: 'AE Military',
        val: 'AE',
      },
      {
        id: 3,
        name: 'Alaska',
        val: 'AK',
      },
      {
        id: 4,
        name: 'Alabama',
        val: 'AL',
      },
      {
        id: 5,
        name: 'AP Military',
        val: 'AP',
      },
      {
        id: 6,
        name: 'Arkansas',
        val: 'AR',
      },
      {
        id: 7,
        name: 'American Samoa',
        val: 'AS',
      },
      {
        id: 8,
        name: 'Arizona',
        val: 'AZ',
      },
      {
        id: 9,
        name: 'California',
        val: 'CA',
      },
      {
        id: 10,
        name: 'Colorado',
        val: 'CO',
      },
      {
        id: 11,
        name: 'Connecticut',
        val: 'CT',
      },
      {
        id: 12,
        name: 'D.C.',
        val: 'DC',
      },
      {
        id: 13,
        name: 'Delaware',
        val: 'DE',
      },
      {
        id: 14,
        name: 'Florida',
        val: 'FL',
      },
      {
        id: 15,
        name: 'Georgia',
        val: 'GA',
      },
      {
        id: 16,
        name: 'Guam',
        val: 'GU',
      },
      {
        id: 17,
        name: 'Hawaii',
        val: 'HI',
      },
      {
        id: 18,
        name: 'Iowa',
        val: 'IA',
      },
      {
        id: 19,
        name: 'Idaho',
        val: 'ID',
      },
      {
        id: 20,
        name: 'Illinois',
        val: 'IL',
      },
      {
        id: 21,
        name: 'Indiana',
        val: 'IN',
      },
      {
        id: 22,
        name: 'Kansas',
        val: 'KS',
      },
      {
        id: 23,
        name: 'Kentucky',
        val: 'KY',
      },
      {
        id: 24,
        name: 'Louisiana',
        val: 'LA',
      },
      {
        id: 25,
        name: 'Massachusetts',
        val: 'MA',
      },
      {
        id: 26,
        name: 'Maryland',
        val: 'MD',
      },
      {
        id: 27,
        name: 'Maine',
        val: 'ME',
      },
      {
        id: 28,
        name: 'Michigan',
        val: 'MI',
      },
      {
        id: 29,
        name: 'Minnesota',
        val: 'MN',
      },
      {
        id: 30,
        name: 'Missouri',
        val: 'MO',
      },
      {
        id: 31,
        name: 'Northern Mariana Islands',
        val: 'MP',
      },
      {
        id: 32,
        name: 'Mississippi',
        val: 'MS',
      },
      {
        id: 33,
        name: 'Montana',
        val: 'MT',
      },
      {
        id: 34,
        name: 'North Carolina',
        val: 'NC',
      },
      {
        id: 35,
        name: 'North Dakota',
        val: 'ND',
      },
      {
        id: 36,
        name: 'Nebraska',
        val: 'NE',
      },
      {
        id: 37,
        name: 'New Hampshire',
        val: 'NH',
      },
      {
        id: 38,
        name: 'New Jersey',
        val: 'NJ',
      },
      {
        id: 39,
        name: 'New Mexico',
        val: 'NM',
      },
      {
        id: 40,
        name: 'Nevada',
        val: 'NV',
      },
      {
        id: 41,
        name: 'New York',
        val: 'NY',
      },
      {
        id: 42,
        name: 'Ohio',
        val: 'OH',
      },
      {
        id: 43,
        name: 'Oklahoma',
        val: 'OK',
      },
      {
        id: 44,
        name: 'Oregon',
        val: 'OR',
      },
      {
        id: 45,
        name: 'Pennsylvania',
        val: 'PA',
      },
      {
        id: 46,
        name: 'Puerto Rico',
        val: 'PR',
      },
      {
        id: 47,
        name: 'Rhode Island',
        val: 'RI',
      },
      {
        id: 48,
        name: 'South Carolina',
        val: 'SC',
      },
      {
        id: 49,
        name: 'South Dakota',
        val: 'SD',
      },
      {
        id: 50,
        name: 'Tennessee',
        val: 'TN',
      },
      {
        id: 51,
        name: 'Texas',
        val: 'TX',
      },
      {
        id: 52,
        name: 'United States Minor Outlying Islands',
        val: 'UM',
      },
      {
        id: 53,
        name: 'US',
        val: 'US',
      },
      {
        id: 54,
        name: 'Utah',
        val: 'UT',
      },
      {
        id: 55,
        name: 'Virginia',
        val: 'VA',
      },
      {
        id: 56,
        name: 'Virgin Islands',
        val: 'VI',
      },
      {
        id: 57,
        name: 'Vermont',
        val: 'VT',
      },
      {
        id: 58,
        name: 'Washington',
        val: 'WA',
      },
      {
        id: 59,
        name: 'Wisconsin',
        val: 'WI',
      },
      {
        id: 60,
        name: 'West Virginia',
        val: 'WV',
      },
      {
        id: 61,
        name: 'Wyoming',
        val: 'WY',
      },
    ];
  }

  ngOnInit(): void {
    this.isShipmentMethod = 1;
    this.enrollmentdata=this.sessionService.getSessionObject("enrollmentPacksData");


    this.UserDetails = JSON.parse(localStorage.getItem('user'));
   // this.customerId = this.UserDetails.customerId;
    this.personalInfo = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        middleName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required]],
        company: ['', [Validators.required]],
        officePhone: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(15),
          ],
        ],
        mobileno: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(15),
          ],
        ],
        taxId: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        userName: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
            ),
          ],
        ],
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        zip: ['', [Validators.required]],
        state: ['', [Validators.required]],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );

    this.shippingAddressForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['US'],
    });

    this.onPaymentSubmitForm = this.formBuilder.group({
      cardName: ['', [Validators.required]],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(19),
        ],
      ],
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

    // if (this.sessionService.getSessionItem('user')) {
    //   this.cartItems = this.sessionService.getSessionObject(
    //     'productCartItems-' + this.user.loginName
    //   );
    // }
    // if (this.cartItems == null || this.cartItems.length == 0) {
    //   this.cartItems = this.sessionService.getSessionObject('productCartItems');
    // }
  }

  onItemChange(id: number) {
    this.isShipmentMethod = id;
  }
  isCardDisabled: boolean = false;
  isCardType: number;
  newAddress: any;

  onpersonalInfoSubmit() {
    debugger;
    this.submitted = true;
    this.spinner.show();
    if (this.personalInfo.invalid) {
      this.spinner.hide();
      return;
    }
    if (!this.isAddressveify) {
      this.toastrService.error('Please Verify Address');
     this.shippingAddressPannel=true;
     this.paymentPannel=true;
     this.reviewOrderPannel=true;
     this.spinner.hide();
      return;
    }
    this.shippingAddressPannel=false;
    this.activeIds = ['checkoutstep2'];
    this.spinner.hide();
    //this.spinner.show();
  }
  // onPaymentSubmit() {
  //   this.paymentSubmitted = true;
  //   if (this.onPaymentSubmitForm.invalid || this.monthError || this.yearError) {
  //     return;
  //   }
  // }

  changeAddressstate(e){
    this.shippingstatename.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  changestate(e) {
    this.statename.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get statename() {
    return this.personalInfo.get('state');
  }
  get shippingstatename() {
    return this.shippingAddressForm.get('state');
  }

  verifyadress() {

    if (
      !this.f.address.value ||
      !this.f.city.value ||
      !this.f.state.value ||
      !this.f.zip.value
    ) {
      this.toastrService.error('Plase fill All Address Feilds');
      return;
    }
    let address = {
      Address: this.f.address.value,
      City: this.f.city.value,
      State: this.f.state.value,
      Zip: this.f.zip.value,
      Country: 'United States',
    };
    this.spinner.show();
    this.enrollmentService.verifyAddress(address).subscribe((response: any) => {
      this.verifyAddressResponse = response.result;
      console.log(response);
      console.log(this.verifyAddressResponse);
      if (this.verifyAddressResponse.address) {
        this.toastrService.success('Address is Verified');
        this.isAddressveify = true;
      } else {
        this.toastrService.error('Address is Not Verified');
        this.isAddressveify = false;
      }
      this.spinner.hide();
    });
  }

  verifyShippingAddress() {
    if (
      !this.s.streetAddress.value ||
      !this.s.city.value ||
      !this.s.state.value //||
      //!this.s.zip.value
    ) {
      this.toastrService.error('Plase fill All Address Feilds');
      return;
    }
    let address = {
      Address: this.s.streetAddress.value,
      City: this.s.city.value,
      State: this.s.state.value,
      Zip: '76123',//this.s.zip.value,
      Country: 'United States',
    };
    this.spinner.show();
    this.enrollmentService.verifyAddress(address).subscribe((response: any) => {
      this.verifyAddressResponse = response.result;
      console.log(response);
      console.log(this.verifyAddressResponse);
      if (this.verifyAddressResponse.address) {
        this.toastrService.success('Address is Verified');
        this.isShipmentAddressveify=true;
      } else {
        this.toastrService.error('Address is Not Verified');
        this.isShipmentAddressveify=false;
      }
      this.spinner.hide();
    });
  }
  onAddressSubmit() {
    debugger;
    this.addressSubmitted = true;
    this.spinner.show();
    if (this.shippingAddressForm.invalid) {
      this.spinner.hide();
      return;
    }
    if(!this.isShipmentAddressveify){
      this.toastrService.error('Please Verify Address');
      this.spinner.hide();
    }
    else{
      this.paymentPannel=false;
      this.activeIds = ['checkoutstep3'];
      this.spinner.hide();
    }
  }

  get f() {
    return this.personalInfo.controls;
  }
  get s() {
    return this.shippingAddressForm.controls;
  }
  get p() {
    return this.onPaymentSubmitForm.controls;
  }

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

  //payment submit
  onPaymentSubmit() {
    debugger;
    this.paymentSubmitted = true;
    if (this.onPaymentSubmitForm.invalid || this.monthError || this.yearError) {
      return;
    }

    this.spinner.show();
    const payment = new Payment();
    payment.name = this.f.firstName.value;
    if (!this.addrnew) {
      payment.address1 = this.p.newStreetAddress.value;
      payment.state = this.p.newState.value;
      payment.phone = '';
      payment.city = this.p.newCity.value;
      payment.country = 'US';
      payment.zip = this.p.newZip.value;
    } else {
      (payment.address1 = this.f.streetAddress.value),
        (payment.city = this.f.city.value),
        (payment.state = this.f.state.value),
        (payment.zip = this.f.zip.value),
        (payment.country = 'US');
    }
    payment.amount = this.cartSummaryTotal;
    payment.cardNumber = this.p.cardNumber.value.replace(/ /g, '');
    payment.cvv = this.p.cardCVV.value;
    payment.expMonth = this.p.expiryMonth.value;
    payment.expYear = this.p.expiryYear.value;
    payment.primary = true;
    payment.active = true;
    payment.cardType = 1;
    payment.customerId = this.customerId;

    this.shopService
      .generateCreditCardToken(payment.cardNumber)
      .subscribe((result: any) => {
        if (result.errorMessage == '') {
          console.log(result);
          this.cardToken = result.token;
          this.reviewOrderPannel=false;
          this.spinner.hide();
          // this.activeIds = ['checkoutstep3'];
          //this.showPanel3 = false;
          this.toastrService.success('Payment Card is accepted');
        } else {
          this.reviewOrderPannel=true;
          this.spinner.hide();
          this.toastrService.error('Payment card is not declined');
        }
      });
  }

  //Place my order
  onSubmit() {
    debugger;
    const createCustomerRequest = new CreateCustomerRequest();
    createCustomerRequest.loginName = '';
    createCustomerRequest.firstName = this.f.firstName.value;
    createCustomerRequest.lastName = this.f.lastName.value;
    createCustomerRequest.company = this.f.company.value;
    createCustomerRequest.email = this.f.email.value;
    createCustomerRequest.phone = this.f.mobileno.value;
    createCustomerRequest.mainAddress1 = this.f.address.value;
    createCustomerRequest.mainCity = this.f.city.value;
    createCustomerRequest.mainState = this.f.state.value;
    createCustomerRequest.mainZip = this.f.zip.value;
    createCustomerRequest.mailState = '';
    createCustomerRequest.mailCountry = '';
    createCustomerRequest.otherState = '';
    createCustomerRequest.otherCountry = '';
    createCustomerRequest.middleName = this.f.middleName.value;
    createCustomerRequest.nameSuffix = '';
    createCustomerRequest.mainCountry = 'US';

    const chargeCreditCardTokenRequest = new ChargeCreditCardTokenRequest();
    chargeCreditCardTokenRequest.maxAmount = this.cartSummaryTotal;
    chargeCreditCardTokenRequest.otherData10 = '';

    if (this.addrnew) {
      chargeCreditCardTokenRequest.billingZip = this.p.newZip.value;
      chargeCreditCardTokenRequest.billingCity = this.p.newCity.value;
      chargeCreditCardTokenRequest.billingAddress2 = '';
      chargeCreditCardTokenRequest.billingAddress =
   this.p.newStreetAddress.value;
      chargeCreditCardTokenRequest.billingState = this.p.newState.value;
    } else {
      chargeCreditCardTokenRequest.billingZip = this.f.zip.value;
      chargeCreditCardTokenRequest.billingCity = this.f.city.value;
      chargeCreditCardTokenRequest.billingAddress2 = '';
      chargeCreditCardTokenRequest.billingState = this.f.state.value;
      chargeCreditCardTokenRequest.billingAddress = this.f.address.value;
    }

    chargeCreditCardTokenRequest.billingName = this.f.firstName.value;
    chargeCreditCardTokenRequest.billingCountry = 'US'; //this.f.country.value;
    chargeCreditCardTokenRequest.expirationMonth = this.p.expiryMonth.value;
    chargeCreditCardTokenRequest.creditCardType = 0;
    chargeCreditCardTokenRequest.creditCardToken = this.cardToken; //"41X1111WBCXTE1111"
    chargeCreditCardTokenRequest.expirationYear = this.p.expiryYear.value;

    const createOrderRequest = new CreateOrderRequest();
    createOrderRequest.other17 = '0.0';
    createOrderRequest.details = null;
    createOrderRequest.suppressPackSlipPrice = true;
    createOrderRequest.orderStatus = 1;
    createOrderRequest.orderDate = new Date().toString();
    createOrderRequest.firstName = this.f.firstName.value;
    createOrderRequest.lastName = this.f.lastName.value;
    createOrderRequest.address1 = this.f.address.value;
    createOrderRequest.address2 = '';
    createOrderRequest.city = this.f.city.value;
    createOrderRequest.state = 'TX';
    createOrderRequest.zip = this.f.zip.value;
    createOrderRequest.country = 'US'; //this.f.country.value
    createOrderRequest.phone = '1111111111111';
    createOrderRequest.company = 'Test';
    createOrderRequest.notes = 'abc';

    //const createAutoOrderRequest=new CreateAutoOrderRequest();
    //createAutoOrderRequest.details='';

    const setAccountCreditCardTokenRequest = new SetAccountCreditCardTokenRequest();
    setAccountCreditCardTokenRequest.creditCardToken = this.cardToken;
    setAccountCreditCardTokenRequest.expirationMonth = this.p.expiryMonth.value;
    setAccountCreditCardTokenRequest.expirationYear = this.p.expiryYear.value;

    const transactionalRequestModel = new TransactionalRequestModel();
    transactionalRequestModel.createCustomerRequest = createCustomerRequest;
    transactionalRequestModel.createOrderRequest = createOrderRequest;
    transactionalRequestModel.chargeCreditCardTokenRequest =
      chargeCreditCardTokenRequest;
    transactionalRequestModel.setListItemRequest=this.cartItems;
    transactionalRequestModel.setAccountCreditCardTokenRequest =
      setAccountCreditCardTokenRequest;
    this.enrollmentService
      .submitcheckout(transactionalRequestModel)
      .subscribe((Response: any) => {
        console.log(Response);
      });
  }

  validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateCard() {
    this.monthError = false;
    this.yearError = false;
    var date = new Date();
    let year = parseInt(date.getFullYear().toString());
    let month = parseInt(date.getMonth().toString()) + 1;
    if (this.checkYear < year) this.yearError = true;
    else if (this.checkMonth == 0 || this.checkMonth > 12)
      this.monthError = true;
    else if (
      this.checkMonth < month &&
      (this.checkYear == year || this.checkYear < year)
    ) {
      this.monthError = true;
    } else if (this.checkMonth > 12 && this.checkYear > year) {
      this.monthError = true;
    }
  }

  creditCardValidator(control: any) {
    var card = control.target.value.replace(/ /g, '');
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      card.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      this.cardvalidate = false;
      return null;
    } else this.cardvalidate = true;
  }
}

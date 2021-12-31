import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  paymentCards: any[] = [];
  secondaryCards: any[];
  primaryCards: any[];
  creditCardsList:[]=[];

  onPaymentSubmitForm: FormGroup;
  paymentSubmitted = false;
  cardvalidate = false;
  checkMonth: number;
  checkYear: number;
  monthError: boolean = false;
  yearError: boolean = false;
  cardToken: any;
  currentuser: any;
  cardType: any;

  constructor(private accountService: AccountService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private formBuilder: FormBuilder, private shopService: ShopService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.cardType = 2;
    this.getCustomerCardDetails();

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
      //isMakePrimaryCard: ['',[Validators.required]],
      newStreetAddress: ['', [Validators.required]],
      newCity: ['', [Validators.required]],
      newState: ['', [Validators.required]],
      newZip: ['', [Validators.required]],
      newCountry: ['', [Validators.required]],
    });
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

  getCustomerCardDetails() {
    this.spinner.show();
    this.accountService.GetCustomerBilling().subscribe((response) => {
      
      //this.UserDetails = response.result.customers[0]
      this.paymentCards = response.filter(x => x.cardNumber != null);
      this.secondaryCards = this.paymentCards.filter(x => x.type == 2 && x.cardNumber != "");
      this.primaryCards = this.paymentCards.filter(x => x.type == 1 && x.cardNumber != "");
      console.log(response);
      this.spinner.hide();
    });
  }

  get p() {
    return this.onPaymentSubmitForm.controls;
  }

  checkCardType(event) {
    
    if (event.target.checked) {
      this.cardType = 1;
    }
    else {
      this.cardType = 2;
    }
  }

  onPaymentSubmit() {
    
    console.log(this.cardType);
    this.paymentSubmitted = true;
    if (this.onPaymentSubmitForm.invalid || this.monthError || this.yearError) {
      return;
    }
    this.spinner.show();
    this.currentuser = this.sessionService.getSessionObject("user");
    //billing address object
    const billingAddress = {
      addressType: 0,
      country: this.p.newCountry.value,
      zip: this.p.newZip.value,
      state: this.p.newState.value,
      city: this.p.newCity.value,
      address2: '',
      //billingName:this.p.cardName.value,
      address1: this.p.newStreetAddress.value
    }
    //card detail
    const craddetails = {
      billingAddress: billingAddress,
      creditCardType: 1,
      expirationYear: this.p.expiryYear.value,
      expirationMonth: this.p.expiryMonth.value,
      token: '',
      creditCardAccountType: this.cardType,
      customerID: this.currentuser.customerId,
      //billingName:this.p.cardName.value,
      cardNumber: this.p.cardNumber.value,
      nameOnCard: this.p.cardName.value,
      cvv: this.p.cardCVV.value,
      makeItPrimary: this.cardType == 1 ? true : false
    }

    let cardnumber = this.p.cardNumber.value.replace(/ /g, "");
    this.spinner.show();
    this.shopService
      .generateCreditCardToken(cardnumber)
      .subscribe((result: any) => {
        if (result.errorMessage == '') {
          console.log(result);
          this.cardToken = result.token;
          //card.token=this.cardToken;
          craddetails.token = this.cardToken;
          this.accountService.saveCustomerCard(craddetails).subscribe((response) => {
            console.log(response);
            if (response.success == true) {
              this.toastrService.success('Payment Card save successfully.');
              this.spinner.hide();
            }
            else {
              console.log("response", response);
              this.toastrService.error('Something Went Wrong.');
            }
            this.spinner.hide();
          });
        }
        else {
          this.spinner.hide();
          this.toastrService.error('Invalid Token.');
        }
      });
  }

  deleteCard(cardtype: number) {
    //this.toastrService.error('This credit Card Cannot be Deleted While it is Still beign used by Prefered Subscription.');
    var type = "";
    if (cardtype == 0) {
      type = "New";
    }
    else if (cardtype == 1) {
      type = "Primary";
    }
    else if (cardtype == 2) {
      type = "Secondary";
    }
    
    this.spinner.show();
    this.accountService.deleteCustomerCard(type).subscribe((response) => {
      console.log(response);
      this.toastrService.success("card  deleted successfully.");
      this.spinner.hide();
    });
  }

  //Make credit card primary
  makeCreditCardPrimary(item: any) {
    
          this.spinner.show();
          this.accountService.makeCreditCardPrimary(item).subscribe((response) => {
            
            console.log("response", response);
            this.spinner.hide(); 
      });
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

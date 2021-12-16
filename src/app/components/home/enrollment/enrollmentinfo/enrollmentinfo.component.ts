import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '@app/_helpers/must-match.validator';
import { EnrollmentService } from '@app/_services/enrollment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-enrollment-packs',
    templateUrl: './enrollmentinfo.component.html',
    styleUrls: ['./enrollmentinfo.component.css']
})

export class EnrollmentInfoComponent implements OnInit {
    addrnew = false;
    personalInfo: FormGroup;
    shippingAddressForm:FormGroup;
    onPaymentSubmitForm:FormGroup;
    submitted: boolean=false;
    addressSubmitted:boolean=false;
    paymentSubmitted = false;
    states:any[]=[];
    isShipmentMethod:any;
    verifyAddressResponse:any;
    isAddressveify:boolean=false;

    maskMobileNo = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    checkMonth: number;
    checkYear: number;
    monthError: boolean = false;
    yearError: boolean = false;
    cardvalidate = false;

  constructor(private spinner: NgxSpinnerService,private formBuilder: FormBuilder,private enrollmentService:EnrollmentService,private toastrService: ToastrService){

    this.states=[
     { id:1,
      name:'AA Military',
      val:'AA',
     },
     { id:2,
      name:'AE Military',
      val:'AE',
     },
     { id:3,
      name:'Alaska',
      val:'AK',
     },
     { id:4,
      name:'Alabama',
      val:'AL',
     },
     { id:5,
      name:'AP Military',
      val:'AP',
     },
     { id:6,
      name:'Arkansas',
      val:'AR',
     },
     { id:7,
      name:'American Samoa',
      val:'AS',
     },
     { id:8,
      name:'Arizona',
      val:'AZ',
     },
     { id:9,
      name:'California',
      val:'CA',
     },
     { id:10,
      name:'Colorado',
      val:'CO',
     },
     { id:11,
      name:'Connecticut',
      val:'CT',
     },
     { id:12,
      name:'D.C.',
      val:'DC',
     },
     { id:13,
      name:'Delaware',
      val:'DE',
     },
     { id:14,
      name:'Florida',
      val:'FL',
     },
     { id:15,
      name:'Georgia',
      val:'GA',
     },
     { id:16,
      name:'Guam',
      val:'GU',
     },
     { id:17,
      name:'Hawaii',
      val:'HI',
     },
     { id:18,
      name:'Iowa',
      val:'IA',
     },
     { id:19,
      name:'Idaho',
      val:'ID',
     },
     { id:20,
      name:'Illinois',
      val:'IL',
     },
     { id:21,
      name:'Indiana',
      val:'IN',
     },
     { id:22,
      name:'Kansas',
      val:'KS',
     },
     { id:23,
      name:'Kentucky',
      val:'KY',
     },
     { id:24,
      name:'Louisiana',
      val:'LA',
     },
     { id:25,
      name:'Massachusetts',
      val:'MA',
     },
     { id:26,
      name:'Maryland',
      val:'MD',
     },
     { id:27,
      name:'Maine',
      val:'ME',
     },
     { id:28,
      name:'Michigan',
      val:'MI',
     },
     { id:29,
      name:'Minnesota',
      val:'MN',
     },
     { id:30,
      name:'Missouri',
      val:'MO',
     },
     { id:31,
      name:'Northern Mariana Islands',
      val:'MP',
     },
     { id:32,
      name:'Mississippi',
      val:'MS',
     },
     { id:33,
      name:'Montana',
      val:'MT',
     },
     { id:34,
      name:'North Carolina',
      val:'NC',
     },
     { id:35,
      name:'North Dakota',
      val:'ND',
     },
     { id:36,
      name:'Nebraska',
      val:'NE',
     },
     { id:37,
      name:'New Hampshire',
      val:'NH',
     },
     { id:38,
      name:'New Jersey',
      val:'NJ',
     },
     { id:39,
      name:'New Mexico',
      val:'NM',
     },
     { id:40,
      name:'Nevada',
      val:'NV',
     },
     { id:41,
      name:'New York',
      val:'NY',
     },
     { id:42,
      name:'Ohio',
      val:'OH',
     },
     { id:43,
      name:'Oklahoma',
      val:'OK',
     },
     { id:44,
      name:'Oregon',
      val:'OR',
     },
     { id:45,
      name:'Pennsylvania',
      val:'PA',
     },
     { id:46,
      name:'Puerto Rico',
      val:'PR',
     },
     { id:47,
      name:'Rhode Island',
      val:'RI',
     },
     { id:48,
      name:'South Carolina',
      val:'SC',
     },
     { id:49,
      name:'South Dakota',
      val:'SD',
     },
     { id:50,
      name:'Tennessee',
      val:'TN',
     },
     { id:51,
      name:'Texas',
      val:'TX',
     },
     { id:52,
      name:'United States Minor Outlying Islands',
      val:'UM',
     },
     { id:53,
      name:'US',
      val:'US',
     },
     { id:54,
      name:'Utah',
      val:'UT',
     },
     { id:55,
      name:'Virginia',
      val:'VA',
     },
     { id:56,
      name:'Virgin Islands',
      val:'VI',
     },
     { id:57,
      name:'Vermont',
      val:'VT',
     },
     { id:58,
      name:'Washington',
      val:'WA',

     },
     { id:59,
      name:'Wisconsin',
      val:'WI',

     },
     { id:60,
      name:'West Virginia',
      val:'WV',

     },
     { id:61,
      name:'Wyoming',
      val:'WY',
     }
    ];
  }


    ngOnInit(): void {
      this.isShipmentMethod=1;

      this.personalInfo = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        middleName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required]],
        company: ['', [Validators.required]],
        officePhone: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(15)]],
        mobileno: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(15)]],
        taxId: ['', [Validators.required]],
        password: ['', [Validators.required,Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required,Validators.minLength(6)]],
        userName:['', [Validators.required]],
        email:['', [Validators.required,Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        address:['',[Validators.required]],
        city:['',[Validators.required]],
        zip:['',[Validators.required]],
        state:['',[Validators.required]],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      });

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
        cardNumber: ['', [Validators.required, Validators.minLength(14),
        Validators.maxLength(19)]],
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

    }
    onItemChange(id: number) {
      this.isShipmentMethod = id;
    }
    isCardDisabled: boolean = false;
    isCardType: number;
    newAddress: any;

    onpersonalInfoSubmit(){
      this.submitted = true;
      if (this.personalInfo.invalid) {
        return;
      }
      if(!this.isAddressveify){
        this.toastrService.error("Please Verify Address");
        return;
       }
      //this.spinner.show();
    }
    onPaymentSubmit() {
      this.paymentSubmitted = true;
      if (this.onPaymentSubmitForm.invalid || this.monthError || this.yearError) {
        return;
      }
    }

    changestate(e) {
      this.statename.setValue(e.target.value, {
        onlySelf: true
      })
    }

    get statename() {
      return this.personalInfo.get('state');
    }

    verifyadress()
    {
     debugger;
      let address={
        Address:this.f.address.value,
        City:this.f.city.value,
        State:this.f.state.value,
        Zip:this.f.zip.value,
        Country:'United States',
      }
      this.spinner.show();
        this.enrollmentService.verifyAddress(address).subscribe((response:any) => {
          this.verifyAddressResponse=response.result;
          console.log(response);
          console.log(this.verifyAddressResponse);
          if(this.verifyAddressResponse.address){
            this.toastrService.success("Address is Varified");
            this.isAddressveify=true;
          }
          else{
            this.toastrService.error("Address is Not Varified");
            this.isAddressveify=false;
          }
          this.spinner.hide();
        });
    }

     onAddressSubmit(){
       this.addressSubmitted = true;
       if (this.shippingAddressForm.invalid) {
        return;
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
    if (this.checkYear < year)
      this.yearError = true;
    else if (this.checkMonth == 0 || this.checkMonth > 12)
      this.monthError = true;
    else if (this.checkMonth < month && (this.checkYear == year || this.checkYear < year)) {
      this.monthError = true;
    }
    else if (this.checkMonth > 12 && this.checkYear > year) {
      this.monthError = true;
    }
  }

  creditCardValidator(control: any) {
    var card = control.target.value.replace(/ /g, "");
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (card.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      this.cardvalidate = false;
      return null;
    } else
      this.cardvalidate = true;
  }

}

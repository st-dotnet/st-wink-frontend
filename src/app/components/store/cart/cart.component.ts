import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartTypeEnum } from '@app/_models/cart-type-enum';
import { SessionService } from '@app/_services';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  subscriptionPurchase = false;
  inputdata: string;
  promocode_onetime: string;
  data_learn: boolean = false;
  closeResult: string;
  cartItems: any[] = [];
  minDate = new Date();
  modalOptions: NgbModalOptions = {
    // backdrop: 'static',
    backdropClass: 'customBackdrop'
  };
  oneTimePriceCartItemsCount: number = 0;
  subscriptionCartItemsCount: number = 0;
  cartSummaryTotal: number = 0;
  cart: any[];
  subtotalOneTimePrice: number = 0;
  subTotalSubscriptionPrice: number = 0;
  discount15Percent: number = 0;
  orderTotal: number = 0;
  subTotalSubscriptionPriceAfterDiscount: number = 0;
  total = false;
  subscriptionCartItems: any[] = [];
  oneTimePriceCartItems: any[] = [];
  quantity: any[];
  years: any[];
  enablebtn= true;
  onTextChange(value) {
  }
  //quantityValue: any;
  subscriptionModel: any;

  constructor(private modalService: NgbModal,
    private sessionService: SessionService,
    private spinner: NgxSpinnerService,
    private router: Router) {
    this.sessionService.scrollToTop();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.bindDropDown();
  }


  ngOnInit() {
    debugger
    this.cartItems = this.sessionService.getSessionObject('productCartItems');
    if(this.cartItems == null || this.cartItems.length <= 0){
      this.enablebtn = true;     
    }else{
      this.enablebtn = false;   
    this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
    this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
    this.oneTimePriceCartItemsCount = this.oneTimePriceCartItems.length;
    this.subscriptionCartItemsCount = this.subscriptionCartItems.length;
    }
    this.filterItem("");
    this.quantityForOneTime('', 0);
    this.quantityForSubscriptionTime('', 0);
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  learn_show() {
    this.data_learn = !this.data_learn;
    console.log(this.data_learn);
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

  // Referrer records below

  filterTerm: string;
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
      debugger;
    }
  }

  choose_referrer(data: any) {
    debugger;
    if (this.referrerRecords.filter(x => x.id == parseInt(data.id)).length > 0) {
      debugger;
      this.refId = data.id;
      debugger;
      this.refName = this.referrerRecords.filter(x => x.id == parseInt(data.id)).map(ele => ele.referrer_name);
      this.toShowData = true;
    }
    else {
      this.toShowData = false;
    }
  }
//Remove Item From Cart List
  removeItem(cartItem: any, type: any, bundle: string) {
    debugger
    this.spinner.show();
    this.sessionService.removeSessionItem('productCartItems');
    switch (type) {
      case 0:
        this.cartItems = this.cartItems.filter(x => x !== cartItem);
        this.cartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems', this.cartItems) : this.sessionService.removeSessionItem('productCartItems');
        this.updateCartSession();
        this.enablebtn=true;
        break;
      case 1:
        this.cartItems = this.cartItems.filter(x => x !== cartItem);
        this.cartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems', this.cartItems) : this.sessionService.removeSessionItem('productCartItems');
        this.updateCartSession();
        this.enablebtn=true;
        break;
      default:
        break;
    }
    this.total = true;
    this.spinner.hide();
    this.quantityForOneTime('', 0);
    this.quantityForSubscriptionTime('', 0);
  }

  updateCartSession() {
    const items = this.sessionService.getSessionObject('productCartItems');
    this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
    this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
    this.oneTimePriceCartItemsCount = this.oneTimePriceCartItems.length;
    this.subscriptionCartItemsCount = this.subscriptionCartItems.length;
    this.sessionService.cartSession(items == null ? [] : items);
  }

  checkOutItem() {
    debugger;
    if (this.sessionService.getSessionItem('user')) {
      this.sessionService.setSessionObject('productCartItems', this.cartItems);
      const paramsProductPrice = {
        priceAfterDiscount: this.subTotalSubscriptionPriceAfterDiscount,
        subTotalSubscriptionPrice: this.subTotalSubscriptionPrice,
        subTotalOneTimePrice: this.subtotalOneTimePrice
      }
      this.sessionService.setSessionObject("paramsProductPrice", paramsProductPrice);
      this.router.navigate(["/store/checkout"]);
    } else {
      let isTrue = true;
      this.sessionService.setSessionItem('isTrue', isTrue);
      this.router.navigate(["/sign-in"]);
    }
  }

  quantityForOneTime(cartitem: any, selectedvalue: number) {
    debugger
    this.cartSummaryTotal = 0;
    let oneTimePriceCartItem:any[]=[];
    if (cartitem == '' || cartitem == undefined) {
      oneTimePriceCartItem = this.oneTimePriceCartItems;
    }
    else {
      if (selectedvalue != null && selectedvalue != undefined) {
        for (var i = 0; i <= this.cartItems.length - 1; i++) {
          if (this.cartItems[i] == cartitem) {
            this.cartItems[i].quantityModel = +selectedvalue;
          }
        }
        this.sessionService.setSessionObject('productCartItems', this.cartItems);
        oneTimePriceCartItem = this.cartItems.filter((x)=>{if(x.selectDelivery==CartTypeEnum.OneTimePrice){return x}});  
      }
    }
    this.subtotalOneTimePrice = this.getSubTotal(oneTimePriceCartItem);
    this.orderTotal = this.subtotalOneTimePrice + this.subTotalSubscriptionPrice;
    this.cartSummaryTotal = this.subtotalOneTimePrice + this.subTotalSubscriptionPriceAfterDiscount;
  }



  quantityForSubscriptionTime(delivery: any, selectedvalue: number) {
    debugger
    this.cartSummaryTotal = 0;
    let subscriptionCartItem:any[]=[];
    if(delivery == '' || delivery == undefined)
    {
      subscriptionCartItem = this.subscriptionCartItems;
    }
    else{
      if (selectedvalue != null && selectedvalue != undefined) {
        for (var i = 0; i <= this.cartItems.length - 1; i++) {
          if (this.cartItems[i] == delivery) {
            this.cartItems[i].quantityModel = +selectedvalue;
          }
        }
        this.sessionService.setSessionObject('productCartItems', this.cartItems);
        subscriptionCartItem =this.cartItems.filter((x)=>{if(x.selectDelivery==CartTypeEnum.Subscription){return x}});
      }
    }
    this.subTotalSubscriptionPrice = this.getSubTotal(subscriptionCartItem);
    this.orderTotal = +this.subtotalOneTimePrice + this.subTotalSubscriptionPrice;
    this.discount15Percent = (this.subTotalSubscriptionPrice * 15) / 100;
    this.subTotalSubscriptionPriceAfterDiscount = this.subTotalSubscriptionPrice - this.discount15Percent;
    this.cartSummaryTotal = this.subtotalOneTimePrice + this.subTotalSubscriptionPriceAfterDiscount;
  }

  getSubTotal(ProductList: any[]) {
    debugger;
    let multiplyprice = 0;
    let Temp = 0;
    for (var i = 0; i <= ProductList.length - 1; i++) {
      multiplyprice = parseFloat(ProductList[i].price) * ProductList[i].quantityModel;
      Temp = Temp + multiplyprice;
    }
    return +Temp;
  }

  bindDropDown() {
    this.quantity = [
      {
        id: '1',
        name: 'Qty 1',
        value: 1
      },
      {
        id: '2',
        name: 'Qty 2',
        value: 2
      },
      {
        id: '3',
        name: 'Qty 3',
        value: 3
      },
      {
        id: '4',
        name: 'Qty 4',
        value: 4
      }
    ]
    this.years = [
      {
        id: '1',
        name: 'Every Month',
        value: 'everyMonth'
      },
      {
        id: '2',
        name: 'Every Week',
        value: 'everyWeek'
      },
      {
        id: '3',
        name: 'Every Year',
        value: 'everyYear'
      }
    ]
    this.years = [
      {
        id: '1',
        name: 'Every Month',
        value: 'everyMonth'
      },
      {
        id: '2',
        name: 'Every Week',
        value: 'everyWeek'
      },
      {
        id: '3',
        name: 'Every Year',
        value: 'everyYear'
      }
    ]
  }
}

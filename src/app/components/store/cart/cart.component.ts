import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartTypeEnum } from '@app/_models/cart-type-enum';
import { SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  enablebtn = true;
  promoItem: any;
  specialItem: any;
  isDisabled: Boolean = false;
  isPromoCode=false;
  promoPercentage:number=0;
  totalDiscount:number=0;
  productItems: any;
  isShowSpecial=true;
  specialOffer: any[];
  userLogin: any;
  show: boolean=false;
  onTextChange(value) {
  }
  //quantityValue: any;
  subscriptionModel: any;

  constructor(private modalService: NgbModal,
    private sessionService: SessionService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private shopService: ShopService,
    private toastrService: ToastrService) {
    this.sessionService.scrollToTop();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.bindDropDown();
  }


  ngOnInit() {
    debugger    
    this.userLogin=this.sessionService.getSessionObject("user");
    if(this.userLogin){
      this.show = true;
    }
    this.spinner.show();
    this.getSpecialItem();  
    // this.promocode_onetime=this.sessionService.getSessionItem('promoCode');
    // if(this.promocode_onetime!=="null" && this.promocode_onetime !==undefined)
    // {
    //   this.addPromo();
    // }
    // else{
    //   this.promocode_onetime='';
    // }
    this.onLoad();  
  }

  onLoad()
  {
    this.cartItems = this.sessionService.getSessionObject('productCartItems');
    if (this.cartItems == null || this.cartItems.length <= 0) {
      this.enablebtn = true;
    } else {
      this.enablebtn = false;
      this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
      this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
      this.oneTimePriceCartItemsCount = this.oneTimePriceCartItems.length;
      this.subscriptionCartItemsCount = this.subscriptionCartItems.length;
    }
    this.specialOffer=this.cartItems.filter(x=>x.bundle=='specialOffer');
    if(this.specialOffer.length ==0)
    {
      this.isShowSpecial=true;
    }
    else{
      this.isShowSpecial=false;
    }
    this.filterItem("");
    this.cartCalculation();
  }

  addPromo() {
    debugger;
    // this.sessionService.removeSessionItem('promoCode')
  this.sessionService.setSessionItem('promoCode',this.promocode_onetime);
  this.promocode_onetime=this.sessionService.getSessionItem('promoCode');
   this.isPromoCode=true;
    this.spinner.show();
    this.shopService.getPromoData(this.promocode_onetime).subscribe(result => {
      this.promoItem = result;
      if (this.promoItem.errorMessage == null) {
        debugger;
      this.promoPercentage = (this.subtotalOneTimePrice * this.promoItem.discountPer) / 100;
       // this.subtotalOneTimePrice = this.subtotalOneTimePrice - this.promoPercentage;
        this.cartCalculation();
        //this.isDisabled=true;
        this.toastrService.success("Promo code applied succesfully you save $'"+this.promoPercentage.toFixed(2)+"'.")
        this.spinner.hide();
      }
      else {
        // this.isDisabled=false;
        this.toastrService.error(this.promoItem.errorMessage);
        this.spinner.hide();
      }
    })   
  }

  getSpecialItem() {
    this.shopService.getSpecialItem().subscribe(result => {
      if (result==null) {
        this.isShowSpecial=false;
        this.spinner.hide();
      }
      else{
        this.isShowSpecial=true;
        this.specialItem = result;
        this.spinner.hide();
      }
    })
  }

  spacialItemAdd() {
    this.isShowSpecial=false;
    debugger
    this.productItems = this.sessionService.getSessionObject('productCartItems');
    const items = {
      bundle: 'specialOffer',
      selectDelivery: 0,
      subscriptionModel: this.subscriptionModel,
      quantityModel: 1,
      Price: this.specialItem.field5,
      afterDiscountPrice: 0,
      discount: 0,
      quantityLimit: 1,
      isDiscountTime: true,
      isDisabled:true
    }
    this.specialItem.price = items.Price;
    Object.entries(items).forEach(([key, value]) => { this.specialItem[key] = value });
    this.productItems.push(this.specialItem);

    this.sessionService.cartSession(this.productItems);
    this.sessionService.setSessionObject('productCartItems', this.productItems);

    //this.oneTimePriceCartItems.push(this.specialItem);
    console.log("fasdfds", this.specialItem[0]);
   this.onLoad();
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

  referrerRecords = [];

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
      this.isDataAvailable = true;

    }
  }

  choose_referrer(data: any) {
    if (this.referrerRecords.filter(x => x.id == parseInt(data.id)).length > 0) {
      this.refId = data.id;
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
        let cartItem0 = this.sessionService.getSessionObject("productCartItems");
        if (cartItem0 == null || cartItem0.length <= 0) {
          this.enablebtn = true;
        }
        break;
      case 1:
        this.cartItems = this.cartItems.filter(x => x !== cartItem);
        this.cartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems', this.cartItems) : this.sessionService.removeSessionItem('productCartItems');
        this.updateCartSession();
        let cartItem1 = this.sessionService.getSessionObject("productCartItems");
        if (cartItem1 == null || cartItem1.length <= 0) {
          this.enablebtn = true;
        }
        break;
      default:
        break;
    }
    this.specialOffer=this.cartItems.filter(x=>x.bundle=='specialOffer');
    if(this.specialOffer.length ==0)
    {
      this.isShowSpecial=true;
    }
    this.total = true;
    this.spinner.hide();
    // this.quantityForOneTime('', 0);
    // this.quantityForSubscriptionTime('', 0);
    this.cartCalculation();
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
    if (this.sessionService.getSessionItem('user')) {
      this.sessionService.setSessionObject('productCartItems', this.cartItems);
      this.router.navigate(["/store/checkout"]);
    } else {
      let isTrue = true;
      this.sessionService.setSessionItem('isTrue', isTrue);
      this.router.navigate(["/sign-in"]);
    }
  }

  quantityForOneTime(cartitem: any, selectedvalue: number) {
    debugger;
      if (selectedvalue != null && selectedvalue != undefined) {
        for (var i = 0; i <= this.cartItems.length - 1; i++) {
          if (this.cartItems[i] == cartitem) {
            this.cartItems[i].quantityModel = +selectedvalue;
          }
        }
        this.sessionService.setSessionObject('productCartItems', this.cartItems);
      }
      this.cartCalculation();
  }

  quantityForSubscriptionTime(delivery: any, selectedvalue: number) {
    debugger;
      if (selectedvalue != null && selectedvalue != undefined) {
        for (var i = 0; i <= this.cartItems.length - 1; i++) {
          if (this.cartItems[i] == delivery) {
            this.cartItems[i].quantityModel = +selectedvalue;
          }
        }
        this.sessionService.setSessionObject('productCartItems', this.cartItems);
        this.cartCalculation();
  }
}

  cartCalculation() {
    this.totalDiscount=0;
    this.orderTotal=0;
    this.subtotalOneTimePrice=0;
    this.subTotalSubscriptionPrice=0;
    this.discount15Percent=0;
    this.subTotalSubscriptionPriceAfterDiscount=0;
    this.totalDiscount=0;
    this.cartSummaryTotal=0;

    debugger;
    this.orderTotal = this.getOrderTotal();
    this.cartItems = this.sessionService.getSessionObject('productCartItems');
    //subsciption item List
      this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
      //onetime item list
      this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
      //special offer item
      this.specialOffer=this.oneTimePriceCartItems.filter(x=>x.bundle=='specialOffer');
      if(this.specialOffer!==null || this.specialOffer !==undefined)
      {
        let specialOfferItem = this.oneTimePriceCartItems.filter((x) => { if (x.selectDelivery == CartTypeEnum.Subscription && x.bundle=='specialOffer') { return x } });
        const index: number = this.oneTimePriceCartItems.indexOf(specialOfferItem);
        if (index !== -1) {
          this.oneTimePriceCartItems.splice(index, 1);
        }
      }

      this.subtotalOneTimePrice=this.getSubTotal(this.oneTimePriceCartItems);
      // if(this.promocode_onetime!=="null" || this.promocode_onetime!==undefined)
      // {
      //     this.subtotalOneTimePrice=this.subtotalOneTimePrice-this.promoPercentage;
      //     this.totalDiscount=this.totalDiscount+this.promoPercentage;
      // }

      this.subTotalSubscriptionPrice=this.getSubTotal(this.subscriptionCartItems);
      this.discount15Percent = (this.subTotalSubscriptionPrice * 15) / 100;
      this.subTotalSubscriptionPriceAfterDiscount = this.subTotalSubscriptionPrice - this.discount15Percent;
      this.totalDiscount=this.totalDiscount+this.discount15Percent;
      this.cartSummaryTotal = this.subtotalOneTimePrice + this.subTotalSubscriptionPriceAfterDiscount;

  }
  getOrderTotal()
  {
    let multiplyprice = 0;
    let Temp = 0;
    for (var i = 0; i <= this.cartItems.length - 1; i++) {
      if(this.cartItems[i].bundle=='multiple')
      {
        multiplyprice=parseFloat(this.cartItems[i].price) * 2;
        multiplyprice = multiplyprice * this.cartItems[i].quantityModel;
      }
      else{
        multiplyprice = parseFloat(this.cartItems[i].price) * this.cartItems[i].quantityModel;
      }
    
      Temp = Temp + multiplyprice;
    }
    return +Temp;
  }

  getSubTotal(ProductList: any[]) {
    let multiplyprice = 0;
    let Temp = 0;
    for (var i = 0; i <= ProductList.length - 1; i++) {
      multiplyprice = parseFloat(ProductList[i].Price) * ProductList[i].quantityModel;
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

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
  inputdata:any;
  promocode_onetime: string;
  date_convertModal: string;
  data_learn: boolean = false;
  closeResult: string;
  cartItems: any[] = [];
  minDate = new Date();
  showOtherTextbox = null;
  isOtherValue = false;
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
  isPromoCode = false;
  promoPercentage: number = 0;
  totalDiscount: number = 0;
  productItems: any;
  isShowSpecial = true;
  specialOffer: any[];
  user: any;
  show: boolean = false;
  promocodeMessage: string = "No code applied";
  addPromoIcon: boolean = true;
  onTextChange(value) {
  }

  //quantityValue: any;
  subscriptionModel: any;

  totalOneTimeDiscountPurchase: number = 0;
  Quantityupdate: any;

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

  GetOneTimeSubDiscount() {
    let total: number = 0;
    this.oneTimePriceCartItems.forEach(element => {
      if (element.bundle == 'multiple') {
        // if(element.Quantityupdate){
        //  //total+= parseFloat(element.Quantityupdate);
        //  total+=  ((parseFloat(element.Price)*5)/100)*(element.extraQuantity);
        // }
        if (element.extraQuantity) {
          //total+=  (parseFloat(element.bv) * 2 - parseFloat( element.Price))*(element.extraQuantity);
          total += ((parseFloat(element.Price) * 5) / 100) * (element.extraQuantity);
        }
        else if (element.quantityModel) {
          // total+= (parseFloat(element.bv) * 2 - parseFloat( element.Price))*(element.quantityModel);
          total += ((parseFloat(element.Price) * 5) / 100) * (element.quantityModel);
        }
      }
    });
    this.totalOneTimeDiscountPurchase = total;
    localStorage.setItem("One_time_purchage_discount", total.toString());
  }

  ngOnInit() {
    this.user = this.sessionService.getSessionObject("user");
    if (this.user) {
      this.show = true;
      if (this.sessionService.getSessionItem('promoCode')) { this.addPromo(); }
    }
    this.spinner.show();
    this.getSpecialItem();
    this.onLoad();
    this.GetOneTimeSubDiscount();
  }

  onLoad() {
    if (this.sessionService.getSessionItem('user')) {
      this.cartItems = this.sessionService.getSessionObject('productCartItems-'+this.user.loginName);
    }
    debugger;
    if( this.cartItems==null || this.cartItems.length==0)
    {this.cartItems = this.sessionService.getSessionObject('productCartItems');}


    this.cartItems.forEach(function (item) {
      if (item.quantityModel > 10 || item.quantityModel == 0) {

        if(item.extraQuantity)
        {
        item.extraQuantity=item.quantityModel;
        }
      }
    });
if(this.sessionService.getSessionObject('inputdata'))
{
  this.inputdata =this.sessionService.getSessionObject('inputdata');
  this.inputdata = new Date(this.inputdata);
}

    if (this.cartItems == null || this.cartItems.length <= 0) {
      this.enablebtn = true;
    } else {
      this.enablebtn = false;
      this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
      this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
      this.oneTimePriceCartItemsCount = this.oneTimePriceCartItems.length;
      this.subscriptionCartItemsCount = this.subscriptionCartItems.length;
    }
    this.specialOffer = this.cartItems.filter(x => x.bundle == 'specialOffer');
    if (this.specialOffer.length == 0) {
      this.isShowSpecial = true;
    }
    else {
      this.isShowSpecial = false;
    }
    this.filterItem("");
    this.cartCalculation();
  }

  addPromo() {
    if (this.promocode_onetime == undefined) {
      this.promocode_onetime = this.sessionService.getSessionItem('promoCode');

      if (this.promocode_onetime != null && this.promocode_onetime != '' &&
        this.promocode_onetime != undefined && this.promocode_onetime != "null") {
        this.shopService
          .getPromoData(this.promocode_onetime)
          .subscribe((result) => {
            this.promoItem = result;
            if (this.promoItem.errorMessage == null) {
              this.addPromoIcon = false;
              this.promocodeMessage = "Code Applied";
              this.promoPercentage =
                (this.subtotalOneTimePrice==null?0:(parseFloat(this.subtotalOneTimePrice.toString())) * parseFloat(this.promoItem.percentOff)) / 100;
            }
            this.cartCalculation();
            this.spinner.hide();
          });
      }
      return;
    }

    if (this.promocode_onetime != null && this.promocode_onetime != undefined && this.promocode_onetime != "") {
      this.sessionService.setSessionItem('promoCode', this.promocode_onetime);
    }
    this.promocode_onetime = this.sessionService.getSessionItem('promoCode');
    if (this.sessionService.getSessionItem('user')) {
      if (this.promocode_onetime != null && this.promocode_onetime != undefined && this.promocode_onetime != "") {
        this.isPromoCode = true;
        this.spinner.show();
        this.shopService.getPromoData(this.promocode_onetime).subscribe(result => {
          this.promoItem = result;
          if (this.promoItem.errorMessage == null) {
          
            this.promoPercentage =
              (this.subtotalOneTimePrice==null?0: parseFloat( this.subtotalOneTimePrice.toString()) * parseFloat(this.promoItem.percentOff)) / 100;
            // this.subtotalOneTimePrice = this.subtotalOneTimePrice - this.promoPercentage;
             if(this.promoPercentage >0){
              this.addPromoIcon = false;
              this.promocodeMessage = "Code Applied";
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
        })

        this.cartCalculation();
      }
    }
    else {
      this.toastrService.error(
        "Please login before apply promo code"
      );
      // let isTrue = true;
      // this.sessionService.setSessionItem('isTrue', isTrue);
      //  this.router.navigate(["/sign-in"]);
    }
  }

  clearPromo(event: any) {
    if (
      event.target.value == '' || event.target.value == undefined || event.target.value == null) {
      this.sessionService.removeSessionItem('promoCode');
      this.promocode_onetime = '';
      this.promoPercentage = 0;
      this.promocodeMessage = "No code Applied";
      this.addPromoIcon = true;
      this.cartCalculation();
    } else {
      // this.promocodeMessage="Code Applied";
      // this.addPromoIcon = false;
      this.sessionService.setSessionItem('promoCode', this.promocode_onetime);
      //this.addPromo();
    }
  }

  getSpecialItem() {
    this.shopService.getSpecialItem().subscribe(result => {
      if (result == null) {
        this.isShowSpecial = false;
        this.spinner.hide();
      }
      else {
        this.isShowSpecial = true;
        this.specialItem = result;
        this.spinner.hide();
      }
    })
  }

  spacialItemAdd() {
    this.isShowSpecial = false;
    //this.productItems = this.sessionService.getSessionObject('productCartItems-'+this.user.loginName);
    if (this.sessionService.getSessionItem('user')) {
      this.productItems = this.sessionService.getSessionObject('productCartItems-'+this.user.loginName);
    }
    if( this.productItems==null)
    {this.productItems = this.sessionService.getSessionObject('productCartItems');}
     
    this.inputdata =this.sessionService.getSessionObject('inputdata');

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
      isDisabled: true,
      inputdata: this.inputdata,
    }
    this.specialItem.price = items.Price;
    Object.entries(items).forEach(([key, value]) => { this.specialItem[key] = value });
    this.productItems.push(this.specialItem);

    this.sessionService.cartSession(this.productItems);

    //this.sessionService.setSessionObject('productCartItems-'+this.user.loginName, this.productItems);

    if (this.sessionService.getSessionItem('user')) {
      this.sessionService.setSessionObject('productCartItems-'+this.user.loginName, this.productItems);
    }
    else{
      this.sessionService.setSessionObject('productCartItems', this.productItems);
    }

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
    this.spinner.show();
   // this.sessionService.removeSessionItem('productCartItems-'+this.user.loginName);
    if (this.sessionService.getSessionItem('user')) {
      this.sessionService.removeSessionItem('productCartItems-'+this.user.loginName);
    }
    else{
      this.sessionService.removeSessionItem('productCartItems');
    }

    switch (type) {
      case 0:
        this.cartItems = this.cartItems.filter(x => x !== cartItem);
        if (this.sessionService.getSessionItem('user')){
          this.cartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems-'+this.user.loginName, this.cartItems) : this.sessionService.removeSessionItem('productCartItems-'+this.user.loginName);
        }
        else{
          this.cartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems', this.cartItems) : this.sessionService.removeSessionItem('productCartItems');
        }

        this.updateCartSession();
       var singleItems =this.cartItems.filter(x => x !== cartItem && x.subscriptionModel === "singleDelivery") ;
       if(singleItems ==null || singleItems.length<=0)
       {
        this.sessionService.removeSessionItem('promoCode');
       }
        let cartItem0 = this.sessionService.getSessionObject("productCartItems");
        if (cartItem0 == null || cartItem0.length <= 0) {
          this.sessionService.removeSessionItem('promoCode');
          this.enablebtn = true;
        }
        break;
      case 1:
        this.cartItems = this.cartItems.filter(x => x !== cartItem);
        //this.cartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems-'+this.user.loginName, this.cartItems) : this.sessionService.removeSessionItem('productCartItems-'+this.user.loginName);
        if (this.sessionService.getSessionItem('user')){
          this.cartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems-'+this.user.loginName, this.cartItems) : this.sessionService.removeSessionItem('productCartItems-'+this.user.loginName);
        }
        else{
          this.cartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems',this.cartItems) : this.sessionService.removeSessionItem('productCartItems');
        }

        this.updateCartSession();
        let cartItem1 = this.sessionService.getSessionObject("productCartItems");

        if (cartItem1 == null || cartItem1.length <= 0) {
          this.sessionService.removeSessionItem('promoCode');
          this.enablebtn = true;
        }
        break;
      default:
        break;
    }
    this.specialOffer = this.cartItems.filter(x => x.bundle == 'specialOffer');
    if (this.specialOffer.length == 0) {
      this.isShowSpecial = true;
    }
    this.total = true;
    this.spinner.hide();
    // this.quantityForOneTime('', 0);
    // this.quantityForSubscriptionTime('', 0);

    this.GetOneTimeSubDiscount();
    this.cartCalculation();
  }

  updateCartSession() {
    var items;
    if (this.sessionService.getSessionItem('user')){
      items = this.sessionService.getSessionObject('productCartItems-'+this.user.loginName);
    }
    if( this.productItems==null)
    {this.productItems = this.sessionService.getSessionObject('productCartItems');}

    this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
    this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
    this.oneTimePriceCartItemsCount = this.oneTimePriceCartItems.length;
    this.subscriptionCartItemsCount = this.subscriptionCartItems.length;
    this.sessionService.cartSession(items == null ? [] : items);
  }

  checkOutItem() {
    this.cartItems.map((obj) => {
      ;
      obj.inputdata = this.inputdata;
      // or via brackets
      // obj['total'] = 2;
      return obj;
  })
    if (this.sessionService.getSessionItem('user')) {
      this.sessionService.setSessionObject('productCartItems-'+this.user.loginName, this.cartItems);
      if (this.cartItems.length > 0)
        this.router.navigate(["/store/checkout"]);
      else
        this.toastrService.success('Add Item to Cart');
    } else {
      let isTrue = true;
      this.sessionService.setSessionItem('isTrue', isTrue);
      this.router.navigate(["/sign-in"]);
    }
  }

  quantityForOneTime(cartitem: any, selectedvalue: number) {
    this.quantityCalculation(cartitem, selectedvalue);
  }

  quantitychanged(cartitem: any, selectedvalue: number) {
    this.quantityCalculation(cartitem, selectedvalue);
    const item = this.cartItems.find(x => x.itemCode == cartitem.itemCode);
    if (item && (selectedvalue > 10 || selectedvalue == 0)) {
      item.quantityModel = 0;
    }

  }

  quantityCalculation(cartitem: any, selectedvalue: number) {
    if (selectedvalue < 11) {
      cartitem.extraQuantity = null;
    }

    if (selectedvalue != null && selectedvalue != undefined) {
      if (selectedvalue == 0 || selectedvalue > 10) {
        this.showOtherTextbox = cartitem.itemCode;
        $("#showinput" + cartitem.itemCode).show();
      }
      else {
        $("#showinput" + cartitem.itemCode).hide();
      }
      for (var i = 0; i <= this.cartItems.length - 1; i++) {
        if (this.cartItems[i] == cartitem) {

          //cartitem.Quantityupdate=(this.cartItems[i].bv * 2 - this.cartItems[i].Price)*selectedvalue;
          this.cartItems[i].quantityModel = +selectedvalue;

        }
      }
      //this.sessionService.setSessionObject('productCartItems-'+this.user.loginName, this.cartItems);
      if (this.sessionService.getSessionItem('user')){
        this.sessionService.setSessionObject('productCartItems-'+this.user.loginName, this.cartItems);
      }
      else{
        this.sessionService.setSessionObject('productCartItems', this.cartItems);
      }

      this.GetOneTimeSubDiscount();

    }
    this.cartCalculation();
  }

  quantityForSubscriptionTime(delivery: any, selectedvalue: number) {
    this.quantityCalculation(delivery, selectedvalue);
  }

  cartCalculation() {
    this.GetOneTimeSubDiscount();
    this.totalDiscount = 0;
    this.orderTotal = 0;
    this.subtotalOneTimePrice = 0;
    this.subTotalSubscriptionPrice = 0;
    this.discount15Percent = 0;
    this.subTotalSubscriptionPriceAfterDiscount = 0;
    this.totalDiscount = 0;
    this.cartSummaryTotal = 0;

    if (this.isOtherValue)
      $("#showinput" + this.showOtherTextbox).show();
    this.orderTotal = this.getOrderTotal();
    //this.cartItems = this.sessionService.getSessionObject('productCartItems-'+this.user.loginName);

    if (this.sessionService.getSessionItem('user')){
      this.cartItems = this.sessionService.getSessionObject('productCartItems-'+this.user.loginName);
    }
    if( this.cartItems==null || this.cartItems.length==0)
        {this.cartItems = this.sessionService.getSessionObject('productCartItems');}

    //subsciption item List
    this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
    //onetime item list
    this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
    //special offer item
    this.specialOffer = this.oneTimePriceCartItems.filter(x => x.bundle == 'specialOffer');
    if (this.specialOffer !== null || this.specialOffer !== undefined) {
      let specialOfferItem = this.oneTimePriceCartItems.filter((x) => { if (x.selectDelivery == CartTypeEnum.Subscription && x.bundle == 'specialOffer') { return x } });
      const index: number = this.oneTimePriceCartItems.indexOf(specialOfferItem);
      if (index !== -1) {
        this.oneTimePriceCartItems.splice(index, 1);
      }
    }

    this.subtotalOneTimePrice = this.getSubTotal(this.oneTimePriceCartItems);
   

    this.subTotalSubscriptionPrice = this.getSubTotal(this.subscriptionCartItems);
    this.discount15Percent = (this.subTotalSubscriptionPrice * 15) / 100;

    this.subTotalSubscriptionPriceAfterDiscount = this.subTotalSubscriptionPrice - this.discount15Percent;

    this.totalDiscount = this.totalDiscount + this.discount15Percent + this.totalOneTimeDiscountPurchase;

    this.cartSummaryTotal = this.subtotalOneTimePrice + this.subTotalSubscriptionPriceAfterDiscount;


    // for promo code
    if (this.promoPercentage > 0) {
      this.totalDiscount = this.totalDiscount + this.promoPercentage;
      this.cartSummaryTotal = this.cartSummaryTotal - this.promoPercentage;
    }

    this.cartItems.forEach(function (item) {
      if (item.quantityModel > 10 || item.quantityModel == 0) {
        if(!item.extraQuantity)
        {
        item.extraQuantity=item.quantityModel;
        }
      }
    });
  }

  getOrderTotal() {
    let multiplyprice = 0.00;
    let Temp = 0;
    for (var i = 0; i <= this.cartItems.length - 1; i++) {
      if (this.cartItems[i].bundle == 'multiple') {
        multiplyprice = parseFloat(this.cartItems[i].price) * 2;
        multiplyprice = multiplyprice * parseFloat(this.cartItems[i].quantityModel);
      }
      else {
        multiplyprice = parseFloat(this.cartItems[i].price) * parseFloat(this.cartItems[i].quantityModel);
      }

      Temp = Temp + multiplyprice;
    }
    return +Temp;
  }

  getSubTotal(ProductList: any[]) {
    let multiplyprice = 0;
    let Temp = 0;
    for (var i = 0; i <= ProductList.length - 1; i++) {
      multiplyprice = parseFloat(ProductList[i].Price) * parseFloat(ProductList[i].quantityModel);
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
      },
      {
        id: '5',
        name: 'Qty 5',
        value: 5
      }

      ,
      {
        id: '6',
        name: 'Qty 6',
        value: 6
      }
      ,
      {
        id: '7',
        name: 'Qty 7',
        value: 7
      },

      {
        id: '8',
        name: 'Qty 8',
        value: 8
      }
      ,
      {
        id: '9',
        name: 'Qty 9',
        value: 9
      }
      ,
      {
        id: '10',
        name: 'Qty 10',
        value: 10
      },
      {
        id: 'Others',
        name: 'Custom',
        value: 0
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

  customQuantity(quantity: any) {
    return `Qty ${quantity}`;
  }


  subscription(){
    this.sessionService.setSessionObject('inputdata',this.inputdata.toDateString());
  }

}

import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartTypeEnum } from '@app/_models/cart-type-enum';
import { SessionService } from '@app/_services';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common'
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  subscriptionPurchase = false;
  inputdata: any;
  promocode_onetime: string;
  data_learn: boolean = false;
  closeResult: string;
  cartItems: any[] = [];
  minDate = new Date();
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop'
  };
  oneTimePriceCartItemsCount: number = 0;
  subscriptionCartItemsCount: number = 0;
  cartSummaryTotal: number = 0;
  cart: any[];
  subtotalOneTimePrice: number = 0;
  subTotalSubscriptionPrice: number = 0;
  total = false;
  subscriptionCartItems: any[] = [];
  oneTimePriceCartItems: any[] = [];
  quantity: any[];
  years: any[];
  onTextChange(value) {
  }
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
    this.subscriptionCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.Subscription);
    this.oneTimePriceCartItems = this.cartItems.filter(x => x.selectDelivery == CartTypeEnum.OneTimePrice);
    this.oneTimePriceCartItemsCount = this.oneTimePriceCartItems.length;
    this.subscriptionCartItemsCount = this.subscriptionCartItems.length;
    this.quantityForOneTime('', '');
    this.quantityForSubscriptionTime('', '');
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


  removeItem(cartItem: any, type: any) {
    debugger
    this.spinner.show();
    this.sessionService.removeSessionItem('productCartItems');
    switch (type) {
      case 0:
        this.oneTimePriceCartItems = this.oneTimePriceCartItems.filter(x => x.itemCode != cartItem.itemCode);
        // this.subscriptionCartItems.length > 0 ? this.oneTimePriceCartItems.push(...this.subscriptionCartItems) : '';
        this.oneTimePriceCartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems', this.oneTimePriceCartItems) : this.sessionService.removeSessionItem('productCartItems');
        // this.subscriptionCartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems', this.subscriptionCartItems) : '';
        // this.updateCartSession();
        break;
      case 1:
        this.subscriptionCartItems = this.subscriptionCartItems.filter(x => x.itemCode != cartItem.itemCode);
        // this.oneTimePriceCartItems.length > 0 ? this.subscriptionCartItems.push(...this.oneTimePriceCartItems) : '';
        this.subscriptionCartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems', this.subscriptionCartItems) : this.sessionService.removeSessionItem('productCartItems');
        // this.oneTimePriceCartItems.length > 0 ? this.sessionService.setSessionObject('productCartItems', this.oneTimePriceCartItems) : '';
        // this.updateCartSession();
        break;
      default:
        break;
    }
    this.total = true;
    this.spinner.hide();
    this.quantityForOneTime('', '');
    this.quantityForSubscriptionTime('', '');
  }

  updateCartSession() {
    const items = this.sessionService.getSessionObject('productCartItems');
    this.sessionService.cartSession(items == null ? [] : items);
  }

  removeItemSubscription(subscriptionItem: any) {
    this.total = true;
    this.spinner.show();
    this.cart = this.subscriptionCartItems.filter(x => x.itemCode != subscriptionItem.itemCode);
    this.cartItems.push(this.cart);
    this.sessionService.setSessionObject('productCartItems', this.cartItems);

    this.quantityForOneTime('', '');
    this.quantityForSubscriptionTime('', '');
    this.spinner.hide();
    this.ngOnInit();
  }

  checkOutItem() {
    this.sessionService.setSessionItem("startDate", this.inputdata);  
    if (this.sessionService.getSessionItem('user')) {
      this.sessionService.setSessionObject('productCartItems', this.cartItems);
      this.router.navigate(["/store/checkout"]);
    } else {
      let isTrue = true;
      this.sessionService.setSessionItem('isTrue', isTrue);
      this.router.navigate(["/sign-in"]);
    }
  }

  quantityForOneTime(cartitem: any, selectedvalue: any) {
    this.cartSummaryTotal = 0;
    this.bindDropDown();
    if (selectedvalue != '' && selectedvalue != undefined) {
      for (var i = 0; i <= this.oneTimePriceCartItems.length - 1; i++) {
        if (this.oneTimePriceCartItems[i].itemCode == cartitem.itemCode) {
          this.oneTimePriceCartItems[i].quantityModel = selectedvalue;
        }
      }
    }
    this.subtotalOneTimePrice = this.getSubTotal(this.oneTimePriceCartItems);
    this.sessionService.setSessionItem("unSubscriptionTotal", this.subtotalOneTimePrice)
    this.cartSummaryTotal = this.subtotalOneTimePrice + this.subTotalSubscriptionPrice;
    this.cartSummaryTotal = +this.cartSummaryTotal.toFixed(2)
  }

  quantityForSubscriptionTime(delivery: any, selectedvalue: any) {
    this.cartSummaryTotal = 0;
    this.bindDropDown();
    if (selectedvalue != '' && selectedvalue != undefined) {
      for (var i = 0; i <= this.subscriptionCartItems.length - 1; i++) {
        if (this.subscriptionCartItems[i].itemCode == delivery.itemCode) {
          this.subscriptionCartItems[i].quantityModel = selectedvalue;
        }
      }
    }
    this.subTotalSubscriptionPrice = this.getSubTotal(this.subscriptionCartItems);
    this.sessionService.setSessionItem("subscriptionTotal", this.subTotalSubscriptionPrice)
    this.cartSummaryTotal = this.subtotalOneTimePrice + this.subTotalSubscriptionPrice;
    this.cartSummaryTotal = +this.cartSummaryTotal.toFixed(2)
  }

  getSubTotal(ProductList: any[]) {
    let multiplyprice = 0;
    let Temp = 0;
    for (var i = 0; i <= ProductList.length - 1; i++) {
      if (ProductList[i].quantityModel == 'Qty1') {
        multiplyprice = parseFloat(ProductList[i].price) * 1;
        Temp = Temp + multiplyprice;
        //this.oneTimePriceCartItems[i].bv = this.subTotalPrice;
      }
      if (ProductList[i].quantityModel == 'Qty2') {
        multiplyprice = parseFloat(ProductList[i].price) * 2;
        Temp = Temp + multiplyprice;
        //this.oneTimePriceCartItems[i].bv = this.subTotalPrice;
      }
      if (ProductList[i].quantityModel == 'Qty3') {
        multiplyprice = parseFloat(ProductList[i].price) * 3;
        Temp = Temp + multiplyprice;
        //this.oneTimePriceCartItems[i].bv = this.subTotalPrice;
      }
      if (ProductList[i].quantityModel == 'Qty4') {
        multiplyprice = parseFloat(ProductList[i].price) * 4;
        Temp = Temp + multiplyprice;
        //this.oneTimePriceCartItems[i].bv = this.subTotalPrice;
      }
    }
    return +Temp.toFixed(2);
  }

  bindDropDown() {
    this.quantity = [
      {
        id: '1',
        name: 'Qty 1',
        value: 'Qty1'
      },
      {
        id: '2',
        name: 'Qty 2',
        value: 'Qty2'
      },
      {
        id: '3',
        name: 'Qty 3',
        value: 'Qty3'
      },
      {
        id: '4',
        name: 'Qty 4',
        value: 'Qty4'
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

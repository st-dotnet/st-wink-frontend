import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/_services';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { param } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '@app/_services/shop.service';
import { CartTypeEnum } from '@app/_models/cart-type-enum';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  incredShow: Boolean = false;
  isShowDivIf = false;
  itemCode: number;
  productDetail: any;
  productItems: any[] = [];
  productItem: any[];
  bundles: any[] = [];
  cartTypes: any[] = [];
  bundle: string;
  productPrice:number;
  showSubscription = false;
  selectDelivery: CartTypeEnum;
  subscriptionModel: any;
  quantity: any[] = [];
  years: any[] = [];
  quantityValue: any;
  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }
  productCartItems: any[] = [];
  product: any; 

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  slide_reviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  product_reviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

  banner_products: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  constructor(
     private sessionService: SessionService,
     private shopService : ShopService,
     private activatedRoute: ActivatedRoute,
     private spinner: NgxSpinnerService,
     private toastrService: ToastrService,) {
     this.sessionService.scrollToTop();
     this.activatedRoute.params.subscribe((params: Params) => {
      this.itemCode = params['id'];     
    });
    this.bundles = [
      {
        id: '1',
        name: 'Single',
        value: 'single'
      },
      {
        id: '2',
        name: '2-pk (Save 5%)',
        value: 'multiple'
      }
    ]
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

  ngOnInit(): void {    
    this.cartTypes = Object.values(CartTypeEnum).filter(x => !isNaN(Number(x)));
  this.getProductDetail(this.itemCode);  
  }

  toggleShow() {
    this.incredShow = !this.incredShow;
  }
  
  getProductDetail(itemCode){
    debugger;
    this.spinner.show();
    this.shopService.GetProductDetail(itemCode).subscribe(result => {
    this.productDetail=result;
    this.productPrice=this.productDetail.price;
    this.spinner.hide();
    console.log("ProductDetail", this.productDetail);
    });
  }

  checkDelivery(type: CartTypeEnum) {
    debugger
    switch (type) {
      case CartTypeEnum.OneTimePrice:
        this.showSubscription = false;
        this.selectDelivery = CartTypeEnum.OneTimePrice;
        break;
      case CartTypeEnum.Subscription:
        this.showSubscription = true;
        this.selectDelivery = CartTypeEnum.Subscription;
        break;
      default:
        break;
    }
  }

  checkBundle(bundle: string, productPrice: any) {
    debugger;
    this.bundle = bundle;
    if (bundle == "multiple") {
      this.bundle = bundle;
      let subscribePrice = (productPrice / 100) * 5;
      this.productDetail.price = (productPrice - subscribePrice).toFixed(2);
    } else {
      this.bundle = bundle;
      this.productDetail.price = this.productPrice;
    }
  }


  addToCart(product : any) {
    debugger
    this.productItems =this.sessionService.getSessionObject('productCartItems');
    if (this.quantityValue == undefined) {
      this.quantityValue = 1;
    }
    if (this.bundle == undefined) {
      this.bundle = 'single';
    }
    if (this.selectDelivery == undefined) {
      this.selectDelivery = 0 ;
    }
    if (this.subscriptionModel == undefined) {
      this.subscriptionModel = 'singleDelivery';
    }
    const items = {
      bundle: this.bundle,
      selectDelivery: this.selectDelivery,
      subscriptionModel: this.subscriptionModel,
      quantityModel: this.quantityValue,
      calculatedPrice:0,
      afterDiscountPrice:0,
      discount:0
    }
    Object.entries(items).forEach(([key, value]) => { product[key] = value });
    if (this.productItems) {
      this.productItem = this.productItems.find(x => x.itemCode == product.itemCode);
      this.productItems.push(product);
      //this.productItems.find(x=> x.itemcode == product.itemCode).push(items);
      this.sessionService.cartSession(this.productItems);
      this.sessionService.setSessionObject('productCartItems', this.productItems);
      this.toastrService.success('Product added successfully');
    }
    else {
      Object.entries(items).forEach(([key, value]) => { product[key] = value });
      this.productCartItems.push(product);
      this.sessionService.cartSession(this.productCartItems);
      this.sessionService.setSessionObject('productCartItems', this.productCartItems);
      this.toastrService.success('Product added successfully');
    }  
  }
}

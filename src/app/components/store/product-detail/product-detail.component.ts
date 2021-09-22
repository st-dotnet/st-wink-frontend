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
  bundle: string = 'single';
  productPrice: number;
  showSubscription = false;
  selectDelivery: CartTypeEnum = 0;
  subscriptionModel: string = 'singleDelivery';
  quantity: any[] = [];
  delivery: any[] = [];
  years: any[] = [];
  quantityValue: number = 1;
  itemCodeTitle: any;
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
    private shopService: ShopService,
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
    this.delivery = [
      {
        id: '3',
        name: 'Single Delivery',
        value: 'singleDelivery'
      },
      {
        id: '4',
        name: 'Subscribe & Save 15%',
        value: 'subscribe'
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

  getProductDetail(itemCode) {
    debugger;
    this.spinner.show();
    this.shopService.GetProductDetail(itemCode).subscribe(result => {
      this.productDetail = result;
      this.productPrice = this.productDetail.price;
      this.itemCodeTitle = this.productDetail.itemCode;
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
        this.subscriptionModel = 'singleDelivery';
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
      productPrice = productPrice * 2;
      this.bundle = bundle;
      let subscribePrice = (productPrice / 100) * 5;
      this.productDetail.price = (productPrice - subscribePrice).toFixed(2);
    } else {
      this.bundle = bundle;
      this.productDetail.price = this.productPrice;
    }
  }

  addToCart(product: any) {
    this.productItems = this.sessionService.getSessionObject('productCartItems');

    if (this.subscriptionModel == undefined) {
      this.subscriptionModel = 'singleDelivery';
    }
    const items = {
      bundle: this.bundle,
      selectDelivery: this.selectDelivery,
      subscriptionModel: this.subscriptionModel,
      quantityModel: +this.quantityValue,
      calculatedPrice: 0,
      afterDiscountPrice: 0,
      discount: 0,
      quantityLimit: 4
    }
    Object.entries(items).forEach(([key, value]) => { product[key] = value });
    debugger;
    if (this.productItems) {
      //this.productItem=this.productItems.find(item => item.itemCode == product.itemCode)
      if (product.bundle == 'single' && product.selectDelivery == 0 && product.subscriptionModel == 'singleDelivery') {
        let single_singledelivery = this.productItems.find(x => x.itemCode == product.itemCode && x.bundle == 'single' && x.selectDelivery == 0 && x.subscriptionModel == 'singleDelivery')
        let old_single_singledelivery = single_singledelivery;
        if (single_singledelivery) {
          const index: number = this.productItems.indexOf(single_singledelivery);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          product.quantityModel = single_singledelivery.quantityModel + +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            this.productItems.push(old_single_singledelivery);
            this.toastrService.error('You Exceed your Quantity Limit 4');
          }
          else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');            
          }
        }
        else {
          this.productItems.push(product);
          this.toastrService.success('Product added successfully');        }
      }

      if (product.bundle == 'single' && product.selectDelivery == 1 && product.subscriptionModel !== 'singleDelivery') {
        let single_subscriptiondelivery = this.productItems.find(x => x.itemCode == product.itemCode && x.bundle == 'single' && x.selectDelivery == 1 && x.subscriptionModel == product.subscriptionModel)
        let old_single_subscriptiondelivery = single_subscriptiondelivery;
        if (single_subscriptiondelivery) {
          const index: number = this.productItems.indexOf(single_subscriptiondelivery);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          product.quantityModel = single_subscriptiondelivery.quantityModel + +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            this.productItems.push(old_single_subscriptiondelivery);
            this.toastrService.error('You Exceed your Quantity Limit 4');
          }
          else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          }
        }
        else {
          this.productItems.push(product);
          this.toastrService.success('Product added successfully');
        }
      }
      if (product.bundle == 'multiple' && product.selectDelivery == 0 && product.subscriptionModel == 'singleDelivery') {
        let multiple_singledelivery = this.productItems.find(x => x.itemCode == product.itemCode && x.bundle == 'multiple' && x.selectDelivery == 0 && x.subscriptionModel == 'singleDelivery')
        let old_multiple_singledelivery = multiple_singledelivery;
        if (multiple_singledelivery) {
          const index: number = this.productItems.indexOf(multiple_singledelivery);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          product.quantityModel = multiple_singledelivery.quantityModel + +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            this.productItems.push(old_multiple_singledelivery);
            this.toastrService.error('You Exceed your Quantity Limit 4');
          }
          else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          }
        }
        else {
          this.productItems.push(product);
          this.toastrService.success('Product added successfully');
        }
      }
      if (product.bundle == 'multiple' && product.selectDelivery == 1 && product.subscriptionModel !== 'singleDelivery') {
        let multiple_subscriptiondelivery = this.productItems.find(x => x.itemCode == product.itemCode && x.bundle == 'multiple' && x.selectDelivery == 1 && x.subscriptionModel == product.subscriptionModel)
        let old_multiple_subscriptiondelivery = multiple_subscriptiondelivery;
        if (multiple_subscriptiondelivery) {
          const index: number = this.productItems.indexOf(multiple_subscriptiondelivery);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          product.quantityModel = multiple_subscriptiondelivery.quantityModel + +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            this.productItems.push(old_multiple_subscriptiondelivery);
            this.toastrService.error('You Exceed your Quantity Limit 4');
          }
          else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          }
        }
        else {
          this.productItems.push(product);
          this.toastrService.success('Product added successfully');
        }
      }
      this.sessionService.cartSession(this.productItems);
      this.sessionService.setSessionObject('productCartItems', this.productItems);
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

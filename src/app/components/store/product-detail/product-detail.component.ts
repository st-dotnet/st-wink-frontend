import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
} from '@angular/core';
import { SessionService } from '@app/_services';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { param } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '@app/_services/shop.service';
import { CartTypeEnum } from '@app/_models/cart-type-enum';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {

  tooltipData: boolean = false;
  review: number;
  incredShow: Boolean = false;
  isShowDivIf = false;
  itemCode: number;
  productDetail: any;
  productItems: any[] = [];
  productItem: any[];
  bundles: any[] = [];
  cartTypes: any[] = [];
  productPrice: number;
  showSubscription = false;
  quantity: any[] = [];
  delivery: any[] = [];
  years: any[] = [];
  quantityValue: number = 1;
  itemCodeTitle: any;
  subscriptionModelduration: string;
  filterTitleShow: any;
  bundletype: string;
  bundlePrice: any = 0;
  showActualPrice: boolean;
  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }
  productCartItems: any[] = [];
  product: any;

  bundle: string;
  selectDelivery: CartTypeEnum = 0;
  subscriptionModel: string;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };

  slide_reviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };

  product_reviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 4,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };

  banner_products: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };

  showOtherTextbox = null;
  cartItems: any[] = [];

  constructor(
    private sessionService: SessionService,
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.sessionService.scrollToTop();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.itemCode = params['id'];
    });
    this.bundles = [
      {
        id: '1',
        name: 'Single',
        value: 'single',
      },
      {
        id: '2',
        name: '2-pk (Save 5%)',
        value: 'multiple',
      },
    ];
    this.quantity = [
      {
        id: '1',
        name: 'Qty 1',
        value: 1,
      },
      {
        id: '2',
        name: 'Qty 2',
        value: 2,
      },
      {
        id: '3',
        name: 'Qty 3',
        value: 3,
      },
      {
        id: '4',
        name: 'Qty 4',
        value: 4,
      },
      {
        id: '5',
        name: 'Qty 5',
        value: 5,
      },
      {
        id: '6',
        name: 'Qty 6',
        value: 6,
      },
      {
        id: '7',
        name: 'Qty 7',
        value: 7,
      },
      {
        id: '8',
        name: 'Qty 8',
        value: 8,
      },
      {
        id: '9',
        name: 'Qty 9',
        value: 9,
      },
      {
        id: '10',
        name: 'Qty 10',
        value: 10,
      },
      {
        id: 'Others',
        name: 'Custom',
        value: 11,
      },
    ];
    this.delivery = [
      {
        id: '3',
        name: 'Single Delivery',
        value: 'singleDelivery',
      },
      {
        id: '4',
        name: 'Subscribe & Save 15%',
        value: 'subscribe',
      },
    ];
    this.years = [
      {
        id: '1',
        name: 'Every Month',
        value: 'everyMonth',
      },
      {
        id: '2',
        name: 'Every Week',
        value: 'everyWeek',
      },
      {
        id: '3',
        name: 'Every Year',
        value: 'everyYear',
      },
    ];
  }

  closeTooltip() {
    this.tooltipData = false;
  }
  showTooltip() {
    this.tooltipData = true;
  }

  ngOnInit(): void {
    this.filterTitleShow = this.sessionService.getSessionItem(
      'categoryDescription'
    );
    this.cartTypes = Object.values(CartTypeEnum).filter(
      (x) => !isNaN(Number(x))
    );
    this.getProductDetail(this.itemCode);
   
    
    //var x = document.getElementById("data_val_item_code").getAttribute("data-product-id");
    //console.log("X is "+x);
  }

  toggleShow() {
    this.incredShow = !this.incredShow;
  }

  getProductDetail(itemCode) {
    this.spinner.show();
    this.shopService.GetProductDetail(itemCode).subscribe((result) => {
      debugger;
      this.productDetail = result;
      this.productPrice = this.productDetail.price;
      this.itemCodeTitle = this.productDetail.itemCode;
      this.review = this.productDetail.itemID;
      this.spinner.hide();
      this.bundle = 'single';
      this.selectDelivery = 0;
      this.subscriptionModel = 'singleDelivery';
      // const layout= `<div class='yotpo bottomLine' data-product-id='${this.productDetail.itemID}'>dsfsdfdfds</div>`;
      // this.review = this.sanitizer.bypassSecurityTrustHtml(layout);
    });
  }

  getYearValue(event: any) {
    this.subscriptionModelduration = event;
  }

  goToList(type) {
    this.sessionService.setSessionItem('categorySelect', type);
    if (type == 'All Products') this.router.navigate([`store/products/`]);
    else this.router.navigate([`store/products/${this.filterTitleShow}`]);
  }

  addToCart(product: any) {

    this.productItems =
      this.sessionService.getSessionObject('productCartItems');
    if (
      this.selectDelivery == 1 &&
      this.subscriptionModelduration == undefined
    ) {
      return this.toastrService.error('Please select the subscription plan');
    }
    if (this.selectDelivery == 1) {
      this.subscriptionModel = this.subscriptionModelduration;
    }
    const items = {
      bundle: this.bundle,
      selectDelivery: this.selectDelivery,
      subscriptionModel: this.subscriptionModel,
     // quantityModel: +this.quantityValue,
      Price: 0,
      discount: 0,
      quantityLimit: 4,
      isDisabled: null,
    };
    Object.entries(items).forEach(([key, value]) => {
      product[key] = value;
    });
    //No percentage calculation
    if (
      product.bundle == 'single' &&
      product.selectDelivery == 0 &&
      product.subscriptionModel == 'singleDelivery'
    ) {
      product.Price = product.price;
    }
    // 15% calulation
    if (
      product.bundle == 'single' &&
      product.selectDelivery == 1 &&
      product.subscriptionModel !== 'singleDelivery'
    ) {
      product.Price = product.price;
    }
    //5% calculation
    if (
      product.bundle == 'multiple' &&
      product.selectDelivery == 0 &&
      product.subscriptionModel == 'singleDelivery'
    ) {
      let itemPrice = product.price;
      itemPrice = itemPrice * 2;
      let discountper5 = (itemPrice * 5) / 100;
      itemPrice = itemPrice - discountper5;
      product.Price = itemPrice;
    }
    //5% cal
    if (
      product.bundle == 'multiple' &&
      product.selectDelivery == 1 &&
      product.subscriptionModel !== 'singleDelivery'
    ) {
      let itemPrice = product.price;
      itemPrice = itemPrice * 2;
      let discountper5 = (itemPrice * 5) / 100;
      product.Price = itemPrice - discountper5;
    }

    if (this.productItems) {
      //No percentage calucation
      if (
        product.bundle == 'single' &&
        product.selectDelivery == 0 &&
        product.subscriptionModel == 'singleDelivery'
      ) {
        let single_singledelivery = this.productItems.find(
          (x) =>
            x.itemCode == product.itemCode &&
            x.bundle == 'single' &&
            x.selectDelivery == 0 &&
            x.subscriptionModel == 'singleDelivery'
        );
        let old_single_singledelivery = single_singledelivery;
        if (single_singledelivery) {
          const index: number = this.productItems.indexOf(
            single_singledelivery
          );
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          product.quantityModel =
            single_singledelivery.quantityModel + +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            // this.productItems.push(old_single_singledelivery);
            // this.toastrService.error('You Exceed your Quantity Limit 4');

            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          } else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          }
        } else {
          this.productItems.push(product);
          this.toastrService.success('Product added successfully');
        }
      }
      // 15% calulation
      if (
        product.bundle == 'single' &&
        product.selectDelivery == 1 &&
        product.subscriptionModel !== 'singleDelivery'
      ) {
        let single_subscriptiondelivery = this.productItems.find(
          (x) =>
            x.itemCode == product.itemCode &&
            x.bundle == 'single' &&
            x.selectDelivery == 1 &&
            x.subscriptionModel == product.subscriptionModel
        );
        let old_single_subscriptiondelivery = single_subscriptiondelivery;
        if (single_subscriptiondelivery) {
          const index: number = this.productItems.indexOf(
            single_subscriptiondelivery
          );
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          product.quantityModel =
            single_subscriptiondelivery.quantityModel + +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            // this.productItems.push(old_single_subscriptiondelivery);
            // this.toastrService.error('You Exceed your Quantity Limit 4');

            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          } else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          }
        } else {
          this.productItems.push(product);
          this.toastrService.success('Product added successfully');
        }
      }
      //5% calculation
      if (
        product.bundle == 'multiple' &&
        product.selectDelivery == 0 &&
        product.subscriptionModel == 'singleDelivery'
      ) {
        let multiple_singledelivery = this.productItems.find(
          (x) =>
            x.itemCode == product.itemCode &&
            x.bundle == 'multiple' &&
            x.selectDelivery == 0 &&
            x.subscriptionModel == 'singleDelivery'
        );
        let old_multiple_singledelivery = multiple_singledelivery;
        if (multiple_singledelivery) {
          const index: number = this.productItems.indexOf(
            multiple_singledelivery
          );
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          product.quantityModel =
            multiple_singledelivery.quantityModel + +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            // this.productItems.push(old_multiple_singledelivery);
            // this.toastrService.error('You Exceed your Quantity Limit 4');

            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          } else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          }
        } else {
          this.productItems.push(product);
          this.toastrService.success('Product added successfully');
        }
      }
      //5% cal + 15 % cal
      if (
        product.bundle == 'multiple' &&
        product.selectDelivery == 1 &&
        product.subscriptionModel !== 'singleDelivery'
      ) {
        let multiple_subscriptiondelivery = this.productItems.find(
          (x) =>
            x.itemCode == product.itemCode &&
            x.bundle == 'multiple' &&
            x.selectDelivery == 1 &&
            x.subscriptionModel == product.subscriptionModel
        );
        let old_multiple_subscriptiondelivery = multiple_subscriptiondelivery;
        if (multiple_subscriptiondelivery) {
          const index: number = this.productItems.indexOf(
            multiple_subscriptiondelivery
          );
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          product.quantityModel =
            multiple_subscriptiondelivery.quantityModel +
            +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            // this.productItems.push(old_multiple_subscriptiondelivery);
            // this.toastrService.error('You Exceed your Quantity Limit 4');

            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          } else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          }
        } else {
          this.productItems.push(product);
          this.toastrService.success('Product added successfully');
        }
      }
      this.sessionService.cartSession(this.productItems);
      this.sessionService.setSessionObject(
        'productCartItems',
        this.productItems
      );
    } else {
      // Object.entries(items).forEach(([key, value]) => { product[key] = value });
      this.productCartItems.push(product);
      this.sessionService.cartSession(this.productCartItems);
      this.sessionService.setSessionObject(
        'productCartItems',
        this.productCartItems
      );
      this.toastrService.success('Product added successfully');
    }
  }

  checkBundle(bundle: string, productPrice: any) {
    this.bundle = bundle;
    this.bundlePrice = 0;
    if (this.bundle == 'single') {
      this.bundletype = '';
      this.bundlePrice = productPrice;
    } else {
      this.bundletype = '/ 2-pk';
      this.showActualPrice = true;
      let itemPrice = productPrice * 2;
      let discountper5 = (itemPrice * 5) / 100;
      this.bundlePrice = itemPrice - discountper5;
      this.bundlePrice = this.bundlePrice.toFixed(2);
    }
  }

  checkDelivery(type: CartTypeEnum) {
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

  quantityForOneTime(productDetail: any, selectedvalue: number) {
    this.quantityCalculation(productDetail, selectedvalue);
  }

  quantitychanged(cartitem: any, selectedvalue: number) {

    this.quantityCalculation(cartitem, selectedvalue);
    const item = this.cartItems.find((x) => x.itemCode == cartitem.itemCode);

    if (item && selectedvalue > 10) {
      item.quantityModel = item.quantityModel + item.extraQuantity;
    }
  }

  quantityCalculation(productDetail: any, selectedvalue: number) {
    this.cartItems = this.sessionService.getSessionObject('productCartItems');
    if (selectedvalue < 10) {
      productDetail.extraQuantity = null;
    }
    if (selectedvalue != null && selectedvalue != undefined) {
      if (selectedvalue == 11 || selectedvalue > 10) {
        this.showOtherTextbox = productDetail.itemCode;
        $('#showinput' + productDetail.itemCode).show();
      } else {
        $('#showinput' + productDetail.itemCode).hide();
      }
      if (this.cartItems) {
        for (var i = 0; i <= this.cartItems.length - 1; i++) {
          if (this.cartItems[i].itemCode == productDetail.itemCode) {
            this.cartItems[i].quantityModel = +selectedvalue;
          }
        }
      }
    }
    this.productDetail.quantityModel = +selectedvalue;
    this.sessionService.setSessionObject('productCartItems', this.cartItems);
  }
}

import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { CategoryModel, ShopProductModel } from '@app/_models/shop';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { CartTypeEnum } from '@app/_models/cart-type-enum';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  title = '';
  closeResult: string;
  webCategoryID: number = 3;
  categoryModels: CategoryModel[] = [];
  shopProductModels: ShopProductModel[] = [];
  product: any;
  categoryId: number = 0;
  productCartItems: any[] = [];
  productItems: any[] = [];
  productItem: any;
  bundles: any[] = [];
  bundle: string = 'single';
  delivery: any[] = [];
  selectDelivery: CartTypeEnum = 0;
  quantity: any[] = [];
  years: any[] = [];
  showSubscription = false;
  subscriptionModel: string = 'singleDelivery';
  quantityValue: number = 1;
  cartTypes: any[] = [];
  productPrice: number = 0;
  filterValue: number = 1;
  modalOptions: NgbModalOptions = {
    //backdrop: 'static',
    backdropClass: 'customBackdrop',
    windowClass: 'prodview-modal'
  };

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal, private shopService: ShopService,
    private spinner: NgxSpinnerService, private router: Router,
    private toastrService: ToastrService) {
    this.sessionService.scrollToTop();
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
  }

  ngOnInit(): void {
    this.cartTypes = Object.values(CartTypeEnum).filter(x => !isNaN(Number(x)));
    this.GetDDLCategoryById();
  }

  GetDDLCategoryById() {
    this.spinner.show();
    this.shopService.GetCategoryForShopById(this.webCategoryID).subscribe(result => {
      this.categoryModels = result;
      var data = this.categoryModels.filter(x => x.webCategoryDescription.toString() === "All Products");
      this.categoryId = data[0]?.webCategoryID;

      this.GetProductsList(this.categoryId, this.filterValue);
    })
  }

  onCategoryChange(e: Event) {
    debugger
    this.spinner.show();
    this.categoryId = Number((e.target as HTMLInputElement)?.value);
    this.GetProductsList(this.categoryId, this.filterValue);
  }

  open(content: any, product: any) {
    //this.bundle = 'single';
    this.product = product;
    this.productPrice = product.price;
    this.showSubscription = false;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  GetProductsList(categoryId: number, filterValue: number) {
    this.shopProductModels = [];
    this.shopService.GetProductsList(categoryId, filterValue).subscribe(result => {
      this.shopProductModels = result;
      this.spinner.hide();
      console.log("product list", this.shopProductModels)
    })
  }

  getImage(imageName: string) {
    return `${environment.productImageApiUrl}${imageName}`;
  }

  RedirectToProduct(product: any) {
    this.modalService.dismissAll();
    this.router.navigate(['/store/product', product.itemCode]);
  }

  addToCart(product: any) {
    debugger;
    this.productItems = this.sessionService.getSessionObject('productCartItems');
    if (product.selectDelivery == 0) {
      this.subscriptionModel = 'singleDelivery';
    }
    const items = {
      bundle: this.bundle,
      selectDelivery: this.selectDelivery,
      subscriptionModel: this.subscriptionModel,
      quantityModel: +this.quantityValue,
      Price: 0,
      discount: 0,
      quantityLimit: 4
    }
    Object.entries(items).forEach(([key, value]) => { product[key] = value });
    //No percentage calculation
    if (product.bundle == 'single' && product.selectDelivery == 0 && product.subscriptionModel == 'singleDelivery') {
      product.Price = product.price; 
    }
    // 15% calulation
    if (product.bundle == 'single' && product.selectDelivery == 1 && product.subscriptionModel !== 'singleDelivery') {
      product.Price = product.price;
    }
    //5% calculation
    if (product.bundle == 'multiple' && product.selectDelivery == 0 && product.subscriptionModel == 'singleDelivery') {
      let itemPrice = product.price;
      itemPrice=itemPrice*2;
      let discountper5 = (itemPrice * 5) / 100;
      itemPrice = itemPrice - discountper5;
      product.Price = itemPrice;
    }
    //5% cal
    if (product.bundle == 'multiple' && product.selectDelivery == 1 && product.subscriptionModel !== 'singleDelivery') {
      let itemPrice = product.price;
      itemPrice=itemPrice*2;
      let discountper5 = (itemPrice * 5) / 100;
      product.Price = itemPrice-discountper5; 
    }

    if (this.productItems) {
      //No percentage calucation
      if (product.bundle == 'single' && product.selectDelivery == 0 && product.subscriptionModel == 'singleDelivery') {
        let single_singledelivery = this.productItems.find(x => x.itemCode == product.itemCode && x.bundle == 'single' && x.selectDelivery == 0 && x.subscriptionModel == 'singleDelivery')
        let old_single_singledelivery = single_singledelivery;
        if (single_singledelivery) {
          const index: number = this.productItems.indexOf(single_singledelivery);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          this.product.quantityModel = single_singledelivery.quantityModel + +product.quantityModel;

          if (this.product.quantityModel > product.quantityLimit) {
            this.productItems.push(old_single_singledelivery);
            this.toastrService.error('You Exceed your Quantity Limit 4');
          }
          else {
            this.productItems.push(this.product);
            this.toastrService.success('Product added successfully');
            this.modalService.dismissAll();
          }
        }
        else {
          this.productItems.push(this.product);
          this.toastrService.success('Product added successfully');
          this.modalService.dismissAll();
        }
      }
      // 15% calulation
      if (product.bundle == 'single' && product.selectDelivery == 1 && product.subscriptionModel !== 'singleDelivery') {
        let single_subscriptiondelivery = this.productItems.find(x => x.itemCode == product.itemCode && x.bundle == 'single' && x.selectDelivery == 1 && x.subscriptionModel == product.subscriptionModel)
        let old_single_subscriptiondelivery = single_subscriptiondelivery;
        if (single_subscriptiondelivery) {
          const index: number = this.productItems.indexOf(single_subscriptiondelivery);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          this.product.quantityModel = single_subscriptiondelivery.quantityModel + +product.quantityModel;

          if (this.product.quantityModel > product.quantityLimit) {
            this.productItems.push(old_single_subscriptiondelivery);
            this.toastrService.error('You Exceed your Quantity Limit 4');
          }
          else {
            this.productItems.push(this.product);
            this.toastrService.success('Product added successfully');
            this.modalService.dismissAll();
          }
        }
        else {
          this.productItems.push(this.product);
          this.toastrService.success('Product added successfully');
          this.modalService.dismissAll();
        }
      }
      //5% calculation 
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
            this.productItems.push(this.product);
            this.toastrService.success('Product added successfully');
            this.modalService.dismissAll();
          }
        }
        else {
          this.productItems.push(this.product);
          this.toastrService.success('Product added successfully');
          this.modalService.dismissAll();
        }
      }
      //5% cal + 15 % cal
      if (product.bundle == 'multiple' && product.selectDelivery == 1 && product.subscriptionModel !== 'singleDelivery') {
        let multiple_subscriptiondelivery = this.productItems.find(x => x.itemCode == product.itemCode && x.bundle == 'multiple' && x.selectDelivery == 1 && x.subscriptionModel == product.subscriptionModel)
        let old_multiple_subscriptiondelivery = multiple_subscriptiondelivery;
        if (multiple_subscriptiondelivery) {
          const index: number = this.productItems.indexOf(multiple_subscriptiondelivery);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          this.product.quantityModel = multiple_subscriptiondelivery.quantityModel + +product.quantityModel;

          if (product.quantityModel > product.quantityLimit) {
            this.productItems.push(old_multiple_subscriptiondelivery);
            this.toastrService.error('You Exceed your Quantity Limit 4');
          }
          else {
            this.productItems.push(this.product);
            this.toastrService.success('Product added successfully');
            this.modalService.dismissAll();
          }
        }
        else {
          this.productItems.push(this.product);
          this.toastrService.success('Product added successfully');
          this.modalService.dismissAll();
        }
      }
      this.sessionService.cartSession(this.productItems);
      this.sessionService.setSessionObject('productCartItems', this.productItems);
    }
    else {
      // Object.entries(items).forEach(([key, value]) => { product[key] = value });
      this.productCartItems.push(product);
      this.sessionService.cartSession(this.productCartItems);
      this.sessionService.setSessionObject('productCartItems', this.productCartItems);
      this.toastrService.success('Product added successfully');
      this.modalService.dismissAll();
    }
  }

  checkBundle(bundle: string, productPrice: any) {
    this.bundle = bundle;
    // if (bundle == "multiple") {
    //   // productPrice = productPrice * 2;
    //   this.bundle = bundle;
    //   // let subscribePrice = (productPrice / 100) * 5;
    //   //productPrice = (productPrice - subscribePrice).toFixed(2);
    //   //  this.product.Price=productPrice;
    //   // console.log(productPrice)
    // } else {
    //   this.bundle = bundle;
    //   // productPrice = this.productPrice;
    //   //  this.product.Price=productPrice;
    // }
  }

  checkDelivery(type: CartTypeEnum) {
    switch (type) {
      case CartTypeEnum.OneTimePrice:
        this.showSubscription = false;
        this.subscriptionModel = '';
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

  onProductFilter(event: any) {
    this.spinner.show();
    this.filterValue = parseInt(event.target.value);
    this.GetProductsList(this.categoryId, this.filterValue);
  }
}

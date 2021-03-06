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
  productItem: any[];
  bundles: any[] = [];
  bundle: string;
  delivery: any[] = [];
  selectDelivery: CartTypeEnum;
  quantity: any[] = [];
  years: any[] = [];
  showSubscription = false;
  subscriptionModel: any;
  quantityValue: any;
  cartTypes: any[] = [];
  productPrice: number = 0;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop',
    windowClass: 'prodview-modal'
  };

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal, private shopService: ShopService,
    private spinner: NgxSpinnerService, private router: Router,
    private toastrService: ToastrService,) {
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
      this.GetProductsList(this.categoryId);
    })
  }

  onCategoryChange(e: Event) {
    this.spinner.show();
    this.categoryId = Number((e.target as HTMLInputElement)?.value);
    this.GetProductsList(this.categoryId);
  }

  open(content: any, product: any) {
    debugger;
    this.product = product;
    this.productPrice = product.price;
    this.showSubscription = false;
    this.quantityValue = 'Qty1'
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

  GetProductsList(categoryID: number) {
    this.shopProductModels = [];
    this.shopService.GetProductsList(categoryID).subscribe(result => {
      this.shopProductModels = result;
      // this.shopProductModels =_.sortBy(this.shopProductModels, [function(o) { return o.itemDescription; }]);
      this.spinner.hide();
      console.log("product list",this.shopProductModels)
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
    debugger
    this.productItems = this.sessionService.getSessionObject('productCartItems');
    if (this.quantityValue == undefined) {
      this.quantityValue = 'Qty1';
    }
    if (this.bundle == undefined) {
      this.bundle = 'single';
    }
    if (this.selectDelivery == undefined) {
      this.selectDelivery = 0;
    }
    if (this.subscriptionModel == undefined) {
      this.subscriptionModel = 'singleDelivery';
    }
    const items = {
      bundle: this.bundle,
      selectDelivery: this.selectDelivery,
      subscriptionModel: this.subscriptionModel,
      quantityModel: this.quantityValue
    }
    Object.entries(items).forEach(([key, value]) => { product[key] = value });
    if (this.productItems) {
      this.productItem = this.productItems.find(x => x.itemCode == product.itemCode);
      this.productItems.push(product);
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

  checkBundle(bundle: string, productPrice: any) {
    this.bundle = bundle;
    if (bundle == "multiple") {
      this.bundle = bundle;
      let subscribePrice = (productPrice / 100) * 5;
      this.product.price = (productPrice - subscribePrice).toFixed(2);
    } else {
      this.bundle = bundle;
      this.product.price = this.productPrice;
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

  onProductFilter(event: any) {
    debugger
    const filterValue = parseInt(event.target.value);
    this.shopService.filterProduct(filterValue, this.categoryId).subscribe((result: any) => {          
    });
  }
}

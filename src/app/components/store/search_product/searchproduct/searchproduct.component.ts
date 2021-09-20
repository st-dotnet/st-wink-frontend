import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartTypeEnum } from '@app/_models/cart-type-enum';
import { SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-searchproduct',
  templateUrl: './searchproduct.component.html',
  styleUrls: ['./searchproduct.component.css']
})
export class SearchproductComponent implements OnInit {
  searchText: string;
  shopProductModels: any[]=[];
  product: any;
  productPrice: any;
  showSubscription: boolean;
  quantityValue: any;
  closeResult: string;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop',
    windowClass: 'prodview-modal'
  };
  years: { id: string; name: string; value: string; }[];
  quantity: { id: string; name: string; value: number; }[];
  bundles: { id: string; name: string; value: string; }[];
  delivery: { id: string; name: string; value: string; }[];
  productItems: any;
  bundle: any;
  selectDelivery: any;
  subscriptionModel: any;
  productItem: any;
  productCartItems: any;
  cartTypes: any[] = [];;

  constructor( private sessionService: SessionService,
    private modalService: NgbModal, private shopService: ShopService,
    private spinner: NgxSpinnerService, private router: Router,
    private toastrService: ToastrService) { 
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
    ],
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
    this.searchText= this.sessionService.getSessionItem("searchItem");    
      this.spinner.show();
      this.getSearchProduct(this.searchText);   
  }

  
  getSearchProduct(search:any){
    this.shopService.searchProduct(search).subscribe(result => {
      debugger
      this.shopProductModels = result;
      this.spinner.hide();
      this.sessionService.removeSessionItem("searchItem")
    })
  }

  open(content: any, product: any) {
    debugger;
    this.product = product;
    this.productPrice = product.price;
    this.showSubscription = false;
    this.quantityValue = 1
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    debugger
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  RedirectToProduct(product: any) {
    this.modalService.dismissAll();
    this.router.navigate(['/store/product', product.itemCode]);
  }

  addToCart(product: any) {
    debugger
    this.productItems = this.sessionService.getSessionObject('productCartItems');
    if (this.quantityValue == undefined) {
      this.quantityValue = "1";
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
      quantityModel: +this.quantityValue,
      calculatedPrice: 0,
      afterDiscountPrice: 0,
      discount: 0,
      quantityLimit: 4
    }
    Object.entries(items).forEach(([key, value]) => { product[key] = value });
    if (this.productItems) {
      this.productItem = this.productItems.find(item => item.itemCode == product.itemCode && item.bundle == product.bundle)
      let oldvalue = this.productItem;
      if (this.productItem != null) {
        if (this.productItem.bundle == "single") {
          const index: number = this.productItems.indexOf(this.productItem);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          this.product.quantityModel = this.productItem.quantityModel + +product.quantityModel;

          if (this.product.quantityModel > product.quantityLimit) {
            this.productItems.push(oldvalue);
            this.toastrService.success('You Exceed your Quantity Limit 4');
          }
          else {
            this.productItems.push(this.product);
            this.toastrService.success('Product added successfully');
          }
        }
        else {
          const index: number = this.productItems.indexOf(this.productItem);
          if (index !== -1) {
            this.productItems.splice(index, 1);
          }
          this.product.quantityModel = this.productItem.quantityModel + +product.quantityModel;
          if (this.product.quantityModel > product.quantityLimit) {
            this.productItems.push(oldvalue);
            this.toastrService.success('You exceed your quantity limit 4');
          }
          else {
            this.productItems.push(product);
            this.toastrService.success('Product added successfully');
          }
        }
      }
      else {
        this.productItems.push(product);
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

}

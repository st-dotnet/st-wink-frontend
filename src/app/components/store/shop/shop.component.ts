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
import { Common } from '@app/common/common';



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
  selectDelivery: string;
  quantity: any[] = [];
  years: any[] = [];
  showSubscription = false;
  subscriptionModel:any;
  quantityModel:any;
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
    this.product = product;
    this.showSubscription=false;
    // this.subscriptionModel="";
    // this.quantityModel="";
    //this.router.navigate(['/product', { id: content }]);
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.product = product;
      console.log(this.product.largeImageUrl)
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
0
  GetProductsList(categoryID: number) {
    this.shopProductModels = [];
    this.shopService.GetProductsList(categoryID).subscribe(result => {
      this.shopProductModels = result;
      console.log("Product List", result);
      this.spinner.hide();
    })
  }

  getImage(imageName: string) {
    return `${environment.productImageApiUrl}${imageName}`;
  }

  RedirectToProduct(product: any) {
    this.modalService.dismissAll();
    this.router.navigate(['/store/product', product.itemCode]);
  }

  // addToCart(product: any) {    
  //   debugger
  //   // const productModel = Common.addToCart(product);
  //   // console.log("productModel", productModel);
  //   // this.shopService.addToCart(productModel).subscribe(result => {
  //   //   console.log("Result", result);
  //   // });
  //   this.productItems = this.sessionService.getSessionObject('productCartItems');
  //   const items ={
  //     bundle : this.bundle,
  //     selectDelivery : this.selectDelivery,
  //     s0ubs0cri0p01121tionModel: this.subscriptionModel,
  //     quantityModel: this.quantityModel
  //   }
  //   // this.productItems.push(items);
  //   if (this.productItems) {
  //     this.productItem = this.productItems.find(x => x.itemCode == product.itemCode);
  //     if (!this.productItem) {
  //       this.productItems.push(product);
  //       this.sessionService.cartSession(this.productItems);
  //       this.sessionService.setSessionObject('productCartItems', this.productItems);
  //       this.toastrService.success('Product added successfully');
  //     } else {
  //       this.toastrService.error('Product already added into cart');
  //     }
  //   }
  //   else {
  //     this.productCartItems.push(product);
  //     this.sessionService.cartSession(this.productCartItems);
  //     this.sessionService.setSessionObject('productCartItems', this.productCartItems);
  //     this.toastrService.success('Product added successfully');
  //   }
  // }

  addToCart(product: any) {    
    debugger  
    this.productItems = this.sessionService.getSessionObject('productCartItems');  
    const items ={
      bundle : this.bundle,
      selectDelivery : this.selectDelivery,
      subscriptionModel: this.subscriptionModel,
      quantityModel: this.quantityModel
    }
    Object.entries(items).forEach(([key,value]) => { product[key] = value });   
    if (this.productItems) {
      this.productItem = this.productItems.find(x => x.itemCode == product.itemCode);
      if (!this.productItem) {
        this.productItems.push(product);
        //this.productItems.find(x=> x.itemcode == product.itemCode).push(items);
        this.sessionService.cartSession(this.productItems);
        this.sessionService.setSessionObject('productCartItems', this.productItems);
        this.toastrService.success('Product added successfully');
      } else {
        this.toastrService.error('Product already added into cart');
      }
    }
    else {
      Object.entries(items).forEach(([key,value]) => { product[key] = value });
      this.productCartItems.push(product);
      this.sessionService.cartSession(this.productCartItems);
      this.sessionService.setSessionObject('productCartItems', this.productCartItems);
      this.toastrService.success('Product added successfully');
    }
  }

  checkBundle(bundle: string, productPrice:any) {
    debugger
    this.bundle = bundle;
    if (bundle == "multiple") {
      this.bundle = bundle;     
      let subscribePrice= (productPrice/100)*5;
      this.product.price= (productPrice-subscribePrice).toFixed(2);
    } else {
      this.bundle = bundle;
    }
  }

  checkDelivery(delivery: string) {
    debugger
    if (delivery == "subscribe") {
      this.showSubscription = true;
      this.selectDelivery = delivery;
    } else {
      this.showSubscription = false;
      this.selectDelivery = delivery;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/_services';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { param } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '@app/_services/shop.service';

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
  }

  ngOnInit(): void {    
  this.getProductDetail(this.itemCode);  
  }

  toggleShow() {
    this.incredShow = !this.incredShow;
  }

  
  getProductDetail(itemCode){
    this.spinner.show();
    this.shopService.GetProductDetail(itemCode).subscribe(result => {
    this.productDetail=result;
    this.spinner.hide();
    console.log("ProductDetail", this.productDetail);
    });
  }

  addToCart(product: any) {
    debugger
    this.productItems =this.sessionService.getSessionObject('productCartItems');
    if(this.productItems){
      this.productItem=this.productItems.find(x => x.itemCode == product.itemCode);
       if(!this.productItem){
          this.productItems.push(product);
          this.sessionService.cartSession(this.productItems);
          this.sessionService.setSessionObject('productCartItems', this.productItems);
          this.toastrService.success('Product added successfully');         
        }else{
          this.toastrService.error('Product already added into cart');        
         }    
    }    
    else{
      this.productCartItems.push(product);
      this.sessionService.cartSession(this.productCartItems);
      this.sessionService.setSessionObject('productCartItems', this.productCartItems);
      this.toastrService.success('Product added successfully');
    }       
  }
}

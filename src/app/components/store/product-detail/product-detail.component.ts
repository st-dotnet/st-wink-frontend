import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/_services';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { param } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  incredShow: Boolean = false;
  isShowDivIf = false;
  productId: number;
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
     private activatedRoute: ActivatedRoute,
     private spinner: NgxSpinnerService,
     private toastrService: ToastrService,) {
    this.sessionService.scrollToTop();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {

      this.productId = params['id'];
    });
    //console.log(this.productId)
  }

  toggleShow() {
    this.incredShow = !this.incredShow;
  }

  addToCart(product: any) {
    debugger
    this.productCartItems.push(product);
    this.sessionService.cartSession(this.productCartItems);
    this.sessionService.setSessionObject('productCartItems', this.productCartItems);
    this.toastrService.success('Product added successfully');
  }

}

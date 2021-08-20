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
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop',
    windowClass: 'prodview-modal'
  };
  productCartItems: any[] = [];

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal, private shopService: ShopService,
    private spinner: NgxSpinnerService, private router: Router,
    private toastrService: ToastrService,) {
    this.sessionService.scrollToTop();
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
    this.categoryId = Number((e.target as HTMLInputElement)?.value);
    this.GetProductsList(this.categoryId);   
  }

  open(content: any, product: any) {
    this.product = product;
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
  
  addToCart(product: any) {
    debugger
    this.productCartItems.push(product);
    this.sessionService.cartSession(this.productCartItems);
    this.sessionService.setSessionObject('productCartItems', this.productCartItems);
    this.toastrService.success('Product added successfully');
  }
}

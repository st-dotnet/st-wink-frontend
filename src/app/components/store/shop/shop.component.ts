import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { CategoryModel, ShopProductModel } from '@app/_models/shop';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { param } from 'jquery';


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
  //shopProductModel:ShopProductModel;
  product:any;
  categoryId: number = 0;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop',
    windowClass: 'prodview-modal'
  };

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal, private shopService: ShopService
    ,private spinner:NgxSpinnerService,private router:Router ) {
    this.sessionService.scrollToTop();
  }

  ngOnInit(): void {
    this.GetDDLCategoryById();

  }

  GetDDLCategoryById() {
    
    this.shopService.GetCategoryForShopById(this.webCategoryID).subscribe(result => {
      this.categoryModels = result;
      var data = this.categoryModels.filter(x => x.webCategoryDescription.toString() === "All Products");
      this.categoryId = data[0]?.webCategoryID;
      this.GetProductsList(this.categoryId);
      this.spinner.show();
      //console.log(this.categoryId);
    })
  }
  onCategoryChange(e: Event) {
   
    //this.categoryId = 0;
    this.categoryId = Number((e.target as HTMLInputElement)?.value);
    this.GetProductsList(this.categoryId);
    this.spinner.show();
    //console.log(this.categoryId);
  }



  open(content: any,product:any) {
    debugger
    this.product=product;
    //this.router.navigate(['/product', { id: content }]);
   this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.product=product;
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
    this.shopProductModels=[];
    this.shopService.GetProductsList(categoryID).subscribe(result => {
      this.shopProductModels = result;
      this.spinner.hide();
      console.log(this.shopProductModels);
    })
  }

  getImage(imageName: string){
   // console.log(imageName);
    // // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 5000);
    // return `${environment.productImageApiUrl}${imageName}`;

    return `${environment.productImageApiUrl}${imageName}`;
  }

  RedirectToProduct(product:any)
  {
    this.modalService.dismissAll();
     this.router.navigate(['/store/product',product.itemID]);
  }
}

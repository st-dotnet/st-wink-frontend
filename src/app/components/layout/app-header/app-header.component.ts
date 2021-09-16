import { Component, OnInit, NgModule } from '@angular/core';
import { SessionService } from '@app/_services';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CategoryModel,ShopProductModel } from '@app/_models/shop';
import { ShopService } from '@app/_services/shop.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  user: any;
  categoryModels: CategoryModel[] = [];
  shopProductModels: ShopProductModel[] = [];
  windowWidth: number;
  isMobileMenu: boolean = false;
  isSearchbar: boolean = false;
  isDesktopMenu: boolean = false;
  filterOption: string = 'all';
  searchProd: string = '';
  cartItems: any = 0;
  filteredItems = [];
  webCategoryID: number = 3;
  categoryId: number;


  constructor(private sessionService: SessionService,private shopService: ShopService) {
    this.sessionService.user$.subscribe(x => this.user = x);
    this.windowWidth = window.innerWidth;

  }

  ngOnInit(): void {
    this.GetDDLCategoryById();
    this.sessionService.cart$.subscribe(x => this.cartItems = x.length);
    if (this.windowWidth > 992) {
      this.isDesktopMenu = true;
      this.isMobileMenu = false;
    }
  }

  GetDDLCategoryById() {
    //this.spinner.show();
    this.shopService.GetCategoryForShopById(this.webCategoryID).subscribe(result => {
      this.categoryModels = result;
      var data = this.categoryModels.filter(x => x.webCategoryDescription.toString() === "All Products");
      this.categoryId = data[0]?.webCategoryID;
      this.GetProductsList(this.categoryId);
    })
  }

  toggleDisplayDivIf() {
    this.isMobileMenu = !this.isMobileMenu
  }


  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.sessionService.logout();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  GetProductsList(categoryID: number) {
    this.shopProductModels = [];
    this.shopService.GetProductsList(categoryID).subscribe(result => {
      this.shopProductModels = result;
      console.log("Product List", result);
    })
  }

  searchbar() {
    this.isSearchbar = !this.isSearchbar;
  }
  closeSearchbar() {
    this.isSearchbar = !this.isSearchbar;
  }

  updateResults(event: any) {
    debugger
    this.searchProd = (event.target as HTMLInputElement).value;    
    console.log(this.searchProd);
  }


}

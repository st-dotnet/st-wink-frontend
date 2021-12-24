import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { GuidedTour, Orientation } from 'src/lib/guided-tour.constants';
import { GuidedTourService } from 'src/lib/guided-tour.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  isAccountMenus:boolean = false;
  isSearchbarshow : boolean = false;

  public dashboardTour: GuidedTour = {
    tourId: 'purchases-tour',
    useOrb: false,
    steps: [
      {
        title: 'Welcome to the Guided Tour Demo',
        selector: '.start-demo-tour',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
        orientation: Orientation.Bottom

      },
      {
        title: 'Shop',
        selector: '.Shop-demo-tour',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
        orientation: Orientation.Right
      },
      {
        title: 'Blog',
        selector: '.Blog-demo-tour',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
        orientation: Orientation.Right
      },
      {
        title: 'About Us',
        selector: '.About-demo-tour',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
        orientation: Orientation.Right
      },
      {
        title: 'Join',
        selector: '.Join-demo-tour',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
        orientation: Orientation.Right
      },
      // {
      //   title: 'Product',
      //   selector: '.Product-demo-tour-class',
      //   content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
      //   orientation: Orientation.Right

      // },
      {
        title: 'Search',
        selector: '.Search-demo-tour-class',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
        orientation: Orientation.Right
      },
      {
        title: 'Cart Item',
        selector: '.Cart-Item-demo-tour-class',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
        orientation: Orientation.Right
      },
      // {
      //   title: 'LogOut',
      //   selector: '.LogOut-demo-tour-class',
      //   content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
      //   orientation: Orientation.Right
      // },
      {
        title: 'Login',
        selector: '.Login-demo-tour-class',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum itaque eos nulla iste laboriosam nemo tempore omnis quaerat enim illum aut, necessitatibus possimus labore veniam accusantium cum, alias dignissimos voluptate.',
        orientation: Orientation.Right
      }
    ]
  };

  user: any;
  windowWidth: number;
  isMobileMenu: boolean = false;
  isDesktopMenu: boolean = false;
  isSearchshow: boolean = false;
  cartItems: any = 0;
  searchText: any;
  ipAddress = '';
  shopProductModels: any[];
  webCategoryID: number = 3;
  products: any[];
  flag: boolean=false;
  constructor(private sessionService: SessionService, private guidedTourService: GuidedTourService, private http: HttpClient,
    private router: Router,private shopService: ShopService) {
    this.sessionService.user$.subscribe(x => this.user = x);
    this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    // localStorage.setItem("IsVisted","");
    this.ChecktourSession();
    this.sessionService.cart$.subscribe(x => this.cartItems = x.length);
    this.GetProductsList();
    if (this.windowWidth > 992) {
      this.isDesktopMenu = true;
      this.isMobileMenu = false;
    }
  }

  public RestartTour() {
    setTimeout(() => {
      this.guidedTourService.startTour(this.dashboardTour);
    }, 1000);
  }

  ChecktourSession() {
    if (localStorage.getItem("IsVisted")) {

    }
    else {
      //this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      //this.ipAddress=res;
      localStorage.setItem("IsVisted", "visit");
      this.RestartTour();
      //});
    }
  }

  toggleDisplayDivIf() {
    this.isMobileMenu = !this.isMobileMenu;
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
        this.user = this.sessionService.removeSessionItem("user");
        this.sessionService.removeSessionItem("promoCode");
        this.sessionService.cartSession(0);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  searchProduct() {
    this.router.navigate(["/store/search-products"]);
  }
  onselectProduct(productobj) {     
    if (productobj.itemCode != 0) {  
      this.router.navigate(['/store/product', productobj.itemCode]).then(() => { 
        this.flag = true; 
        window.location.reload();});
    }  
    else {  
      return false;  
    }  
  }  
  
  getSearchProduct() {
    if(this.searchText=='' ){
      this.flag = false;
    }
    if(this.searchText.length >2){
      this.flag = true; 
      this.products= this.shopProductModels.filter(option => option.itemCode.toLowerCase().includes(this.searchText) ||option.itemDescription.toLowerCase().includes(this.searchText) );    
    }
    else{
      return;
    }
    }
  GetProductsList() {
    this.shopProductModels = [];
    this.shopService.GetProductsList(this.webCategoryID, 0).subscribe(result => {
      this.shopProductModels = result;
   
    })
  }
  showSearchbar() {
    this.isSearchshow = true;
  }

  closeSearchbar() {
    this.isSearchshow = false;
  }

  show_submenus()
  {
    this.isAccountMenus = !this.isAccountMenus;
  }

  searchProducts()
  {
    this.isSearchbarshow = true;
  }

  closebarSearch()
  {
    this.isSearchbarshow = false;
  }

}
function categoryId(categoryId: any, arg1: number) {
  throw new Error('Function not implemented.');
}


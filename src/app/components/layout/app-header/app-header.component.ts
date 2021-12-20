import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@app/_services';
import { GuidedTour, Orientation } from 'src/lib/guided-tour.constants';
import { GuidedTourService } from 'src/lib/guided-tour.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

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

  constructor(private sessionService: SessionService, private guidedTourService: GuidedTourService, private http: HttpClient,
    private router: Router) {
    this.sessionService.user$.subscribe(x => this.user = x);
    this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    // localStorage.setItem("IsVisted","");
    this.ChecktourSession();
    this.sessionService.cart$.subscribe(x => this.cartItems = x.length);
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
        this.user = this.sessionService.removeSessionItem("promoCode");
        this.sessionService.cartSession(0)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  searchProduct() {
    //this.sessionService.setSessionItem("searchItem", this.searchText);
    this.router.navigate(["/store/search-products"]);
  }

  showSearchbar() {
    this.isSearchshow = true;
  }

  closeSearchbar() {
    this.isSearchshow = false;
  }

}

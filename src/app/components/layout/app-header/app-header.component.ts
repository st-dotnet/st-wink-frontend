import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/_services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  user: any;
  windowWidth: number;
  isMobileMenu: boolean = false;
  isDesktopMenu: boolean = false;
  cartItems: any = 0;
  constructor(private sessionService: SessionService) {
    this.sessionService.user$.subscribe(x => this.user = x);
    this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {    
    this.sessionService.cart$.subscribe(x => this.cartItems = x.length);
    if (this.windowWidth > 992) {
      this.isDesktopMenu = true;
      this.isMobileMenu = false;
    }
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
}

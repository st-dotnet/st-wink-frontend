import { Component, OnInit } from '@angular/core';
import { ContactService, SessionService } from '@app/_services';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Review:any[]=[];
  loading = false;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 2000,
    autoplay: true,
    autoplayTimeout: 3000,
    // animateIn: true,
    // animateOut: true,
    nav: false,
    // navText: [ '<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>' ],
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
  }

  bestsellers: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
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
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  home_testimonials: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<div class="arrow-left"></div>', '<div class="arrow-right"></div>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  constructor(private sessionService: SessionService, private spinner: NgxSpinnerService, private toastrService: ToastrService,private contactService: ContactService,) {

    this.sessionService.scrollToTop();
  }

  ngOnInit(): void {
    this.getAllreviews();
  }

  score(i:any) {
    return new Array(i);
   }

  getAllreviews() {
    this.spinner.show();
    this.loading = true;
     this.contactService.getReviews()
       .pipe(first())
       .subscribe({
         next: (response: any) => {
           this.Review = response;
           this.spinner.hide();
           this.loading = false;
          // console.log(this.Review);
         },
         error: error => {
          this.spinner.hide();
          this.toastrService.error();
          this.loading = false;
         }
       });
  }
}


import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title : string = 'wink-naturals';
  constructor(private titleService: Title,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.titleService.setTitle('Wink Naturals');
  }

  ngOnInit() {
    // /** spinner starts on init */
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 1000);

    // this.toastr.success('Hello world!', 'Toastr fun!');
  }

}

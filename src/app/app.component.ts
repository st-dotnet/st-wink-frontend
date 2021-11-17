import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgxFreshChatService } from 'ngx-freshchat';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title : string = 'wink-naturals';
  constructor(private titleService: Title,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,private chat: NgxFreshChatService) {
    this.titleService.setTitle('Wink Naturals');
  }

  ngOnInit() {
    this.chat.init({
      token: 'bb6c4ee2-a24d-4a13-b46a-8655f4b998ec',
      host: 'https://wchat.freshchat.com'
  })
  .subscribe(
      () => console.log('FreshChat is ready!')
  );
    // /** spinner starts on init */
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 1000);

    // this.toastr.success('Hello world!', 'Toastr fun!');
  }

}

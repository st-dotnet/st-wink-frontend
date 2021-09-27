import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SessionService } from '@app/_services';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './app-notification-bar.component.html',
  styleUrls: ['./app-notification-bar.component.css']
})
export class AppNotificationBarComponent implements OnInit {

  isNotif :boolean = true;
  @Output() myOutput:EventEmitter<boolean>= new EventEmitter();  
  constructor() { }

  ngOnInit(): void {
  }

  closeSearchbar()
  {
    this.isNotif = false;
    this.myOutput.emit(this.isNotif);     
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { SessionService } from '@app/_services';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  toggleDisplayDivIf: boolean = true;
  @Input() myinputMsg:boolean;

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {

    //this.toggleDisplayDivIf = this.sessionService.getSessionItem("notification");
  }

  GetChildData(value){

    this.toggleDisplayDivIf=value;

  }

}

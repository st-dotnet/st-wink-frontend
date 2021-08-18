import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/_services';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.css']
})
export class AppFooterComponent implements OnInit {
  user: any;

  constructor(private sessionService: SessionService) {
    this.sessionService.user$.subscribe(x => this.user = x);
  }


  ngOnInit(): void {
  }

}

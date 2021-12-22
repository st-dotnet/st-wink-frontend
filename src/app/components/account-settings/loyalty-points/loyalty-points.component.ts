import { Component, OnInit } from '@angular/core';
import { AccountService, SessionService } from '@app/_services';
import { ShopService } from '@app/_services/shop.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loyalty-points',
  templateUrl: './loyalty-points.component.html',
  styleUrls: ['./loyalty-points.component.css']
})
export class LoyaltyPointsComponent implements OnInit {
  currentuser:any;
  loyalityData:any;
  total:number=0;;
  constructor(private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private shopService: ShopService,
    private sessionService: SessionService) { }

  ngOnInit(): void {
    //this.currentuser = this.sessionService.getSessionObject("user");
    this.getLoyalityPoints();
  }

  getLoyalityPoints(){
    this.spinner.show();
    this.accountService.getLoyalityPoints().subscribe((response)=>{
      this.loyalityData=response;
      this.loyalityData?.forEach(element => {
        this.total+= parseFloat(element.amount);
      });
      this.spinner.hide();
    });
  }

}

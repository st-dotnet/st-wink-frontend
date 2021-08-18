import { Component, OnInit } from '@angular/core';
import { enrollmentpacksModel } from '@app/_models/enrollmentpacks';
import { SessionService } from '@app/_services';
import {EnrollmentService} from '@app/_services/enrollment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-enrollment-packs',
  templateUrl: './enrollment-packs.component.html',
  styleUrls: ['./enrollment-packs.component.css']
})
export class EnrollmentPacksComponent implements OnInit {

  EnrollmentPacksData:enrollmentpacksModel[];
  
  constructor(private sessionService: SessionService,private enrollmentService:EnrollmentService,
    private spinner: NgxSpinnerService,
    private domSanitizer: DomSanitizer) {
    this.sessionService.scrollToTop();
  }

  ngOnInit(): void {
    this.getPacks();
  }

  getPacks()
  {
     this.spinner.show();
    this.enrollmentService.GetAllPacks()
    .subscribe(response => {
      //this.toastrService.success('Contact information saved successfully');
      this.EnrollmentPacksData=response ;
      this.spinner.hide();
     
      //this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${image}`);
      console.log(this.EnrollmentPacksData)
    }, error => {
      //this.spinner.hide();
      console.warn(error.responseText);
      //this.toastrService.error(error);
      console.log({ error })
    });
  }

}

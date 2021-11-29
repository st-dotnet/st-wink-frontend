import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

// home routing module
import { HomeRoutingModule } from './home-routing.module';

// home components
import { HomeComponent } from './home.component';
import { AboutComponent } from './about/about.component';
import { EnrollmentPacksComponent } from './enrollment/enrollment-packs/enrollment-packs.component';
import { EnrollmentComponent } from './enrollment/enrollment-info/enrollment-info.component';
import { EnrollmentInfoComponent } from './enrollment/enrollmentinfo/enrollmentinfo.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    EnrollmentPacksComponent,
    EnrollmentComponent,
    EnrollmentInfoComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }

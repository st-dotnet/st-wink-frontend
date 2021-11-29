import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

// home routing module
import { HomeRoutingModule } from './home-routing.module';

// home components
import { HomeComponent } from './home.component';
import { AboutComponent } from './about/about.component';
import { EnrollmentPacksComponent } from './enrollment/enrollment-packs/enrollment-packs.component';
import { EnrollmentinfoComponent } from './enrollment/enrollmentinfo/enrollmentinfo.component';
import { EnrollmentComponent } from './enrollment/enrollment-info/enrollment-info.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    EnrollmentPacksComponent,
    EnrollmentComponent,
    EnrollmentinfoComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }

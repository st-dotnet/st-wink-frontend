import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// home components
import { AboutComponent } from './about/about.component';
import { EnrollmentComponent } from './enrollment/enrollment-info/enrollment-info.component';
import { EnrollmentPacksComponent } from './enrollment/enrollment-packs/enrollment-packs.component';
import { EnrollmentinfoComponent } from './enrollment/enrollmentinfo/enrollmentinfo.component';
import { HomeComponent } from './home.component';

// home routes
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'enrollment', component: EnrollmentComponent },
  { path: 'enrollment/enrollment-packs', component: EnrollmentPacksComponent },
  { path: 'enrollment/enrolleeinfo', component: EnrollmentinfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// home components
import { AboutComponent } from './about/about.component';
import { EnrollmentInfoComponent } from './enrollment/enrollment-info/enrollment-info.component';
import { EnrollmentPacksComponent } from './enrollment/enrollment-packs/enrollment-packs.component';
import { HomeComponent } from './home.component';

// home routes
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'enrollment', component: EnrollmentInfoComponent },
  { path: 'enrollment/enrollment-packs', component: EnrollmentPacksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

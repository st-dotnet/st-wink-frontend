// app required modules
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxFreshChatModule} from  'ngx-freshchat';
// app routing module
import { AppRoutingModule } from './app-routing.module';

// app components
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/layout/app-header/app-header.component';
import { AppFooterComponent } from './components/layout/app-footer/app-footer.component';
import { AppNotificationBarComponent } from './components/layout/app-notification-bar/app-notification-bar.component';
import { AppLayoutComponent } from './components/layout/app-layout/app-layout.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { GuidedTourModule } from 'src/lib/guided-tour.module';



@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    AppNotificationBarComponent,
    AppLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    NgxFreshChatModule,
    GuidedTourModule.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

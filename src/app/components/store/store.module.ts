import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

// store routing module
import { StoreRoutingModule } from './store-routing.module';

// store components
import { ShopComponent } from './shop/shop.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { SearchproductComponent } from './search_product/searchproduct/searchproduct.component';
import { NgYotpoModule } from '@ng-ecom-kit/ng-yotpo';


@NgModule({
  declarations: [
    ShopComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    ThankYouComponent,
    SearchproductComponent,
  ],
  imports: [
    NgYotpoModule.forRoot({apiKey: 'jV57gp4RKXABm7N2zd94UnPq6pgfRerQyaeq3iQk'}),
    SharedModule,
    StoreRoutingModule,

  ]
})
export class StoreModule { }

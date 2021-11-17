import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CategoryModel, ShopProductModel } from '@app/_models/shop';
import { TransactionalRequestModel } from '@app/_models/checkout';
import { Payment } from '@app/_models/payment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private readonly shopEndpoint = 'shopping/';
  private readonly paymentEndpoint = 'payment/';
  constructor(private http: HttpClient) {}

  GetCategoryForShopById(webCategoryID: any) {
    return this.http.get<CategoryModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetItemCategory/${webCategoryID}`);
  }

  GetProductsList(categoryId: number, filterValue: number) {
    return this.http.get<ShopProductModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetProductList/${categoryId}/${filterValue}`);
  }

  GetProductDetail(itemCode: number) {
    return this.http.get<ShopProductModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetProductDetailById/${itemCode}`);
  }

  addToCart(Product: any) {
    return this.http.get<ShopProductModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetProductDetailById/${Product}`);
  }

  checkOutItems(transactionalRequestModel: any) {
    debugger
    return this.http.post<TransactionalRequestModel[]>(`${environment.apiUrl}${this.shopEndpoint}SubmitCheckout`,transactionalRequestModel);
  }

  searchProduct(query: string) {
    return this.http.get<any>(`${environment.apiUrl}${this.shopEndpoint}SearchProducts/${query}`);
  }

  getPromoData(promoCode: string) {
    return this.http.get<any>(`${environment.apiUrl}${this.shopEndpoint}PromoCode/${promoCode}`);
  }

  getSpecialItem() {
    return this.http.get<any>(`${environment.apiUrl}${this.shopEndpoint}GetSpecialItem`);
  }

  postAddress(customerId: number, addressParam: any) {
    return this.http.post<any>(`${environment.apiUrl}${this.shopEndpoint}AddUpdateCustomerAddress/${customerId}`, addressParam);
  }

  getAddressById(customerId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}${this.shopEndpoint}GetshippingAddress/${customerId}`);
  }

  addPayment(payment: any) {
    return this.http.post<Payment>(`${environment.apiUrl}${this.paymentEndpoint}CreatePaymentUsingAuthorizeNet`, payment);
  }

  getClientToken()
  {
    return this.http.get<any>(`${environment.apiUrl}${this.paymentEndpoint}GetClientToken`);
  }
}

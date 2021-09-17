import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CategoryModel, ShopProductModel } from '@app/_models/shop';


@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private readonly shopEndpoint = 'shopping/';
  constructor(private http: HttpClient) { }

  GetCategoryForShopById(webCategoryID: any) {
    return this.http.get<CategoryModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetItemCategory/${webCategoryID}`);
  }
  GetProductsList(categoryId:number,filterValue:number) {
    debugger;
    return this.http.get<ShopProductModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetProductList/${categoryId}/${filterValue}`);
  }
  GetProductDetail(itemCode: number) {
    debugger
    return this.http.get<ShopProductModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetProductDetailById/${itemCode}`);
  }
  addToCart(Product: any) {
    debugger
    return this.http.get<ShopProductModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetProductDetailById/${Product}`);
  }

  checkOutItems(transactionalRequestModel: any) {
    debugger
    return this.http.post<ShopProductModel[]>(`${environment.apiUrl}${this.shopEndpoint}SubmitCheckout`, transactionalRequestModel);
  }

  filterProduct(filterValue: any,categoryId:any) {
    return this.http.get<CategoryModel[]>(`${environment.apiUrl}${this.shopEndpoint}GetItemCategory/${filterValue}${categoryId}`);
  }
}

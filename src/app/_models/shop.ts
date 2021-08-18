import { DecimalPipe } from "@angular/common";

export class CategoryModel
{
    nestedLevel!:number;
    parentID!:number;
    sortOrder!:number;
    webCategoryDescription!:string;
    webCategoryID!:number;
}

export class ShopProductModel
{
    itemID!:number;
    itemCode !:string;
     itemDescription !:string;
     weight !:number;
     itemTypeID !:number;

     tinyImageUrl !:string;
     smallImageUrl !:string;
     largeImageUrl !:string;

     shortDetail1 !:string;
     shortDetail2 !:string;
     shortDetail3 !:string;
     shortDetail4 !:string;
     longDetail1 !:string;
     longDetail2 !:string;
     longDetail3 !:string;
     longDetail4 !:string;

     isVirtual!:boolean;
     allowOnAutoOrder !:boolean;

     isGroupMaster !:boolean;
     groupMasterItemDescription !:string;
     groupMembersDescription !:string;
   // public IEnumerable<ItemGroupMember> GroupMembers 

     isDynamicKitMaster !:boolean;
     dynamicKitCategories !:any[];
     staticKitChildren !:any[];

     priceTypeID !:number;
     currencyCode !:string;
     price !:number;
     bV !:number;
     cV !:number;
     priceEachOverride!:number; 
     taxableEachOverride !:number;
     commissionableVolumeEachOverride !:number;
     businessVolumeEachOverride !:number;
     shippingPriceEachOverride !:number;
     otherPrice1 !:number;
     otherPrice2 !:number;
     otherPrice3 !:number;
     otherPrice4 !:number;
     otherPrice5 !:number;
     otherPrice6 !:number;
     otherPrice7 !:number;
     otherPrice8 !:number;
     otherPrice9 !:number;
     otherPrice10 !:number;

     field1 !:string;
     field2 !:string;
     field3 !:string;
     field4 !:string;
     field5 !:string;
     field6 !:string;
     field7 !:string;
     field8 !:string;
     field9 !:string;
     field10 !:string;

     otherCheck1 !:boolean;
     otherCheck2 !:boolean;
     otherCheck3 !:boolean;
     otherCheck4 !:boolean;
     otherCheck5 !:boolean;

     sortOrder !:number;
    productImage !:ProductImage;

    // IShoppingCartItem Members
     iD !:number;
     quantity !:number;
     parentItemCode !:string;
     groupMasterItemCode !:string;
     dynamicKitCategory !:string;
     type :any;

     categoryID !:number;
     totalItems !:number;

     inventoryFlag !:number;
     inventoryFlagDesc 
    itemInventory!:string;
     image_01!:string;
     image_02!:string;
     image_03!:string;
   
}

export class ProductImage
{
    contentType!:string;
    enableRangeProcessing!:boolean;
    entityTag!:number;
    fileContents!:string;
    fileDownloadName!:string;
    lastModified!:string;
}
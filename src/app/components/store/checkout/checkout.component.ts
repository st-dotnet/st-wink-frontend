import { Component, OnInit } from '@angular/core';
import { ChargeCreditCardTokenRequest, CreateAutoOrderRequest, CreateCustomerRequest, CreateOrderRequest, SetAccountCreditCardTokenRequest, TransactionalRequestModel } from '@app/_models/checkout';
import { ShopService } from '@app/_services/shop.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  addrnew = false;

  sidebartoggle: boolean = true;

  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop'
  };

  // isSecondPanelDisable=false;
  // isThirdPanelDisable=false;
  // isActive=false;

  constructor(private modalService: NgbModal,
    private shopService : ShopService) { }

  ngOnInit(): void {
    this.sidebartoggle = true;
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  toggleShow() {
    this.sidebartoggle = !this.sidebartoggle;
    console.log(this.sidebartoggle);
  }

  // changeTitle($event: NgbPanelChangeEvent, acc) {

  //   if (!acc.isExpanded($event.panelId)) {
  //     this.isActive = true;
  //   } else {
  //     this.isActive = false;
  //   }
  //   alert(this.isActive);
  // }



  // Referrer records below

  filterTerm: string;
  isDataAvailable = false;
  toShowData = false;
  refId: any;
  refName: any;

  referrerRecords = [
    {
      "id": 1,
      "referrer_name": "Amanda Rich",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 2,
      "referrer_name": "Amanda Walsh",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 3,
      "referrer_name": "John Carter",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 4,
      "referrer_name": "Mark Brown",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 5,
      "referrer_name": "Eliot Marshall",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 6,
      "referrer_name": "Amanda Boyce",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 7,
      "referrer_name": "James George",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
    {
      "id": 8,
      "referrer_name": "Casper Max",
      "wink_link": "purecures",
      "referrer_location": "Henderson, NV",
      "referrer_image": "../../assets/user_referrer.jpg"
    },
  ]

  selectedData = this.referrerRecords;
  filterItem(val) {
    debugger;
    //value not empty
    if (val !== "") {
      debugger;
      //Data filter method
      this.selectedData = this.referrerRecords.filter(x => (x.referrer_name.includes(val) || x.referrer_name.includes(val.toUpperCase()) || x.referrer_name.includes(val.toLowerCase())) || x.id == parseInt(val));
      if (this.selectedData.length == 0) {        
        debugger;
        this.isDataAvailable = false;
      }
    }
    else {
      this.selectedData = this.referrerRecords;
      debugger;
      this.isDataAvailable = true;
      debugger;
    }
  }

  choose_referrer(data: any) {
    debugger;
    if (this.referrerRecords.filter(x => x.id == parseInt(data.id)).length > 0) {
      debugger;
      this.refId = data.id;
      debugger;
      this.refName = this.referrerRecords.filter(x => x.id == parseInt(data.id)).map(ele => ele.referrer_name);
      debugger;
      this.toShowData = true;
    }
    else {
      this.toShowData = false;
    }
  }

  differentAddress() {
    this.addrnew = true;
  }

  sameshippingAddress() {
    this.addrnew = false;
  }

  OnCheckOut(){
    debugger
    const createOrderRequest = new CreateOrderRequest();
    createOrderRequest.other14='';
    createOrderRequest.other15='';
    createOrderRequest.other16='';
    createOrderRequest.other17='';
    createOrderRequest.other18='';
    createOrderRequest.other19='';
    createOrderRequest.other20='';
    createOrderRequest.other13='';
    createOrderRequest.taxRateOverride=0;
    createOrderRequest.shippingAmountOverride=0;
    createOrderRequest.transferVolumeToID=0;
    createOrderRequest.returnOrderID=0;
    createOrderRequest.overwriteExistingOrder=false;
    createOrderRequest.existingOrderID=0;
    createOrderRequest.partyID=1;
    createOrderRequest.details=[];
    createOrderRequest.suppressPackSlipPrice=true;
    createOrderRequest.transferVolumeToKey='';
    createOrderRequest.returnOrderKey='';
    createOrderRequest.manualOrderKey='';
    createOrderRequest.manualOrderID=0;
    createOrderRequest.existingOrderKey='';
    createOrderRequest.other12='';
    createOrderRequest.notes='';
    createOrderRequest.customerID=0;
    createOrderRequest.orderStatus=1;
    createOrderRequest.orderDate="2021-09-01T09:28:10.207Z";
    createOrderRequest.currencyCode='';
    createOrderRequest.warehouseID=0;
    createOrderRequest.shipMethodID=0;
    createOrderRequest.priceType=0;
    createOrderRequest.firstName='';
    createOrderRequest.middleName='';
    createOrderRequest.lastName='';
    createOrderRequest.other11='';
    createOrderRequest.nameSuffix='';
    createOrderRequest.address1='';
    createOrderRequest.address2='';
    createOrderRequest.address3='';
    createOrderRequest.city='';
    createOrderRequest.state='';
    createOrderRequest.zip='';
    createOrderRequest.country='';
    createOrderRequest.county='';
    createOrderRequest.email='';
    createOrderRequest.phone='';
    createOrderRequest.company='';
    createOrderRequest.customerKey='';

    const createCustomerRequest = new CreateCustomerRequest();
    createCustomerRequest.subscribeFromIPAddress='';
    createCustomerRequest.subscribeToBroadcasts=false;
    createCustomerRequest.field15='';
    createCustomerRequest.field14='';
    createCustomerRequest.field13='';
    createCustomerRequest.field12='';
    createCustomerRequest.field11='';
    createCustomerRequest.field10='';
    createCustomerRequest.field9='';
    createCustomerRequest.field8='';
    createCustomerRequest.field7='';
    createCustomerRequest.field6='';
    createCustomerRequest.field5='';
    createCustomerRequest.field4='';
    createCustomerRequest.field3='';
    createCustomerRequest.field2='';
    createCustomerRequest.field1='';
    createCustomerRequest.birthDate="2021-09-01T09:28:10.207Z"
    createCustomerRequest.isSalesTaxExempt=false;
    createCustomerRequest.currencyCode='';
    createCustomerRequest.salesTaxExemptExpireDate='';
    createCustomerRequest.payableToName='';
    createCustomerRequest.defaultWarehouseID=0;
    createCustomerRequest.sponsorKey='';
    createCustomerRequest.otherAddressVerified=true;
    createCustomerRequest.mailAddressVerified=true;
    createCustomerRequest.mainAddressVerified=true;
    createCustomerRequest.useBinaryHoldingTank=true;
    createCustomerRequest.binaryPlacementPreference=0;
    createCustomerRequest.nameSuffix='';
    createCustomerRequest.middleName='';
    createCustomerRequest.date5='';
    createCustomerRequest.date4='';
    createCustomerRequest.date3='';
    createCustomerRequest.date2='';
    createCustomerRequest.date1='';
    createCustomerRequest.taxIDType='';
    createCustomerRequest.checkThreshold=0;
    createCustomerRequest.languageID=0;
    createCustomerRequest.payableType='';
    createCustomerRequest.entryDate="2021-09-01T09:28:10.207Z";
    createCustomerRequest.salesTaxID='';
    createCustomerRequest.taxID='';
    createCustomerRequest.manualCustomerID=0;
    createCustomerRequest.mainCounty='';
    createCustomerRequest.mainCountry='';
    createCustomerRequest.mainZip='';
    createCustomerRequest.mainState='';
    createCustomerRequest.mainCity='';
    createCustomerRequest.mainAddress3='';
    createCustomerRequest.mainAddress2='';
    createCustomerRequest.mainAddress1='';
    createCustomerRequest.notes='';
    createCustomerRequest.fax='';
    createCustomerRequest.mobilePhone='';
    createCustomerRequest.phone2='';
    createCustomerRequest.phone='';
    createCustomerRequest.email='';
    createCustomerRequest.customerStatus=0;
    createCustomerRequest.customerType=0;
    createCustomerRequest.company='';
    createCustomerRequest.lastName='';
    createCustomerRequest.firstName='';
    createCustomerRequest.mailAddress1='';
    createCustomerRequest.mailAddress2='';
    createCustomerRequest.mailAddress3='';
    createCustomerRequest.mailCity='';
    createCustomerRequest.useManualCustomerID=false;
    createCustomerRequest.sponsorID=0;
    createCustomerRequest.insertUnilevelTree=false;
    createCustomerRequest.enrollerID=0;
    createCustomerRequest.insertEnrollerTree=true;
    createCustomerRequest.loginPassword='';
    createCustomerRequest.loginName='';
    createCustomerRequest.canLogin=true; 
    createCustomerRequest.otherCounty='';
    createCustomerRequest.enrollerKey='';
     createCustomerRequest.otherCountry='';
    createCustomerRequest.otherState='';
    createCustomerRequest.otherCity='';
    createCustomerRequest.otherAddress3='';
    createCustomerRequest.otherAddress2=''; 
    createCustomerRequest.otherAddress1='';
    createCustomerRequest.mailCounty='';
    createCustomerRequest.mailCountry='';
    createCustomerRequest.mailZip='';
    createCustomerRequest.mailState='';
    createCustomerRequest.otherZip='';
    createCustomerRequest.manualCustomerKey='';

    const chargeCreditCardTokenRequest = new ChargeCreditCardTokenRequest();
    chargeCreditCardTokenRequest.otherData9='';
    chargeCreditCardTokenRequest.otherData8='';
    chargeCreditCardTokenRequest.otherData7='';
    chargeCreditCardTokenRequest.otherData6='';
    chargeCreditCardTokenRequest.otherData5='';
    chargeCreditCardTokenRequest.otherData4='';
    chargeCreditCardTokenRequest.otherData3='';
    chargeCreditCardTokenRequest.otherData2='';
    chargeCreditCardTokenRequest.otherData1='';
    chargeCreditCardTokenRequest.clientIPAddress='';
    chargeCreditCardTokenRequest.merchantWarehouseIDOverride=0;
    chargeCreditCardTokenRequest.maxAmount=0;
    chargeCreditCardTokenRequest.otherData10='';
    chargeCreditCardTokenRequest.expirationMonth=0;
    chargeCreditCardTokenRequest.creditCardType=0;
    chargeCreditCardTokenRequest.cvcCode='';
    chargeCreditCardTokenRequest.billingCountry='';
    chargeCreditCardTokenRequest.billingZip='';
    chargeCreditCardTokenRequest.billingState='';
    chargeCreditCardTokenRequest.billingCity='';
    chargeCreditCardTokenRequest.billingAddress2='';
    chargeCreditCardTokenRequest.billingAddress='';
    chargeCreditCardTokenRequest.creditCardToken='';
    chargeCreditCardTokenRequest.expirationYear=0;
    chargeCreditCardTokenRequest.orderKey='';

   const createAutoOrderRequest= new CreateAutoOrderRequest();
   createAutoOrderRequest.county='';
   createAutoOrderRequest.email='';
   createAutoOrderRequest.phone='';
   createAutoOrderRequest.notes='';
   createAutoOrderRequest.other11='';
   createAutoOrderRequest.other12='';
   createAutoOrderRequest.other13='';
   createAutoOrderRequest.other14='';
   createAutoOrderRequest.other15='';
   createAutoOrderRequest.other16='';
   createAutoOrderRequest.other17='';
   createAutoOrderRequest.other18='';
   createAutoOrderRequest.other19='';
   createAutoOrderRequest.other20='';
   createAutoOrderRequest.country='';
   createAutoOrderRequest.description='';
   createAutoOrderRequest.overwriteExistingAutoOrder=true;
   createAutoOrderRequest.existingAutoOrderID=0;
   createAutoOrderRequest.details=[];
   createAutoOrderRequest.other16='';
   createAutoOrderRequest.frequency=1;
   createAutoOrderRequest.startDate="2021-09-01T09:28:10.207Z";
   createAutoOrderRequest.stopDate='';
   createAutoOrderRequest.specificDayInterval=0;
   createAutoOrderRequest.currencyCode='';
   createAutoOrderRequest.warehouseID=0;
   createAutoOrderRequest.shipMethodID=0;
   createAutoOrderRequest.priceType=0;
   createAutoOrderRequest.processType='';
   createAutoOrderRequest.firstName='';
   createAutoOrderRequest.middleName='';
   createAutoOrderRequest.lastName='';
   createAutoOrderRequest.nameSuffix='';
   createAutoOrderRequest.company='';
   createAutoOrderRequest.address1='';
   createAutoOrderRequest.address2='';
   createAutoOrderRequest.address3='';
   createAutoOrderRequest.customerKey='';
   createAutoOrderRequest.customFrequencyTy=0;


   const setAccountCreditCardTokenRequest = new SetAccountCreditCardTokenRequest();
   setAccountCreditCardTokenRequest.tokenType=0;
   setAccountCreditCardTokenRequest.movePrimaryToSecondary=true;
   setAccountCreditCardTokenRequest.hideFromWeb=true;
   setAccountCreditCardTokenRequest.billingCountry='';
   setAccountCreditCardTokenRequest.billingZip='';
   setAccountCreditCardTokenRequest.billingState='';
   setAccountCreditCardTokenRequest.billingCity='';
   setAccountCreditCardTokenRequest.firstSix=''; 
   setAccountCreditCardTokenRequest.billingAddress2='';
   setAccountCreditCardTokenRequest.useMainAddress=true;
   setAccountCreditCardTokenRequest.billingName='';
   setAccountCreditCardTokenRequest.creditCardType=0;
   setAccountCreditCardTokenRequest.expirationYear=0;
   setAccountCreditCardTokenRequest.expirationMonth=0;
   setAccountCreditCardTokenRequest.creditCardToken='';
   setAccountCreditCardTokenRequest.creditCardAccountType=1;
   setAccountCreditCardTokenRequest.customerID=0;
   setAccountCreditCardTokenRequest.billingAddress='';
   setAccountCreditCardTokenRequest.lastFour='';


   const transactionalRequestModel = new TransactionalRequestModel();
   transactionalRequestModel.createOrderRequest = createOrderRequest;
   transactionalRequestModel.createCustomerRequest = createCustomerRequest;
   transactionalRequestModel.chargeCreditCardTokenRequest = chargeCreditCardTokenRequest;
   transactionalRequestModel.createAutoOrderRequest = createAutoOrderRequest;
   transactionalRequestModel.setAccountCreditCardTokenRequest = setAccountCreditCardTokenRequest;    
   
   this.shopService.checkOutItems(transactionalRequestModel).subscribe(
    (result: any) => {
      console.log("Result", result);

    });
  }
}

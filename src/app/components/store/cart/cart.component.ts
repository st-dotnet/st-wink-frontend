import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@app/_services';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  subscriptionPurchase = false;
  inputdata: string;
  promocode_onetime: string;
  data_learn: boolean = false;
  closeResult: string;
  cartItems: any[] = [];
  maxDate = new Date();
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop'
  };
  cart: any[];
  subtotalOneTimePrice: any = 0;
  subtotalSubscriptionTimePrice: any = 0;
  total = false;
  selectDelivery: any[];
  quantity: { id: string; name: string; value: string; }[];
  years: { id: string; name: string; value: string; }[];
  onTextChange(value) {
  }
  quantityModel:any;
  subscriptionModel:any;

  constructor(private modalService: NgbModal,
    private sessionService: SessionService,
    private spinner: NgxSpinnerService,
    private router: Router) {
    this.sessionService.scrollToTop();
    this.maxDate.setDate(this.maxDate.getDate() - 1);

    this.quantity = [
      {
        id: '1',
        name: 'Qty 1',
        value: 'Qty1'
      },
      {
        id: '2',
        name: 'Qty 2',
        value: 'Qty2'
      },
      {
        id: '3',
        name: 'Qty 3',
        value: 'Qty3'
      },
      {
        id: '4',
        name: 'Qty 4',
        value: 'Qty4'
      }
    ]
    this.years = [
      {
        id: '1',
        name: 'Every Month',
        value: 'everyMonth'
      },
      {
        id: '2',
        name: 'Every Week',
        value: 'everyWeek'
      },
      {
        id: '3',
        name: 'Every Year',
        value: 'everyYear'
      }
    ]
  }
  

  ngOnInit(): void {
    debugger
    this.cartItems = this.sessionService.getSessionObject('productCartItems');
    console.log(' All Cart Items', this.cartItems);
    this.selectDelivery=this.cartItems.filter(x=>x.selectDelivery == 'subscribe');
    this.cartItems=this.cartItems.filter(x=>x.selectDelivery != 'subscribe');
    console.log('CartItems', this.cartItems);
    console.log('selectDelivery', this.selectDelivery);
    if (this.total == true) {
      this.subtotalOneTimePrice = 0
      this.subtotalSubscriptionTimePrice=0;
    }
    this.cartItems.forEach(element => { 
      this.subtotalOneTimePrice += element.price;   
    });
    if(typeof this.subtotalOneTimePrice === 'string'){
      this.subtotalOneTimePrice =parseInt(this.subtotalOneTimePrice);
      this.subtotalOneTimePrice = this.subtotalOneTimePrice.toFixed(2);
    }else{
      this.subtotalOneTimePrice = this.subtotalOneTimePrice.toFixed(2);
    }   
    this.selectDelivery.forEach(element => { 
      this.subtotalSubscriptionTimePrice += element.price;   
    });
    if(typeof this.subtotalSubscriptionTimePrice === 'string'){
      this.subtotalSubscriptionTimePrice =parseInt(this.subtotalSubscriptionTimePrice);
      this.subtotalSubscriptionTimePrice = this.subtotalSubscriptionTimePrice.toFixed(2);
    }else{
      this.subtotalSubscriptionTimePrice = this.subtotalSubscriptionTimePrice.toFixed(2);
    }   
  
    this.filterItem("");
    
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  learn_show() {
    this.data_learn = !this.data_learn;
    console.log(this.data_learn);
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
    //value not empty
    if (val !== "") {
      //Data filter method
      this.selectedData = this.referrerRecords.filter(x => (x.referrer_name.includes(val) || x.referrer_name.includes(val.toUpperCase()) || x.referrer_name.includes(val.toLowerCase())) || x.id == parseInt(val));
      if (this.selectedData.length == 0) {
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
      this.toShowData = true;
    }
    else {
      this.toShowData = false;
    }
  }

  removeItem(cartItem: any) {
    debugger     
    this.total = true;
    this.spinner.show();    
    this.cart = this.cartItems.filter(x => x.itemCode != cartItem.itemCode); 
    this.selectDelivery.push(this.cart); 
    this.sessionService.setSessionObject('productCartItems', this.selectDelivery  );
    this.spinner.hide();
    this.ngOnInit();
  }

  removeItemSubscription(subscriptionItem:any){
    debugger
    this.total = true;
    this.spinner.show();    
    this.cart= this.selectDelivery.filter(x => x.itemCode != subscriptionItem.itemCode);
    this.cartItems.push(this.cart);     
    this.sessionService.setSessionObject('productCartItems', this.cartItems);
    this.spinner.hide();
    this.ngOnInit();
  }

  checkOutItem() {
    if (this.sessionService.getSessionItem('user')) {
      this.router.navigate(["/store/checkout"]);
    } else {
      this.router.navigate(["/sign-in"]);
    }
  }
}

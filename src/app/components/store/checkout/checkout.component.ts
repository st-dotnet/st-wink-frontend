import { Component, OnInit } from '@angular/core';
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

  constructor(private modalService: NgbModal) { }

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
}

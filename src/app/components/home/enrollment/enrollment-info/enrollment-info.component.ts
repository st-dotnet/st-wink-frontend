import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/_services';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-enrollment-info',
  templateUrl: './enrollment-info.component.html',
  styleUrls: ['./enrollment-info.component.css']
})
export class EnrollmentInfoComponent implements OnInit {

  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    backdropClass: 'customBackdrop'
  };
  isClickedMember: boolean = false;

  constructor(private modalService: NgbModal,
    private sessionService: SessionService) {
    this.sessionService.scrollToTop();
  }

  ngOnInit(): void {

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
    this.isClickedMember = !this.isClickedMember;
  }

}

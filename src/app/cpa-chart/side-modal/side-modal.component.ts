import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-side-modal',
  imports: [],
  templateUrl: './side-modal.component.html',
  encapsulation: ViewEncapsulation.None,
	styles: `
		.dark-modal .modal-content {
			background-color: #292b2c;
			color: white;
		}

    .modal-content {
      min-height: 100%;
    }
		
    .dark-modal .close {
			color: white;
		}

		.light-blue-backdrop {
			background-color: #5cb3fd;
		}

    .modal-dialog {
      position: absolute;
      right: 0;
      /* top: 0; */
      height: 99vh;
      margin:0;
      padding:0;
    }

	`,
})
export class SideModalComponent { 
  @ViewChild("longContent") content: any;
  nodeDetails: any;
  private modalService = inject(NgbModal);

  openScrollableContent(context: any) {
    this.nodeDetails = context;
    console.log(this.nodeDetails);
		this.modalService.open(this.content, { scrollable: true });
	}
}

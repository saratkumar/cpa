import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistogramComponent } from '../../histogram/histogram.component';
@Component({
  selector: 'app-side-modal',
  imports: [HistogramComponent],
  standalone: true,
  templateUrl: './side-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./side-modal.component.css']
})
export class SideModalComponent { 
  @ViewChild("longContent") content: any;
  nodeDetails: any;
  private modalService = inject(NgbModal);

  openScrollableContent(context: any) {
    this.nodeDetails = context;
    console.log(this.nodeDetails);
		this.modalService.open(this.content, { scrollable: true, size:'xl' });
	}
}

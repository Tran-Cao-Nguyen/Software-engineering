import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DocumentListDto, DocumentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';

@Component({
    selector: 'viewDocumentModal',
    templateUrl: './view-document-modal.component.html'
})
export class ViewDocumentModalComponent extends AppComponentBase {

    @ViewChild('viewModal', { static: false }) modal: ModalDirective;

    @Input() document!: DocumentListDto;

    active: boolean = false;
    private http: HttpClient;

    constructor(
        injector: Injector,
        private _documentService: DocumentServiceProxy
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }


    onShown(): void {

    }
    openPdfInNewTab(fileName: string) {
        const pdfUrl = 'assets/pdf/'+ fileName; // Đường dẫn đến tệp PDF trong thư mục 'assets/'
        this.createBlobUrl(pdfUrl); // Gọi hàm để tạo Blob URL từ tệp PDF
      }
    
      createBlobUrl(pdfUrl: string) {
        fetch(pdfUrl).then(response => response.blob()).then(blob => {
          const blobUrl = URL.createObjectURL(blob); // Tạo Blob URL từ Blob
          window.open(blobUrl, '_blank'); // Mở Blob URL trong tab mới
        });
      }

}

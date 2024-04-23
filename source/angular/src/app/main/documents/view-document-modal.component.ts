import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DocumentListDto, DocumentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';
import { Observable } from 'rxjs';

@Component({
    selector: 'viewDocumentModal',
    templateUrl: './view-document-modal.component.html'
})
export class ViewDocumentModalComponent extends AppComponentBase {

    @ViewChild('viewModal', { static: false }) modal: ModalDirective;

    @Input() document!: DocumentListDto;

    active: boolean = false;
    

    constructor(
        private http: HttpClient,
        injector: Injector,
        private _documentService: DocumentServiceProxy
    ) {
        super(injector);
    }

    show(doc: DocumentListDto): void {
        this.document = doc;
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
        // Gọi hàm downloadFile để tải tệp PDF từ máy chủ
        this.downloadFile(fileName).subscribe(responseBlob => {
            // Tạo Blob URL từ Blob
            const blobUrl = URL.createObjectURL(responseBlob);
            // Mở Blob URL trong tab mới
            const newTab = window.open(blobUrl, '_blank');
            if (!newTab) {
                console.error('Failed to open file in new tab.');
            }
        }, error => {
            console.error('Error downloading file:', error);
        });
    }
    
    downloadFile(filename: string): Observable<Blob> {
        const url = `https://localhost:44301/api/FileUpload/DownloadFile?filename=${encodeURIComponent(filename)}`;
    
        return this.http.get(url, { responseType: 'blob' });
    }

}

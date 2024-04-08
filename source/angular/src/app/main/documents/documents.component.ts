import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DocumentServiceProxy, DocumentListDto, ListResultDtoOfDocumentListDto } from '@shared/service-proxies/service-proxies';
import { ViewDocumentModalComponent } from './view-document-modal.component';

@Component({
    templateUrl: './documents.component.html',
    animations: [appModuleAnimation()]
})
export class DocumentsComponent extends AppComponentBase implements OnInit {
    @ViewChild(ViewDocumentModalComponent)
    private viewDocumentModal !: ViewDocumentModalComponent;

    documents: DocumentListDto[] = [];
    filter: string = '';
    documentsWithoutFilter: any = [];

    constructor(
        injector: Injector,
        private _DocumentService: DocumentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getDocuments();
    }

    getDocuments(): void {
        this._DocumentService.getDocuments(this.filter).subscribe((result) => {
            this.documents = result.items;
            this.documentsWithoutFilter = result.items;
        });
    }
    show(){
        this.viewDocumentModal.show();
    }
    openPdfInNewTab(fileName: string){
        this.viewDocumentModal.openPdfInNewTab(fileName);
    }

    sortFn(prop: any, asc: any) {
        this.documents = this.documentsWithoutFilter.sort(function (a: any, b: any) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        });
    }
    counter: number[] = [0, 0, 0, 0, 0, 0];
    icons: string[] = ['fa-sort', 'fa-sort-down', 'fa-sort-up'];
    sortwithKey(prop: any, index: number) {
        for (let i = 0; i < 6; i++) {
            if (i == index) this.counter[i]++;
            else this.counter[i] = 0;
        }
        if (this.counter[index] > 2) this.counter[index] = 0;
        switch (this.counter[index]) {
            case 1:
                this.sortFn(prop, false);
                break;
            case 2:
                this.sortFn(prop, true);
                break;
            default:
                break;
        }
    }
}


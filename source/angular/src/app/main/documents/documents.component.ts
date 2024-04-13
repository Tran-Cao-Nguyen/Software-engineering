import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DocumentServiceProxy, DocumentListDto, ListResultDtoOfDocumentListDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { DateTime } from 'luxon';

@Component({
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.css'],
    animations: [appModuleAnimation()]
})
export class DocumentsComponent extends AppComponentBase implements OnInit {

    documents: DocumentListDto[] = [];
    filter: string = '';

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
        });
    }

}

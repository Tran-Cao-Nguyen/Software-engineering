import {NgModule} from '@angular/core';
import {AppSharedModule} from '@app/shared/app-shared.module';
import {DocumentsRoutingModule} from './documents-routing.module';
import {DocumentsComponent} from './documents.component';
import {SubheaderModule} from '@app/shared/common/sub-header/subheader.module'
import { ViewDocumentModalComponent } from './view-document-modal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@NgModule({
    declarations: [DocumentsComponent, ViewDocumentModalComponent],
    imports: [AppSharedModule, DocumentsRoutingModule, SubheaderModule,
        InputTextModule,
        AutoCompleteModule,
        ButtonModule
]
})
export class DocumentsModule {}
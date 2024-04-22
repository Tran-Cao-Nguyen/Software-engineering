import {NgModule} from '@angular/core';
import {AppSharedModule} from '@app/shared/app-shared.module';
import {DocumentsRoutingModule} from './documents-routing.module';
import {DocumentsComponent} from './documents.component';
import {SubheaderModule} from '@app/shared/common/sub-header/subheader.module'
import { ViewDocumentModalComponent } from './view-document-modal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { LoaiVanBanComponent } from './loai-van-ban/loai-van-ban.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [DocumentsComponent, ViewDocumentModalComponent, LoaiVanBanComponent, CreateDocumentComponent, UploadFileComponent],
    imports: [AppSharedModule, DocumentsRoutingModule, SubheaderModule,
        InputTextModule,
        AutoCompleteModule,
        ButtonModule,
        FileUploadModule,
        FormsModule,
        ReactiveFormsModule
]

})
export class DocumentsModule {}
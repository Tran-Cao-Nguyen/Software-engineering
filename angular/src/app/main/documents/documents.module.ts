import {NgModule} from '@angular/core';
import {AppSharedModule} from '@app/shared/app-shared.module';
import {DocumentsRoutingModule} from './documents-routing.module';
import {DocumentsComponent} from './documents.component';
import {SubheaderModule} from '@app/shared/common/sub-header/subheader.module'
import { LoaiVanBanComponent } from './loai-van-ban/loai-van-ban.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
@NgModule({
    declarations: [DocumentsComponent, LoaiVanBanComponent, CreateDocumentComponent],
    imports: [AppSharedModule, DocumentsRoutingModule, SubheaderModule]
})
export class DocumentsModule {}
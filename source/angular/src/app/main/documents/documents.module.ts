import {NgModule} from '@angular/core';
import {AppSharedModule} from '@app/shared/app-shared.module';
import {DocumentsRoutingModule} from './documents-routing.module';
import {DocumentsComponent} from './documents.component';
import {SubheaderModule} from '@app/shared/common/sub-header/subheader.module'

@NgModule({
    declarations: [DocumentsComponent],
    imports: [AppSharedModule, DocumentsRoutingModule, SubheaderModule]
})
export class DocumentsModule {}
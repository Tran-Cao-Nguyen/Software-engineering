import {NgModule} from '@angular/core';
import {AppSharedModule} from '@app/shared/app-shared.module';
import {DocumentsRoutingModule} from './documents-routing.module';
import {DocumentsComponent} from './documents.component';
import { AdvancedLegendComponent } from '@swimlane/ngx-charts';
import { AdvancedSearchComponent } from '../AdvancedSearchComponent/AdvancedSearchComponent.component';

@NgModule({
    declarations: [DocumentsComponent, AdvancedSearchComponent],
    imports: [AppSharedModule, DocumentsRoutingModule],
    exports: [DocumentsComponent, AdvancedSearchComponent]
})
export class DocumentsModule {
    
}

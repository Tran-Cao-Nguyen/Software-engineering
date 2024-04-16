import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DocumentServiceProxy, DocumentListDto, ListResultDtoOfDocumentListDto } from '@shared/service-proxies/service-proxies';
import { ViewDocumentModalComponent } from './view-document-modal.component';

import { CreateDocumentComponent } from './create-document/create-document.component';
import { document } from 'ngx-bootstrap/utils';
@Component({
    templateUrl: './documents.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./documents.component.css']
})
export class DocumentsComponent extends AppComponentBase implements OnInit {
    @ViewChild(ViewDocumentModalComponent)
    private viewDocumentModal !: ViewDocumentModalComponent;
    @ViewChild('createDocumentModal', { static: false }) createDocumentModal: CreateDocumentComponent;

    documents: DocumentListDto[] = [];
    filter: string = '';
    documentsWithoutFilter: any = [];
    suggestDocuments: DocumentListDto[];
    selectedDocuments: any;

    // Advanced Search
    // General
    results: DocumentListDto[] = [];
    searchParams: any = {};
    noResultsFound: boolean = false;
    advancedSearch: boolean = false;
    // Type Search
    typeOptions: string[] = [];
    showTypeOptions: boolean = false;
    // Citation Search
    citationOptions: string[] = [];
    showCitationOptions: boolean = false;
    // Title Search
    titleOptions: string[] = [];
    showTitleOptions: boolean = false;
    // Code Search
    codeOptions: string[] = [];
    showCodeOptions: boolean = false;

    constructor(
        injector: Injector,
        private _DocumentService: DocumentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getDocuments();
    }

    filterDocumentForSuggestion(event) {
        const filterValue = event.query.toLowerCase();
        this.suggestDocuments = this.documentsWithoutFilter.filter(option => option.title.toLowerCase().startsWith(filterValue));
    }

    onSearchSubmit(event): void {
        const filter = event
        this._DocumentService.getDocuments(filter).subscribe((result) => {
            this.documents = result.items;
        });
      }

    onClickSearchButton(): void {
        console.log(this.selectedDocuments)
        const filter = typeof this.selectedDocuments == 'string' ? this.selectedDocuments : this.selectedDocuments?.title
        this._DocumentService.getDocuments(filter).subscribe((result) => {
            this.documents = result.items;
        });
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
    createDocument(): void {
        this.createDocumentModal.show();
    }

    // Search Submit

    handleSearchButton(): void {
        if (this.advancedSearch) {
            this.search();
        }
        else {
            this.onClickSearchButton();
        }
    }

    search(): void {

        for (let key in this.searchParams) {
            if (this.searchParams.hasOwnProperty(key) && this.searchParams[key] === '') {
                delete this.searchParams[key];
            }
        }

        if (!Object.keys(this.searchParams).length) {
            this.noResultsFound = false;
            this.documents = this.results;
            return;
        }

        this.documents = this.results.filter( document => {
            for (let key in this.searchParams) {
                if (document[key] !== this.searchParams[key]) {
                    if (key === 'effectiveDate' && document.effectiveDate.toSQLDate() !== this.searchParams[key]) {
                        return false;
                    }
                    else if (key === 'expirationDate' && document.expirationDate.toSQLDate() !== this.searchParams[key]) {
                        return false;
                    }
                    else if (key !== 'effectiveDate' && key !== 'expirationDate') return false;
                }
            }
            return true;
        })


        this.noResultsFound = this.documents.length === 0;
    }

    refresh(): void {
        this.filter = '';
        this.getDocuments();
        this.results = this.documents;
        for (let key in this.searchParams) {
                delete this.searchParams[key];
            }
        this.selectedDocuments = '';
    }
    
    fetchTypeOption(): void {
        this.showTypeOptions = true;
        this.typeOptions = [...new Set(this.results.map(obj => obj.type))].slice(0, 5);
    }

    toggleFocus(): void {
        if (this.showTypeOptions) {
            document.getElementById("searchType").blur();
        }
        else {
            document.getElementById("searchType").focus();
        }
        
    }

    onBlurType(): void {
        setTimeout(() => {
          if (this.showTypeOptions) this.showTypeOptions = false;
        }, 100); 
    }

    onBlurCitation(): void {
        setTimeout(() => {
          if (this.showCitationOptions) this.showCitationOptions = false;
        }, 100); 
    }

    onBlurTitle(): void {
        setTimeout(() => {
          if (this.showTitleOptions) this.showTitleOptions = false;
        }, 100); 
    }

    onBlurCode(): void {
        setTimeout(() => {
          if (this.showCodeOptions) this.showCodeOptions = false;
        }, 100); 
    }

    onTypeChange(value: string): void {
        this.searchParams.type = value;
        this.showTypeOptions = false;
    }
    
    fetchCitation(): void {
        if (this.searchParams.citation === '') this.showCitationOptions = false;
        if (this.showCitationOptions) {
            const wordSearch = this.searchParams.citation.trim().toLowerCase().split(' ').filter(word => word !== '');
            this.citationOptions = [...new Set(this.results.map(obj => obj.citation))].filter(suggestion => {
                const words = suggestion.toLowerCase().split(' ');
                if (wordSearch.length <= words.length) {
                    for (let x in wordSearch) {
                        if (wordSearch[x] !== words[x]) return false;
                    }
                    return true;
                }
                return false
            }).slice(0, 5);
        }
    }

    onCitationChange(value: string): void {
        this.searchParams.citation = value;
    }

    fetchTitle(): void {
        if (this.searchParams.title === '') this.showTitleOptions = false;
        if (this.showTitleOptions) {
            const wordSearch = this.searchParams.title.trim().toLowerCase().split(' ').filter(word => word !== '');
            this.titleOptions = [...new Set(this.results.map(obj => obj.title))].filter(suggestion => {
                const words = suggestion.toLowerCase().split(' ');
                if (wordSearch.length <= words.length) {
                    for (let x in wordSearch) {
                        if (wordSearch[x] !== words[x]) return false;
                    }
                    return true;
                }
                return false
            }).slice(0, 5);
        }
    }

    onTitleChange(value: string): void {
        this.searchParams.title = value;
    }

    fetchCode(): void {
        if (this.searchParams.code === '') this.showCodeOptions = false;
        if (this.showCodeOptions) {
            const wordSearch = this.searchParams.code.trim().toLowerCase();
            this.codeOptions = [...new Set(this.results.map(obj => obj.code))].filter(suggestion => {
                if (suggestion.startsWith(wordSearch)) return true;
                return false;
            }).slice(0, 5);
        }
    }

    onCodeChange(value: string): void {
        this.searchParams.code = value;
    }



}


import { Component, Injector, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DocumentServiceProxy, DocumentListDto, ListResultDtoOfDocumentListDto } from '@shared/service-proxies/service-proxies';
import { ViewDocumentModalComponent } from './view-document-modal.component';

import { CreateDocumentComponent } from './create-document/create-document.component';
import { document } from 'ngx-bootstrap/utils';
import { HttpEventType } from '@angular/common/http';
import { DownloadFileService } from './download-file/download-file';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './documents.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./documents.component.css']
})
export class DocumentsComponent extends AppComponentBase implements OnInit {
    @ViewChild(ViewDocumentModalComponent)
    private viewDocumentModal !: ViewDocumentModalComponent;
    @ViewChild('createDocumentModal', { static: false }) createDocumentModal: CreateDocumentComponent;

    documents: any[] = [];
    filter: string = '';
    documentsWithoutFilter: any = [];
    suggestDocuments: any[];
    selectedDocuments: any;

    
    // Handle Confirm Box
    modalRef: BsModalRef;   
    checkedArray: any[] = []
    // End Handle Confirm Box

    // Advanced Search
    // General
    results: any[] = [];
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
        private _DocumentService: DocumentServiceProxy,
        private _DownloadFileService: DownloadFileService,
        private _ModalService: BsModalService,
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
            this.documents = result.items.map(
                document => {
                    return { ...document, isChecked: false}
                }
            )
        });
      }

    onClickSearchButton(): void {
        console.log(this.selectedDocuments)
        const filter = typeof this.selectedDocuments == 'string' ? this.selectedDocuments : this.selectedDocuments?.title
        this._DocumentService.getDocuments(filter).subscribe((result) => {
            this.documents = result.items.map(
                document => {
                    return { ...document, isChecked: false}
                }
            )  
        });
    }

    getDocuments(): void {
        this._DocumentService.getDocuments(this.filter).subscribe((result) => {
            this.documents = result.items.map(
                document => {
                    return { ...document, isChecked: false}
                }
            )
            
            this.documentsWithoutFilter = this.documents;
        });
    }
    show(document: any){
        this.viewDocumentModal.show(document);
    }
    openPdfInNewTab(fileName: string){
        this.viewDocumentModal.openPdfInNewTab(fileName);
    }

    sortFn(prop: any, asc: any) {
        this.documents = this.documents.sort(function (a: any, b: any) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        });
    }
    counter: number[] = [0, 0, 0, 0, 0];
    icons: string[] = ['fa-sort', 'fa-sort-down', 'fa-sort-up'];
    sortwithKey(prop: any, index: number) {
        for (let i = 0; i < 5; i++) {
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
                this.sortFn("code", true);
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
        this.typeOptions = [...new Set(this.results.map(obj => obj.type))];
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
                return false;
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
                return false;
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

    // Download

    public progress: number;
    
    download = (fileName) => {
        this._DownloadFileService.downloadFile(fileName).subscribe((event) => {
            if (event.type === HttpEventType.UploadProgress)
                this.progress = Math.round((100 * event.loaded) / event.total);

            else if (event.type === HttpEventType.Response) {
                const downloadFile = new Blob([event.body], { type: event.body.type });
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                a.download = fileName;
                a.href = URL.createObjectURL(downloadFile);
                a.target = '_blank';
                a.click();
                document.body.removeChild(a);
            }
        });
    }

    // End Download    

    // Handle Multi Checkbox
    downloadAll(): void {
        this.documents.filter(document => document.isChecked).forEach(document => {
            this.download(document.fileName)
        });
    }

    onChange(id: number, isChecked: boolean): void
    {   
        isChecked = !isChecked;
        this.documents.forEach(document => {
            if (document.id === id) {
                document.isChecked = isChecked;
            }
        })
    }
    onChangeAll(): void {
        this.checkedArray = this.documents.filter(document => document.isChecked == false)
        
        if (this.checkedArray.length == 0) {
            this.documents.forEach(document => {
                document.isChecked = false;
            })
        } else {
            this.documents.forEach(document => {
                if (document.isChecked == false) {
                    document.isChecked = true;
                }
            })
        }
    }
    // End Handle Multi Checkbox

    // Handle Confirm Box
    openModalAll(template: TemplateRef<any>) {
        this.modalRef = this._ModalService.show(template, {class: 'modal-sm'});
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this._ModalService.show(template, {class: 'modal-sm'});
    }

    confirmAll(): void {     
        this.modalRef.hide();
        this.downloadAll();
    }

    confirm(fileName): void {
        this.modalRef.hide();
        this.download(fileName)
    }
    decline(): void {
        this.modalRef.hide();
    }
    // End Handle Confirm Box
    
}


import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DocumentServiceProxy, DocumentListDto, ListResultDtoOfDocumentListDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { DateTime } from 'luxon';

@Component({
    selector: 'AdvancedSearchComponent',
    templateUrl: './AdvancedSearchComponent.component.html',
    styleUrls: ['./AdvancedSearchComponent.component.css'],
    animations: [appModuleAnimation()]
})
export class AdvancedSearchComponent extends AppComponentBase implements OnInit {

    documents: DocumentListDto[] = [];
    filter: string = '';

    // General
    searchParams: any = {};
    results: DocumentListDto[] = [];
    noResultsFound: boolean = false;
    advancedSearch: boolean = false;


    // Type Search
    typeOptions: string[] = [];
    showTypeOptions: boolean = false;

    // Organization Search
    organizationOptions: string[] = [];
    showOrganizationOptions: boolean = false;

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

    getDocuments(): void {
        this._DocumentService.getDocuments(this.filter).subscribe((result) => {
            this.documents = result.items;
            this.results = this.documents;
        });
    }

    // Search Submit
    search(): void {
        // Set the documents list to default
        this.results = this.documents;

        // Remove empty params
        for (let key in this.searchParams) {
            if (this.searchParams.hasOwnProperty(key) && this.searchParams[key] === '') {
                delete this.searchParams[key];
            }
        }

        // If all parameters are empty, return documents list
        if (!Object.keys(this.searchParams).length) {
            this.noResultsFound = false;
            return;
        }
        this.results = this.documents.filter( document => {
            // Have not checked data is deleted or not
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

        this.noResultsFound = this.results.length === 0;
    }

    refresh(): void {
        for (let key in this.searchParams) {
                delete this.searchParams[key];
            }
    }
    
    // Type Search
    fetchTypeOption(): void {
        this.showTypeOptions = !this.showTypeOptions;
        if (this.showTypeOptions) {
            this.typeOptions = [...new Set(this.documents.map(obj => obj.type))];
        }
    }

    toggleFocus(): void {
        document.getElementById("searchType").focus();
    }

    onBlur(): void {
        // Set a short timeout to give time for a click on the options dropdown
        setTimeout(() => {
          if (this.showTypeOptions) this.showTypeOptions = false;
          if (this.showOrganizationOptions) this.showOrganizationOptions = false;
          if (this.showTitleOptions) this.showTitleOptions = false;
          if (this.showCodeOptions) this.showCodeOptions = false;
        }, 100); 
    }

    onTypeChange(value: string): void {
        this.searchParams.type = value;
        this.showTypeOptions = false;
    }
    
    // Organization Search
    fetchOrganization(): void {
        if (this.searchParams.organization === '') this.showOrganizationOptions = false;
        if (this.showOrganizationOptions) {
            const wordSearch = this.searchParams.organization.trim().toLowerCase().split(' ').filter(word => word !== '');
            this.organizationOptions = [...new Set(this.documents.map(obj => obj.organization))].filter(suggestion => {
                const words = suggestion.toLowerCase().split(' ');
                if (wordSearch.length <= words.length) {
                    for (let x in wordSearch) {
                        if (wordSearch[x] !== words[x]) return false;
                    }
                    return true;
                }
                return false
            }).slice(0, 5);;
        }
    }

    onOrganizationChange(value: string): void {
        this.searchParams.organization = value;
    }

    // Title Search
    fetchTitle(): void {
        if (this.searchParams.title === '') this.showTitleOptions = false;
        if (this.showTitleOptions) {
            const wordSearch = this.searchParams.title.trim().toLowerCase().split(' ').filter(word => word !== '');
            this.titleOptions = [...new Set(this.documents.map(obj => obj.title))].filter(suggestion => {
                const words = suggestion.toLowerCase().split(' ');
                if (wordSearch.length <= words.length) {
                    for (let x in wordSearch) {
                        if (wordSearch[x] !== words[x]) return false;
                    }
                    return true;
                }
                return false
            }).slice(0, 5);;
        }
    }

    onTitleChange(value: string): void {
        this.searchParams.title = value;
    }

    // Code Search
    fetchCode(): void {
        if (this.searchParams.code === '') this.showCodeOptions = false;
        if (this.showCodeOptions) {
            const wordSearch = this.searchParams.code.trim().toLowerCase();
            this.codeOptions = [...new Set(this.documents.map(obj => obj.code))].filter(suggestion => {
                if (suggestion.startsWith(wordSearch)) return true;
                return false;
            }).slice(0, 5);;
        }
    }

    onCodeChange(value: string): void {
        this.searchParams.code = value;
    }


}

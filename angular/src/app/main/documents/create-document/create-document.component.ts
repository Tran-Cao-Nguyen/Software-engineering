import { ElementRef , Component, EventEmitter, Injector, Output, ViewChild ,ViewEncapsulation,OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    CreateDocumentInput, 
    DocumentServiceProxy,  
} from '@shared/service-proxies/service-proxies';
import { filter as _filter } from 'lodash-es';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { LoaiVanBanComponent } from '../loai-van-ban/loai-van-ban.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent extends AppComponentBase {

    @ViewChild('createModal', { static: true }) modal: ModalDirective;
    @ViewChild(LoaiVanBanComponent) loaivanban : LoaiVanBanComponent;
    @ViewChild('EffectDayInput') effectDayInput: ElementRef;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    legaldoc: CreateDocumentInput;
    doctypes =  [];
    filteredDoctypes: any[] = [];
    searchTerm: string = '';
    selectedDoctype: string = '';
    showNoResults: boolean = false;
    selectedCar: number;
    effectDayFilled: boolean = false;
    showEffectDayMessage: boolean = false;
    checksmaller:boolean = false;
    intervalId: any;
    isValidSoHieuVanBan: boolean = true;
    errorSoHieuVanBan = "";

    constructor(
        injector: Injector,  
        private _documentService: DocumentServiceProxy,
        
    ) {
        super(injector);
    }
    show() {

        this.active = true;
        this.init();
        this.modal.show();
    }

    onShown(): void {

    }

    init(): void {
        this.legaldoc = new CreateDocumentInput();
      
        this.intervalId = setInterval(() => {
            if (this.legaldoc.expirationDate && this.legaldoc.effectiveDate > this.legaldoc.expirationDate ){  
                this.checksmaller = true;
                this.legaldoc.expirationDate = null;
            } else if (this.legaldoc.effectiveDate <=  this.legaldoc.expirationDate) {
                this.checksmaller = false; 
            }
        }, 250); 
    }
    setCheckSmaller():void{
        if (this.legaldoc.effectiveDate > this.legaldoc.expirationDate){  
            this.checksmaller = true;
            this.legaldoc.expirationDate = null;
        } else {
            this.checksmaller = false; 
        }
    
    }
    filterOptions(event: any) {
        this.searchTerm = event.target.value;
        this.filteredDoctypes = this.doctypes.filter(option =>
            option.displayText.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.showNoResults = this.searchTerm !== '' && this.filteredDoctypes.length === 0;
    }
    save(): void {
        this.saving = true;
        this.legaldoc.type = this.loaivanban.InputLoaiVanBan;
        this._documentService
            .createDocuments(this.legaldoc)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.active = false;
                this.modal.hide();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        Swal.fire({
            title: "You want to cancel all the information you just entered ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText:"Cancel"
        }).then((result)=>{
            if(result.value){
                this.active = false;
                this.modal.hide();
            }
        })

    }
    onlyNumber(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
          event.preventDefault();
        }
    }
    formatDate_EffectDay(event: any) {
        const value = event.target.value;
        if(value === "Invalid date"){
            event.target.value = "Invalid date. Please try again !";
            event.target.classList.add('siba-text');
            setTimeout(() => {
                event.target.classList.remove('siba-text');

                event.target.value = '';
                this.legaldoc.effectiveDate = null;
            }, 1000);
        }
        this.showEffectDayMessage = false;
    }
    formatDate_EndDay(event: any) {
        const value = event.target.value;
        if(value === "Invalid date"){
            event.target.value = "Invalid date. Please try again !";
            event.target.classList.add('siba-text');
            setTimeout(() => {
                event.target.classList.remove('siba-text');

                event.target.value = '';
                this.legaldoc.expirationDate = null;
            }, 1000);
        }
    }
    checkEffectDayFilled() {
        this.effectDayFilled = !!this.legaldoc.effectiveDate;
        if (!this.effectDayFilled) {
            this.effectDayInput.nativeElement.focus();
            this.showEffectDayMessage = true;
        }
    }
    checkValidSoHieuVanBan(): void { 

        this.isValidSoHieuVanBan = true;
        if (this.legaldoc.code[0] == "/") {
            this.errorSoHieuVanBan = "Not allowed to start with the character '/'";
            this.isValidSoHieuVanBan = false;
            return;
        }

        if (!/[A-Za-z]/.test(this.legaldoc.code) || !/[0-9]/.test(this.legaldoc.code) || !/\/+/.test(this.legaldoc.code)) {
            this.errorSoHieuVanBan = "Must contain both letters and numbers and /";
            this.isValidSoHieuVanBan = false;
            return;
        }

        for (let letter of this.legaldoc.code) {
            if (!letter.match(/[A-Za-z]/) && !letter.match(/[0-9]/) && letter != "/" && letter != "-") {
                this.errorSoHieuVanBan = "Only allowed to contain letters, numbers, the character '/', and '-'";
                this.isValidSoHieuVanBan = false;
                return;
            }
        }

        if (/[\s]/.test(this.legaldoc.code)) {
            this.errorSoHieuVanBan = "Not allowed to contain whitespace";
            this.isValidSoHieuVanBan = false;
            return;
        }
        let soHieuVanBanSplit = this.legaldoc.code.split(/[/-]/);
        for (let s of soHieuVanBanSplit) {
            const containsLetter = /[A-Za-z]/.test(s);
            const containsDigit = /[0-9]/.test(s);
            if (containsDigit) {
                if (s.length == 1) {
                    this.errorSoHieuVanBan = "Must have a 0 before a number less than 10";
                    this.isValidSoHieuVanBan = false;
                    return;
                }
            }
        }
        this.errorSoHieuVanBan = "Success";
    }
    isLoaiVanBanFilled(): boolean {
        return this.loaivanban.InputLoaiVanBan == ''; 
    }

}

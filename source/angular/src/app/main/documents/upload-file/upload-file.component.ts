import { Component, OnInit, ViewChild, Injector, assertPlatform } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { IAjaxResponse, TokenService } from '@node_modules/abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
  animations: [appModuleAnimation()],
})

export class UploadFileComponent extends AppComponentBase implements OnInit {

  public uploader: FileUploader;
  uploadUrl: string;
  public filename: string;
  // public username: string;
  public array: any[] = []
  @ViewChild('fileUploader') fileUploader!: FileUpload;

  public _uploaderOptions: FileUploaderOptions = {};

  constructor(
    injector: Injector,
    public _tokenService: TokenService,
    private http: HttpClient
  ) {
    super(injector);
    this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/api/FileUpload/UploadFile/';
    // this.username = this.appSession.user.userName;
  }

  ngOnInit() {
    this.initFileUploader();
  }

  initFileUploader(): void {
    this.uploader = new FileUploader({ url: this.uploadUrl });
    this._uploaderOptions.autoUpload = false;
    this._uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
    // this._uploaderOptions.removeAfterUpload = true;
    this.uploader.setOptions(this._uploaderOptions);
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    // this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
    //   form.append('userName', this.username);
    // };

    this.uploader.onSuccessItem = (item, response, status) => {
      const resp = <IAjaxResponse>JSON.parse(response);
      if (resp.success) {

      } else {
        this.message.error(resp.error.message);
      }
    };

  }

  // icon pdf and word
  iconList = ["far fa-file-pdf", "far fa-file-word"]

  getIcon(filename: any): string {
    const exten = filename.name.split(".").pop();
    if (exten == "pdf") {
      return this.iconList[0];
    }
    else {
      return this.iconList[1];
    }
  }

  getSize(filesize: number): string {
    const Kb: number = 1000;
    const Mb: number = 1000 * Kb;

    if (filesize < Kb) {
      return filesize + " Bytes"
    }
    else if (filesize >= Kb && filesize < Mb) {
      return (filesize / Kb).toFixed(3) + " KB"
    }
    else {
      return (filesize / Mb).toFixed(3) + " MB"
    }
  }

  upload(): void {
    this.uploader.uploadAll();
  }

  // event of p-fileUpload
  onSelect(event: any): void {
    // for (let file of event.files) {
    //   this.uploader.addToQueue([file]);
    //   this.array.push(file);
    // }
    const extend = event.files[0].name.split(".").pop();
    this.uploader.clearQueue();
    if (extend == "pdf" || extend == "docx" || extend == "doc") {
      this.uploader.addToQueue([event.files[0]]);
      this.array.push(event.files[0]);
    }
  }

  onRemove(event: any): void {
    // let num = this.array.findIndex(file => file.name == event.file.name);
    // // alert(num);
    // this.array.splice(num, 1);
    // // for (let file of this.array) {
    // //   alert(file.name);
    // // }
    // // alert(this.uploader.queue[num].file.name);
    // this.uploader.removeFromQueue(this.uploader.queue[num]);
    this.uploader.clearQueue();
    this.array.splice(0, 1);
  }


  onClear(event: any): void {
    // Swal.fire({
    //   title: "Bạn có chắc chắn không?",
    //   text: "Văn bản này sẽ bị xóa và không thể hoàn tác",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Đồng ý",
    //   cancelButtonText: "Hủy"
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     // this.active = false;
    //     // this.modal.hide();
    //     // this.fileUploader.clear(); 
    //     this.uploader.clearQueue();
    //     this.array = [];
    //   }
    // })
    this.uploader.clearQueue();

  }


  present() {
    return alert(this.uploader.queue.length + " " + this.uploadUrl);
  }



}

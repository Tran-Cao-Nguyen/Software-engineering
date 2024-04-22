import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()

export class DownloadFileService {
  private baseApiUrl: string;
  private apiDownloadUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseApiUrl = 'https://localhost:44301/api/FileUpload/'
    this.apiDownloadUrl = this.baseApiUrl + 'DownloadFile'
  }

  public downloadFile(file: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.request(new HttpRequest(
      'GET',
      `${this.apiDownloadUrl}?filename=${file}`,
      null,
      {
        reportProgress: true,
        responseType: 'blob'
      }
    ));
  }
}
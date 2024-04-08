import { DateTime, Duration } from "luxon";

export interface ICreateDocumentInput{
  id : number;
  title: string;
  code: string;
  releaseDate: DateTime;
  organization: string;
  effectiveDate: DateTime;
  expirationDate: DateTime;
  type: string;
  fileName: string;
  citation: string;
}
export class CreateDocumentInput implements ICreateDocumentInput {
  id!: number;
  title!: string;
  code!: string;
  releaseDate!: DateTime;
  organization!: string;
  effectiveDate!: DateTime;
  expirationDate!: DateTime;
  type!:string;
  fileName!:string;
  citation!: string;

  constructor(data?: ICreateDocumentInput) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(_data?: any) {
      if (_data) {
          this.id = _data["id"];
          this.title = _data["title"];
          this.code = _data["code"];
          this.releaseDate = _data["releaseDate"];
          this.organization = _data["organization"];
          this.effectiveDate = _data["effectiveDate"];
          this.expirationDate = _data["expirationDate"];
          this.type = _data["type"];
          this.fileName = _data["filename"];
          this.citation = _data["citation"];
      }
  }

  static fromJS(data: any): CreateDocumentInput {
      data = typeof data === 'object' ? data : {};
      let result = new CreateDocumentInput();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["title"] = this.title;
      data["code"] = this.code;
      data["releaseDate"] = this.releaseDate;
      data["organization"] = this.organization;
      data["effectiveDate"] = this.effectiveDate;
      data["expirationDate"] = this.expirationDate;
      data["type"] = this.type;
      data["filename"] = this.fileName;
      data["citation"] = this.citation;
      return data; 
  }
}

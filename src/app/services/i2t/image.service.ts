import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrlImage } from './url';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  preUrl:string = PreUrlImage;

  constructor( private http:HttpClient ) { }

  postImage( adjunto ){
    /*const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });*/
    console.log(adjunto);

    let formData:FormData = new FormData();
    formData.append('file', adjunto, adjunto.name);

    console.log(formData);
    console.log(formData.getAll('file'));

    let query = `api/attachments`;
    let url = this.preUrl + query;

    return this.http.post( url, formData );
  }

}

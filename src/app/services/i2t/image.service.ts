import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  preUrl:string = this.config.getConfig('api_url')

  constructor(private http:HttpClient, private config: AppConfig) { }

  postImage( adjunto, token ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    //'Content-Type': 'application/json'
    console.log(adjunto);

    let formData:FormData = new FormData();
    formData.append('file', adjunto, adjunto.name);

    console.log(formData);
    console.log(JSON.stringify(formData));
    console.log(formData.getAll('file'));

    let query = `api/imagenes/attachments`;
    let url = this.preUrl + query;
    console.log(url);

    return this.http.post( url, formData, { headers } );
  }
  delImage( nombre, token ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    //'Content-Type': 'application/json'
    
    let query = `api/imagenes/attachments/${ nombre }`;
    let url = this.preUrl + query;
    console.log(url);

    return this.http.delete( url, { headers } );
  }

}
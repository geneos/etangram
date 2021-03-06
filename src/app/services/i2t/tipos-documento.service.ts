import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class TiposDocumentoService {

  //compraProveedores:any [] = [];
  preUrl:string = this.config.getConfig('api_url')

  constructor(private http:HttpClient, private config: AppConfig) { }


  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getTiposDocumento( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_tipodocumento`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getTipoDocumento( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_tipodocumento/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

}

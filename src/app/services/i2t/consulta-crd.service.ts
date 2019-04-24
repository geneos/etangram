import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';
@Injectable({
  providedIn: 'root'
})
export class ConsultaCrdService {
  Proveedor:any [] = [];

  preUrl:string = this.config.getConfig('api_url')

  constructor( private http:HttpClient, private config: AppConfig ) { }
  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getProveedor( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/proveedor?codigo=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getProveedorCrd( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/crd_cabecera?npro=[${ id }]`;
    console.log(query)
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}

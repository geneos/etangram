import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class VendedoresService {

  //compraProveedores:any [] = [];
  preUrl:string = PreUrl;

  constructor( private http:HttpClient ) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getVendedores( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_vendedores`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getVendedor( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_vendedores/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getVendedorPorCodigo( codigo:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_vendedores?codigo=${ codigo }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}
import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  //compraProveedores:any [] = [];
  preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";

  constructor( private http:HttpClient ) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getCajas( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_cajas`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCaja( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_cajas/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

}
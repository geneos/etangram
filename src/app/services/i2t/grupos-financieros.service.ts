import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class GruposFinancierosService {

  //compraProveedores:any [] = [];
  //preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";
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

  getGruposFinancieros( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_grupofinanciero`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getGrupoFinanciero( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_grupofinanciero/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

}

import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConsultaCrdService {
  Proveedor:any [] = [];

  urlProveedor:string = "http://tstvar.i2tsa.com.ar:3000/";
  
  constructor(private http:HttpClient) { }
  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.urlProveedor + query;

    return this.http.post( url, body, { headers } );
  }

  getProveedor( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/proveedor?codigo=${ id }`;
    let url = this.urlProveedor + query;

    return this.http.get( url , { headers });
  }

  getProveedorCrd( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/crd_cabecera?npro=[${ id }]`;
    console.log(query)
    let url = this.urlProveedor + query;

    return this.http.get( url , { headers });
  }
}

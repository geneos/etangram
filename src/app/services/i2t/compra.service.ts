import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQwNDQyMDY0LCJleHAiOjE1NDA0NjAwNjR9.OZ0MRo_fNuVpXx-9SJCUBRud_bR3wNSfNAJUfn9O1i8';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  compraProveedores:any [] = [];

  urlCompra:string = "http://tstvar.i2tsa.com.ar:3000/";

  constructor( private http:HttpClient ) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.urlCompra + query;

    return this.http.post( url, body, { headers } );
  }

  getProveedor( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/proveedor?codigo=${ id }`;
    let url = this.urlCompra + query;

    return this.http.get( url , { headers });
  }

  postCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/CabeceraIns";
    let url = this.urlCompra + query;

    return this.http.post( url, body, { headers });
  }

  getArticulo( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/articulo?codigo=${ id }`;
    let url = this.urlCompra + query;

    return this.http.get( url , { headers });
  }

  getItem( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/item?codigo=${ id }`;
    let url = this.urlCompra + query;

    return this.http.get( url , { headers });
  }

  postArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/DetalleIns";
    let url = this.urlCompra + query;

    return this.http.post( url, body, { headers });
  }

}

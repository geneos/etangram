import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  compraProveedores:any [] = [];

  //preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";
 
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

    let query = `api/c_proveedores?codigo=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  postCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/CabeceraIns";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  getArticulo( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/articulo?codigo=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getItem( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/item?codigo=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  postArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/DetalleIns";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  editArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/detalleUpd";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  deleteArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/DetalleDel";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  getExpediente(name:string, token:string){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg05_expedientes?name=${ name }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

}

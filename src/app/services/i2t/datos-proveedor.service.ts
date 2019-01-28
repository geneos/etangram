import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class DatosProveedorService {

  Proveedor:any [] = [];

  urlProveedor:string = PreUrl;

  constructor(private http:HttpClient) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.urlProveedor + query;

    return this.http.post( url, body, { headers } );
  }

  datosCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });

    let query = "api/proc/datosproveedor_GET_SP/";
    let url = this.urlProveedor + query;

    return this.http.post( url, body, { headers } );
  }

  getImpuesto(body:string, token:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });

    let query = "api/proc/proveedores_impuesto_GET_SP/"
    let url = this.urlProveedor + query;

    return this.http.post( url, body, { headers } );
  }

  getFormulario( body:string, token:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });

    let query = "api/proc/proveedores_formulario_GET_SP/"
    let url = this.urlProveedor + query;

    return this.http.post( url, body, { headers } );
  }
}

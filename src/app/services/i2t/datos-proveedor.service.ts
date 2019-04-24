import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';
@Injectable({
  providedIn: 'root'
})
export class DatosProveedorService {

  Proveedor:any [] = [];

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

  datosCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });

    let query = "api/proc/datosproveedor_GET_SP/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getImpuesto(body:string, token:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });

    let query = "api/proc/proveedores_impuesto_GET_SP/"
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getFormulario( body:string, token:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });

    let query = "api/proc/proveedores_formulario_GET_SP/"
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  updCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });

    let query = "api/proc/datosproveedor_UPD_SP/"
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }
}

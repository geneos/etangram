import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class OrdPublicidadService {

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

  getBaseDatos( idProv:string, op:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/PRENSA_Proveedor?id_prov=${idProv}&opcion=${op}`;
    let url = this.urlProveedor + query;

    return this.http.get( url , { headers });
  }
}

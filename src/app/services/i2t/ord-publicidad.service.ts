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

  postDatos( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/PRENSA_Proveedor`;
    let url = this.urlProveedor + query;

    return this.http.post( url, body, { headers } );
  }
}

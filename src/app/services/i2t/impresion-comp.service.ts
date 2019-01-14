import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class ImpresionCompService {
 urlReporte:string;

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
 
  getBaseDatos( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg06_tg_basedatos`;
    let url = this.urlProveedor + query;

    return this.http.get( url , { headers });
  }

  getInfromes( tip:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg06_tg_informes/${tip}`;
    let url = this.urlProveedor + query;

    return this.http.get( url, { headers })
  }

  getReporte( url:string, id:string, token:string){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = url + `${ id }`
    console.log(query)
    return this.http.get( query, { headers })
  }
}
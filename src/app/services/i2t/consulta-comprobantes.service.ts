import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';
@Injectable({
  providedIn: 'root'
})
export class ConsultaComprobantesService {

  Proveedor:any [] = [];

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
  getComprobante(body:string, token:string){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

      let query = "api/proc/CabeceraGet";
      let url = this.preUrl + query;

      return this.http.post( url, body, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultaRetencionesService {

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
  getComprobante(body:string, token:string){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

      let query = "api/proc/CabeceraGet";
      let url = this.urlProveedor + query;
  
      return this.http.post( url, body, { headers });
  }
}

import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class TiposComprobanteService {

  //compraProveedores:any [] = [];
  preUrl:string = PreUrl;

  constructor( private http:HttpClient ) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getTiposComprobante( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_tipocomprobante`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getTipoComprobante( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_tipocomprobante/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getTipoOperacionPorIdTipoComprobante( idtipocomp:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    // let query = `api/tg01_tipocomprobante?tg01_tipooperacion_id_c=eq[${ idtipocomp }]`;
    let query = `api/tg01_tipocomprobante?idtipocomp=eq[${ idtipocomp }]`;
    let url = this.preUrl + query;
    console.log('url consulta partida: ' + url)

    return this.http.get( url , { headers });
  }

}

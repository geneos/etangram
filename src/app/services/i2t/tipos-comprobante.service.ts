import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';
@Injectable({
  providedIn: 'root'
})
export class TiposComprobanteService {

  //compraProveedores:any [] = [];
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

  getTipoOperacion( idtipocomp:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_tipocomprobante?tg01_tipooperacion_id_c=eq[${ idtipocomp }]`;
    let url = this.preUrl + query;
    console.log('url consulta partida: ' + url)

    return this.http.get( url , { headers });
  }


  getTipoOperacionPorIdTipoComprobante( idtipocomp:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    // let query = `api/tg01_tipocomprobante?tg01_tipooperacion_id_c=eq[${ idtipocomp }]`;
    let query = `api/tg01_tipocomprobante?idtipocomp=eq[${ idtipocomp }]`;
    let url = this.preUrl + query;
    console.log('url consulta tipo comprobante: ' + url)

    return this.http.get( url , { headers });
  }
  
  geTipoComprobanteCompras( idtipocomp:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    // let query = `api/tg01_tipocomprobante?tg01_tipooperacion_id_c=eq[${ idtipocomp }]`;
    let query = `api/c_tipocomprobante_compras?idtipocomp=eq[${ idtipocomp }]`;
    let url = this.preUrl + query;
    console.log('url consulta tipo comprobante (compras): ' + url)

    return this.http.get( url , { headers });
  }

  getTipoComprobanteAfip(idtipocomp:string, letra:string, token:string){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_tipocomprobanteafip?tcom=${ idtipocomp }&letra=${ letra }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}

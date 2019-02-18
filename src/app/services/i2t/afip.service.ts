import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class AFIPInternoService {

  //compraProveedores:any [] = [];
  //preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";
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

  getCategoriasIVA( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_categoriasiva`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCategoriaIVA( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_categoriasiva/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getModelosImpuesto( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_modeloimpuestos`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getImpuestos( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_impuestos`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getGruposRefContable( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_gruporefcontablearticulo`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getAlicuotas( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_alicuotas`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getAlicuotasPorTipo( tipo:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_alicuotas?tipo=eq[${ tipo }]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  constatarComprobantes( token:string, body:string){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/afip/wscdc/ComprobanteConstatar`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  a5GetPersona( token:string, body:string){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    //ejemplo del json para este body
    /*{
        "token": "Token",
        "sign": "Sign",
        "cuitRepresentada": 30709041483,
        "idPersona": 20221064233
    }*/

    let query = `api/afip/sr-padron/getPersona`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }
}

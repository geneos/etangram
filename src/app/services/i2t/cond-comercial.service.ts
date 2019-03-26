import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class CondicionComercialService {

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

  getCondiciones( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_condicioncomercial`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCondicion( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_condicioncomercial/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCondicionPorID( idCondicion:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_condicioncomercial?idcondicion=eq[${ idCondicion }]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  //tg01_condicioncomercial, para la condicion de comercializacion. considerar filtro deleted = 0, estado = 0, origen = “COM”
  getCondicionPorIDCompra( idCondicion:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_condicioncomercial?idcondicion=eq[${ idCondicion }]&estado=0&deleted=0&origen=COM`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}

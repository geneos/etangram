import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class RefContablesService {

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

  getRefContables( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_referenciascontables/?deleted=eq[0]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getRefContablesSinCuenta( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/ReferenciasContablesSinAsignar`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getRefContablesPorCuenta( token:string , idCuenta:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_referenciascontables/?deleted=eq[0]&tg01_cuentascontables_id_c=lk[${ idCuenta }]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getRefContable( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_referenciascontables/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  postRefContable( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/tg01_referenciascontables`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  putRefContable( id:string, body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/tg01_referenciascontables/${ id }`;
    let url = this.preUrl + query;

    return this.http.put( url, body, { headers });
  }


}

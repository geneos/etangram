import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

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

  // getLocalidades( token:string ){
  //   const headers = new HttpHeaders({
  //     'x-access-token': token
  //   });

  //   let query = `api/organizacion`;
  //   let url = this.preUrl + query;

  //   return this.http.get( url , { headers });
  // }

  getLocalidades( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_localidades?cpostal=eq[${ id }]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getProvincias( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_provincias/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

}

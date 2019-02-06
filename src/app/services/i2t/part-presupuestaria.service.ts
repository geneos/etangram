import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class PartidasPresupuestariasService {

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

  getPartidas( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg05_partidas_presupuestaria`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getPartida( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg05_partidas_presupuestaria?codigo_partida=eq[${ id }]`;
    let url = this.preUrl + query;
    console.log('url consulta partida: ' + url)
    return this.http.get( url , { headers });
  }

}

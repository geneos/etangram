import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class CategoriasBloqueoService {

  //compraProveedores:any [] = [];
  //preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";
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

  getCategorias( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_categoriabloqueo`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCategoria( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_categoriabloqueo/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCategoriasDeUnTipo(tipo:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_categoriabloqueo?tipo=eq[${ tipo }]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
/* 
  getCategoriaDeUnTipo(tipo:string, id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_categoriabloqueo/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  } */
}

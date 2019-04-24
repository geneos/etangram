import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

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

  getUsuarios( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/usuario`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getUsuario( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/usuario/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getUsuarioPorUsername( username:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/usuario/?user_name=${ username }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}

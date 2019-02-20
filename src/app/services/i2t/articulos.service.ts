import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

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

  getArticulos( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/articulo`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getArticulo( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/articulo?codigo=eq[${ id }]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getcArticulos( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_articulos`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getcArticulo( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_articulos/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCategorias( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_producto_categoria`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCategoria( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_producto_categoria/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getMarcas( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tglp_tg_marcas`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getMarca( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tglp_tg_marcas/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getAtributos(token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_atributosarticulos?codigo=0`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getValoresAtributo(id: string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_atributosarticulos?idatributo=${ id }&codigo=gt[0] `;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}

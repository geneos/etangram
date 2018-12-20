import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const operadores = [
  { equal : 'eq'},  //igual que
  { not: 'not' },   //distinto de
  { less_than: 'lt' },  //menor que
  { less_equal: 'le' }, //menor o igual que
  { greater_than: 'gt' },//mayor que.
  { greater_equal: 'ge' },//mayor o igual que.
  { like: 'lk' },//like, ídem SQL.
  { in: 'in' }//in a set, ídem SQL
]

const valores = [
  { null: 'isnull'},
  { notnull: 'isnotnull'}
]

const otros = [
  { orderby: '_orderby'},
  { include: '_include'},
  { exclude: '_exclude'},
  { limit: '_limit'},
  { offset: '_offset'}
]


@Injectable({
  providedIn: 'root'
})
export class ConsultaDinamicaService {

  //compraProveedores:any [] = [];
  preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";

  constructor( private http:HttpClient ) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getReportes( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg06_tg_reportes`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getReporte( name:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg06_tg_reportes?name=eq${name}`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getAtributos( name:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg06_tg_atributos?tabla=eq[${name}]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getDatos( name:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/${name}`;
    //armado de consulta

    //
    
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}
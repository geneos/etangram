import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  preUrl:string = PreUrl;
 
  constructor( private http:HttpClient ) { }

  getUnidadMedida( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_unidadmedida`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}

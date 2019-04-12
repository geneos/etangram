import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class RemesasService {

  preUrl:string = PreUrl;

  constructor( private http:HttpClient ) { }

  getRemesas( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg11_remesas`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
}

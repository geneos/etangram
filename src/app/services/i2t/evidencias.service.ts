import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class EvidenciasService {

  preUrl:string = PreUrl;

  constructor( private http:HttpClient ) { }

  registrarEvidencia( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/SP_ET_EvidenciaOP_INS`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }
}
